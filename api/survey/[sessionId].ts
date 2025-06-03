import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { storage } from '../../server/storage';
import { surveyResponseUpdateSchema } from '../../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { sessionID } = req.query;

  if (typeof sessionId !== 'string') {
    return res.status(400).json({ message: 'Invalid session ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const response = await storage.getSurveyResponse(sessionId);
        
        if (!response) {
          return res.status(404).json({ message: "Survey response not found" });
        }
        
        return res.json(response);

      case 'PUT':
        const validatedData = surveyResponseUpdateSchema.parse(req.body);
        
        const updatedResponse = await storage.updateSurveyResponse(sessionId, validatedData);
        
        if (!updatedResponse) {
          return res.status(404).json({ message: "Survey response not found" });
        }
        
        return res.json(updatedResponse);

      case 'DELETE':
        const deleted = await storage.deleteSurveyResponse(sessionId);
        
        if (!deleted) {
          return res.status(404).json({ message: "Survey response not found" });
        }
        
        return res.status(204).send();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Error handling survey request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}