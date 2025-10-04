import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Camera } from "lucide-react";
import { useLocation } from "wouter";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertSession } from "@shared/schema";

type ExerciseType = "squats" | "bicep curls" | "push-ups" | "jumping jacks" | "lunges";

export default function Track() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setLocation] = useLocation();
  const [repCount, setRepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const { toast } = useToast();

  const positionHistoryRef = useRef<number[]>([]);
  const lastDirectionRef = useRef<"up" | "down" | null>(null);
  const lastExtremaRef = useRef<number>(0);
  const movementHistoryRef = useRef<{ type: string; count: number }[]>([]);

  const saveSessionMutation = useMutation({
    mutationFn: async (data: InsertSession) => {
      return await apiRequest("POST", "/api/sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({
        title: "Session Saved!",
        description: "Your workout has been recorded.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const initPoseDetection = async () => {
      await tf.ready();
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      };
      const det = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      setDetector(det);
      detectorRef.current = det;
    };

    initPoseDetection();

    return () => {
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    if (!detector || !isTracking || !videoRef.current || !canvasRef.current) return;

    let animationId: number;

    const detectPose = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const poses = await detector.estimatePoses(videoRef.current);

        if (poses.length > 0 && canvasRef.current) {
          const pose = poses[0];
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          if (ctx && videoRef.current) {
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            pose.keypoints.forEach((keypoint) => {
              if (keypoint.score && keypoint.score > 0.3) {
                ctx.beginPath();
                ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "#0ea5e9";
                ctx.fill();
              }
            });

            detectRepetition(pose);
          }
        }
      }

      animationId = requestAnimationFrame(detectPose);
    };

    detectPose();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [detector, isTracking]);

  const detectRepetition = (pose: poseDetection.Pose) => {
    const leftHip = pose.keypoints.find((kp) => kp.name === "left_hip");
    const rightHip = pose.keypoints.find((kp) => kp.name === "right_hip");
    const leftShoulder = pose.keypoints.find((kp) => kp.name === "left_shoulder");
    const rightShoulder = pose.keypoints.find((kp) => kp.name === "right_shoulder");

    if (!leftHip || !rightHip || !leftShoulder || !rightShoulder) return;

    const avgHipY = (leftHip.y + rightHip.y) / 2;
    const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const centerY = (avgHipY + avgShoulderY) / 2;

    positionHistoryRef.current.push(centerY);
    
    if (positionHistoryRef.current.length > 10) {
      positionHistoryRef.current.shift();
    }

    if (positionHistoryRef.current.length < 5) return;

    const recentPositions = positionHistoryRef.current.slice(-5);
    const avgRecent = recentPositions.reduce((a, b) => a + b, 0) / recentPositions.length;
    
    const movementThreshold = 30;
    
    if (lastExtremaRef.current === 0) {
      lastExtremaRef.current = avgRecent;
      lastDirectionRef.current = null;
      return;
    }
    
    const diff = avgRecent - lastExtremaRef.current;
    
    if (Math.abs(diff) > movementThreshold) {
      const newDirection = diff > 0 ? "down" : "up";
      
      if (newDirection !== lastDirectionRef.current) {
        if (lastDirectionRef.current === "down" && newDirection === "up") {
          setRepCount((prev) => prev + 1);
          trackMovement("rep");
        } else if (newDirection === "down") {
          trackMovement("down");
        }
        lastDirectionRef.current = newDirection;
      }
      
      lastExtremaRef.current = avgRecent;
    }
  };

  const trackMovement = (type: string) => {
    movementHistoryRef.current.push({ type, count: repCount });
    if (movementHistoryRef.current.length > 20) {
      movementHistoryRef.current.shift();
    }
  };

  const identifyExercise = (): ExerciseType => {
    if (repCount < 3) return "squats";

    const movements = movementHistoryRef.current;
    const upDownPattern = movements.filter(
      (m, i) => i > 0 && movements[i - 1].type !== m.type
    ).length;

    if (upDownPattern > 10) {
      return "jumping jacks";
    } else if (repCount > 15) {
      return "push-ups";
    } else if (repCount > 8) {
      return "bicep curls";
    } else {
      return "squats";
    }
  };

  const handleStop = () => {
    setIsTracking(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    
    if (detectorRef.current) {
      detectorRef.current.dispose();
      detectorRef.current = null;
      setDetector(null);
    }
    
    if (repCount > 0) {
      const exerciseName = identifyExercise();
      saveSessionMutation.mutate({
        exerciseName,
        reps: repCount,
      });
    } else {
      setLocation("/");
    }
  };

  const handleStart = async () => {
    if (!detector) {
      await tf.ready();
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      };
      const det = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      setDetector(det);
      detectorRef.current = det;
    }
    
    if (!streamRef.current && videoRef.current) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
          audio: false,
        });
        streamRef.current = mediaStream;
        videoRef.current.srcObject = mediaStream;
      } catch (err) {
        toast({
          title: "Camera Error",
          description: "Unable to access camera. Please check permissions.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsTracking(true);
    setRepCount(0);
    positionHistoryRef.current = [];
    lastDirectionRef.current = null;
    lastExtremaRef.current = 0;
    movementHistoryRef.current = [];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Tracking Mode</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          data-testid="button-close"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <div className="relative w-full max-w-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg bg-black"
            data-testid="video-camera"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
          />

          {!isTracking && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <Button
                size="lg"
                onClick={handleStart}
                data-testid="button-start-detection"
                className="h-16 px-8 text-lg"
              >
                <Camera className="mr-2 h-6 w-6" />
                Start Detection
              </Button>
            </div>
          )}

          <Card className="absolute top-4 right-4 bg-background/90 backdrop-blur">
            <div className="p-6 text-center">
              <div className="text-5xl font-bold text-primary" data-testid="text-rep-count">
                {repCount}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Reps</div>
            </div>
          </Card>
        </div>

        {isTracking && (
          <Button
            size="lg"
            variant="destructive"
            onClick={handleStop}
            className="mt-6 h-14 px-8 text-lg"
            data-testid="button-stop"
            disabled={saveSessionMutation.isPending}
          >
            {saveSessionMutation.isPending ? "Saving..." : "Stop & Save"}
          </Button>
        )}
      </div>
    </div>
  );
}
