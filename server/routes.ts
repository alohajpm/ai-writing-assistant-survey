import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertSurveyResponseSchema, surveyResponseUpdateSchema, surveyDataSchema } from "@shared/schema";
import { aiService } from "./ai-service";

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

  // AI Preview endpoint
  app.post("/api/ai/preview", async (req, res) => {
    try {
      const previewSchema = z.object({
        content: z.string().min(1, "Content is required"),
        surveyData: surveyDataSchema
      });

      const { content, surveyData } = previewSchema.parse(req.body);
      
      const preview = await aiService.generatePreview({ content, surveyData });
      res.json(preview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error generating AI preview:", error);
      res.status(500).json({ message: "Failed to generate preview" });
    }
  });

  // Style Analysis endpoint
  app.post("/api/ai/analyze-style", async (req, res) => {
    try {
      const styleSchema = z.object({
        samples: z.array(z.object({
          title: z.string(),
          content: z.string()
        })).min(1, "At least one writing sample is required")
      });

      const { samples } = styleSchema.parse(req.body);
      
      const analysis = await aiService.analyzeWritingStyle({ samples });
      res.json(analysis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error analyzing writing style:", error);
      res.status(500).json({ message: "Failed to analyze writing style" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
