import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users, type User, type InsertUser,
  trafficReports, type TrafficReport, type InsertTrafficReport,
  safetySuggestions, type SafetySuggestion, type InsertSafetySuggestion,
  trafficConditions, type TrafficCondition, type InsertTrafficCondition
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Traffic Report methods
  createTrafficReport(report: InsertTrafficReport): Promise<TrafficReport>;
  getTrafficReports(): Promise<TrafficReport[]>;

  // Safety Suggestion methods
  createSafetySuggestion(suggestion: InsertSafetySuggestion): Promise<SafetySuggestion>;
  getSafetySuggestions(): Promise<SafetySuggestion[]>;
  upvoteSuggestion(id: number): Promise<SafetySuggestion>;

  // Traffic Condition methods
  createTrafficCondition(condition: InsertTrafficCondition): Promise<TrafficCondition>;
  getTrafficConditions(): Promise<TrafficCondition[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Traffic Report methods
  async createTrafficReport(report: InsertTrafficReport): Promise<TrafficReport> {
    const [newReport] = await db.insert(trafficReports).values(report).returning();
    return newReport;
  }

  async getTrafficReports(): Promise<TrafficReport[]> {
    return await db.select().from(trafficReports).orderBy(trafficReports.date);
  }

  // Safety Suggestion methods
  async createSafetySuggestion(suggestion: InsertSafetySuggestion): Promise<SafetySuggestion> {
    const [newSuggestion] = await db.insert(safetySuggestions).values(suggestion).returning();
    return newSuggestion;
  }

  async getSafetySuggestions(): Promise<SafetySuggestion[]> {
    return await db.select().from(safetySuggestions).orderBy(safetySuggestions.upvotes);
  }

  async upvoteSuggestion(id: number): Promise<SafetySuggestion> {
    // Use SQL expression for incrementing upvotes
    const [updated] = await db
      .update(safetySuggestions)
      .set({ upvotes: db.dynamic.ref(`${safetySuggestions.upvotes.name} + 1`) })
      .where(eq(safetySuggestions.id, id))
      .returning();
    return updated;
  }

  // Traffic Condition methods
  async createTrafficCondition(condition: InsertTrafficCondition): Promise<TrafficCondition> {
    const [newCondition] = await db.insert(trafficConditions).values(condition).returning();
    return newCondition;
  }

  async getTrafficConditions(): Promise<TrafficCondition[]> {
    return await db.select().from(trafficConditions).orderBy(trafficConditions.createdAt);
  }
}

export const storage = new DatabaseStorage();