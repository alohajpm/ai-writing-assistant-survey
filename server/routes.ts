import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertSurveyResponseSchema, surveyResponseUpdateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get survey response by session ID
  app.get("/api/survey/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const response = await storage.getSurveyResponse(sessionId);
      
      if (!response) {
        return res.status(404).json({ message: "Survey response not found" });
      }
      
      res.json(response);
    } catch (error) {
      console.error("Error fetching survey response:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new survey response
  app.post("/api/survey", async (req, res) => {
    try {
      const validatedData = insertSurveyResponseSchema.parse(req.body);
      
      // Check if session already exists
      const existing = await storage.getSurveyResponse(validatedData.sessionId);
      if (existing) {
        return res.status(409).json({ message: "Survey response already exists for this session" });
      }
      
      const response = await storage.createSurveyResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating survey response:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update existing survey response
  app.put("/api/survey/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const validatedData = surveyResponseUpdateSchema.parse(req.body);
      
      const response = await storage.updateSurveyResponse(sessionId, validatedData);
      
      if (!response) {
        return res.status(404).json({ message: "Survey response not found" });
      }
      
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error updating survey response:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete survey response
  app.delete("/api/survey/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const deleted = await storage.deleteSurveyResponse(sessionId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Survey response not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting survey response:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export survey response as JSON
  app.get("/api/survey/:sessionId/export", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const response = await storage.getSurveyResponse(sessionId);
      
      if (!response) {
        return res.status(404).json({ message: "Survey response not found" });
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="ai-writing-preferences-${sessionId}.json"`);
      res.json(response);
    } catch (error) {
      console.error("Error exporting survey response:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
