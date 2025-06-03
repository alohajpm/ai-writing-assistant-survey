import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { aiService } from '../../server/ai-service';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const styleSchema = z.object({
      samples: z.array(z.object({
        title: z.string(),
        content: z.string()
      })).min(1, "At least one writing sample is required")
    });

    const { samples } = styleSchema.parse(req.body);
    
    const analysis = await aiService.analyzeWritingStyle({ samples });
    return res.json(analysis);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    console.error("Error analyzing writing style:", error);
    return res.status(500).json({ message: "Failed to analyze writing style" });
  }
}