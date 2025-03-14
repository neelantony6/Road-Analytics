import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRoadAccidentSchema, 
  insertTrafficReportSchema, 
  insertSafetySuggestionSchema, 
  insertTrafficConditionSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Road Accidents
  app.post("/api/accidents", async (req, res) => {
    try {
      const validatedData = insertRoadAccidentSchema.parse(req.body);
      const report = await storage.createRoadAccident(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid accident report data", errors: error.errors });
      } else {
        console.error('Error creating accident report:', error);
        res.status(500).json({ message: "Failed to create accident report" });
      }
    }
  });

  app.get("/api/accidents", async (req, res) => {
    try {
      const reports = await storage.getRoadAccidents();
      res.json(reports);
    } catch (error) {
      console.error('Error fetching accident reports:', error);
      res.status(500).json({ message: "Failed to fetch accident reports" });
    }
  });

  // Traffic Reports
  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertTrafficReportSchema.parse(req.body);
      const report = await storage.createTrafficReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid traffic report data", errors: error.errors });
      } else {
        console.error('Error creating traffic report:', error);
        res.status(500).json({ message: "Failed to create report" });
      }
    }
  });

  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getTrafficReports();
      res.json(reports);
    } catch (error) {
      console.error('Error fetching traffic reports:', error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // Safety Suggestions
  app.post("/api/suggestions", async (req, res) => {
    try {
      const validatedData = insertSafetySuggestionSchema.parse(req.body);
      const suggestion = await storage.createSafetySuggestion(validatedData);
      res.status(201).json(suggestion);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid suggestion data", errors: error.errors });
      } else {
        console.error('Error creating suggestion:', error);
        res.status(500).json({ message: "Failed to create suggestion" });
      }
    }
  });

  app.get("/api/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getSafetySuggestions();
      res.json(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  app.post("/api/suggestions/:id/upvote", async (req, res) => {
    try {
      const suggestion = await storage.upvoteSuggestion(parseInt(req.params.id));
      res.json(suggestion);
    } catch (error) {
      console.error('Error upvoting suggestion:', error);
      res.status(500).json({ message: "Failed to upvote suggestion" });
    }
  });

  // Traffic Conditions
  app.post("/api/conditions", async (req, res) => {
    try {
      const validatedData = insertTrafficConditionSchema.parse(req.body);
      const condition = await storage.createTrafficCondition(validatedData);
      res.status(201).json(condition);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid condition data", errors: error.errors });
      } else {
        console.error('Error creating condition:', error);
        res.status(500).json({ message: "Failed to create condition" });
      }
    }
  });

  app.get("/api/conditions", async (req, res) => {
    try {
      const conditions = await storage.getTrafficConditions();
      res.json(conditions);
    } catch (error) {
      console.error('Error fetching conditions:', error);
      res.status(500).json({ message: "Failed to fetch conditions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}