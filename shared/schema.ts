import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exerciseName: text("exercise_name").notNull(),
  reps: integer("reps").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  timestamp: true,
});

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
