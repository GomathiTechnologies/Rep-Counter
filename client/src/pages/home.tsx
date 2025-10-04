import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Play } from "lucide-react";
import { useLocation } from "wouter";
import { type Session } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: todaySessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions/today"],
  });

  const totalReps = todaySessions.reduce((sum, session) => sum + session.reps, 0);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-8 pb-4">
          <div className="flex items-center justify-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Rep Counter</h1>
          </div>
          <p className="text-muted-foreground">Track your workout repetitions with AI</p>
        </div>

        <Button
          size="lg"
          className="w-full h-16 text-lg"
          onClick={() => setLocation("/track")}
          data-testid="button-start-tracking"
        >
          <Play className="mr-2 h-6 w-6" />
          Start Tracking
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daily Report</span>
              <span className="text-sm font-normal text-muted-foreground">{today}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : todaySessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sessions recorded today</p>
                <p className="text-sm mt-2">Start tracking to see your progress!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-primary" data-testid="text-total-reps">
                    {totalReps}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Reps Today</div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">Sessions</h3>
                  {todaySessions.map((session) => (
                    <Card key={session.id} data-testid={`card-session-${session.id}`}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <div className="font-semibold capitalize" data-testid={`text-exercise-${session.id}`}>
                            {session.exerciseName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(session.timestamp).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-primary" data-testid={`text-reps-${session.id}`}>
                          {session.reps}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        onClick={() => setLocation("/track")}
        data-testid="button-floating-start"
      >
        <Play className="h-8 w-8" />
      </Button>
    </div>
  );
}
