import { type Session, type InsertSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createSession(session: InsertSession): Promise<Session>;
  getAllSessions(): Promise<Session[]>;
  getSessionsByDate(date: Date): Promise<Session[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session>;

  constructor() {
    this.sessions = new Map();
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = randomUUID();
    const session: Session = {
      ...insertSession,
      id,
      timestamp: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getAllSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async getSessionsByDate(date: Date): Promise<Session[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Array.from(this.sessions.values())
      .filter((session) => {
        const sessionTime = session.timestamp.getTime();
        return sessionTime >= startOfDay.getTime() && sessionTime <= endOfDay.getTime();
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const storage = new MemStorage();
