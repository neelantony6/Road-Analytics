import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep existing user table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Road accident reports table
export const roadAccidents = pgTable("road_accidents", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  vehiclesInvolved: integer("vehicles_involved").notNull(),
  injuryCount: integer("injury_count").notNull(),
  medicalAssistance: boolean("medical_assistance").default(false),
  hitAndRun: boolean("hit_and_run").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema for inserting road accident data
export const insertRoadAccidentSchema = createInsertSchema(roadAccidents)
  .omit({ id: true, createdAt: true });

export type InsertRoadAccident = z.infer<typeof insertRoadAccidentSchema>;
export type RoadAccident = typeof roadAccidents.$inferSelect;

// Traffic reports table
export const trafficReports = pgTable("traffic_reports", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  location: text("location").notNull(),
  severity: integer("severity").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema for inserting traffic report
export const insertTrafficReportSchema = createInsertSchema(trafficReports)
  .omit({ id: true, createdAt: true });

export type InsertTrafficReport = z.infer<typeof insertTrafficReportSchema>;
export type TrafficReport = typeof trafficReports.$inferSelect;


// Keep existing tables
export const safetySuggestions = pgTable("safety_suggestions", {
  id: serial("id").primaryKey(),
  suggestion: text("suggestion").notNull(),
  category: text("category").notNull(),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trafficConditions = pgTable("traffic_conditions", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  congestionLevel: integer("congestion_level").notNull(),
  safetyRating: integer("safety_rating").notNull(),
  timeOfDay: text("time_of_day").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Keep existing validation schemas
export const insertSafetySuggestionSchema = createInsertSchema(safetySuggestions)
  .omit({ id: true, upvotes: true, createdAt: true });

export const insertTrafficConditionSchema = createInsertSchema(trafficConditions)
  .omit({ id: true, createdAt: true });

// Keep existing types
export type InsertSafetySuggestion = z.infer<typeof insertSafetySuggestionSchema>;
export type InsertTrafficCondition = z.infer<typeof insertTrafficConditionSchema>;

export type SafetySuggestion = typeof safetySuggestions.$inferSelect;
export type TrafficCondition = typeof trafficConditions.$inferSelect;

// Analytics specific types
export type AccidentTrend = {
  stateUT: string;
  yearlyData: {
    year: number;
    accidents: number;
  }[];
};

export type TopStateAccidents = {
  stateUT: string;
  totalAccidents: number;
};