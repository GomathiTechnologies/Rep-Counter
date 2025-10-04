import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/sessions/today", async (req, res) => {
    try {
      const today = new Date();
      const sessions = await storage.getSessionsByDate(today);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
