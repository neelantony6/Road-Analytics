import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const trafficReports = pgTable("traffic_reports", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  location: text("location").notNull(),
  severity: integer("severity").notNull(), // 1-5 scale
  description: text("description").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const safetySuggestions = pgTable("safety_suggestions", {
  id: serial("id").primaryKey(),
  suggestion: text("suggestion").notNull(),
  category: text("category").notNull(), // infrastructure, education, enforcement
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trafficConditions = pgTable("traffic_conditions", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  congestionLevel: integer("congestion_level").notNull(), // 1-5 scale
  safetyRating: integer("safety_rating").notNull(), // 1-5 scale
  timeOfDay: text("time_of_day").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Validation schemas
export const insertTrafficReportSchema = createInsertSchema(trafficReports)
  .omit({ id: true, verified: true, createdAt: true });

export const insertSafetySuggestionSchema = createInsertSchema(safetySuggestions)
  .omit({ id: true, upvotes: true, createdAt: true });

export const insertTrafficConditionSchema = createInsertSchema(trafficConditions)
  .omit({ id: true, createdAt: true });

// Types
export type InsertTrafficReport = z.infer<typeof insertTrafficReportSchema>;
export type InsertSafetySuggestion = z.infer<typeof insertSafetySuggestionSchema>;
export type InsertTrafficCondition = z.infer<typeof insertTrafficConditionSchema>;

export type TrafficReport = typeof trafficReports.$inferSelect;
export type SafetySuggestion = typeof safetySuggestions.$inferSelect;
export type TrafficCondition = typeof trafficConditions.$inferSelect;