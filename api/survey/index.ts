import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { storage } from '../../server/storage';
import { insertSurveyResponseSchema } from '../../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = insertSurveyResponseSchema.parse(req.body);
    
    // Check if session already exists
    const existing = await storage.getSurveyResponse(validatedData.sessionId);
    if (existing) {
      return res.status(409).json({ message: "Survey response already exists for this session" });
    }
    
    const response = await storage.createSurveyResponse(validatedData);
    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Error creating survey response:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}