import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { aiService } from '../../server/ai-service';
import { surveyDataSchema } from '../../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const previewSchema = z.object({
      content: z.string().min(1, "Content is required"),
      surveyData: surveyDataSchema
    });

    const { content, surveyData } = previewSchema.parse(req.body);
    
    const preview = await aiService.generatePreview({ content, surveyData });
    return res.json(preview);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Error generating AI preview:", error);
    return res.status(500).json({ message: "Failed to generate preview" });
  }
}