import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  users, type User, type InsertUser,
  roadAccidents, type RoadAccident, type InsertRoadAccident,
  trafficReports, type TrafficReport, type InsertTrafficReport,
  safetySuggestions, type SafetySuggestion, type InsertSafetySuggestion,
  trafficConditions, type TrafficCondition, type InsertTrafficCondition
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Road Accident methods
  createRoadAccident(report: InsertRoadAccident): Promise<RoadAccident>;
  getRoadAccidents(): Promise<RoadAccident[]>;

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
    if (!db) throw new Error('Database not initialized');
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error('Database not initialized');
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error('Database not initialized');
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Road Accident methods
  async createRoadAccident(report: InsertRoadAccident): Promise<RoadAccident> {
    if (!db) throw new Error('Database not initialized');
    const [newReport] = await db.insert(roadAccidents).values(report).returning();
    return newReport;
  }

  async getRoadAccidents(): Promise<RoadAccident[]> {
    if (!db) throw new Error('Database not initialized');
    return await db.select().from(roadAccidents).orderBy(roadAccidents.date);
  }

  // Traffic Report methods
  async createTrafficReport(report: InsertTrafficReport): Promise<TrafficReport> {
    if (!db) throw new Error('Database not initialized');
    const [newReport] = await db.insert(trafficReports).values(report).returning();
    return newReport;
  }

  async getTrafficReports(): Promise<TrafficReport[]> {
    if (!db) throw new Error('Database not initialized');
    return await db.select().from(trafficReports).orderBy(trafficReports.date);
  }

  // Safety Suggestion methods
  async createSafetySuggestion(suggestion: InsertSafetySuggestion): Promise<SafetySuggestion> {
    if (!db) throw new Error('Database not initialized');
    const [newSuggestion] = await db.insert(safetySuggestions).values(suggestion).returning();
    return newSuggestion;
  }

  async getSafetySuggestions(): Promise<SafetySuggestion[]> {
    if (!db) throw new Error('Database not initialized');
    return await db.select().from(safetySuggestions).orderBy(safetySuggestions.upvotes);
  }

  async upvoteSuggestion(id: number): Promise<SafetySuggestion> {
    if (!db) throw new Error('Database not initialized');
    const [suggestion] = await db.select().from(safetySuggestions).where(eq(safetySuggestions.id, id));
    if (!suggestion) throw new Error('Suggestion not found');

    const [updated] = await db
      .update(safetySuggestions)
      .set({ upvotes: suggestion.upvotes + 1 })
      .where(eq(safetySuggestions.id, id))
      .returning();
    return updated;
  }

  // Traffic Condition methods
  async createTrafficCondition(condition: InsertTrafficCondition): Promise<TrafficCondition> {
    if (!db) throw new Error('Database not initialized');
    const [newCondition] = await db.insert(trafficConditions).values(condition).returning();
    return newCondition;
  }

  async getTrafficConditions(): Promise<TrafficCondition[]> {
    if (!db) throw new Error('Database not initialized');
    return await db.select().from(trafficConditions).orderBy(trafficConditions.createdAt);
  }
}

// Export an instance of DatabaseStorage
export const storage = new DatabaseStorage();