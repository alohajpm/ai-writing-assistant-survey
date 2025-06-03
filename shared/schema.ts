import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  tone: text("tone").notNull(),
  sentenceLength: integer("sentence_length").notNull().default(3),
  vocabulary: integer("vocabulary").notNull().default(3),
  formality: integer("formality").notNull().default(3),
  examples: integer("examples").notNull().default(3),
  audiences: jsonb("audiences").$type<string[]>().notNull().default([]),
  contentTypes: jsonb("content_types").$type<string[]>().notNull().default([]),
  personality: jsonb("personality").$type<string[]>().notNull().default([]),
  useBulletPoints: boolean("use_bullet_points").notNull().default(false),
  useHeaders: boolean("use_headers").notNull().default(false),
  useCTA: boolean("use_cta").notNull().default(false),
  industry: text("industry"),
  customInstructions: text("custom_instructions"),
  audienceContext: text("audience_context"),
  completedAt: text("completed_at").notNull()
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  completedAt: true
});

export const surveyResponseUpdateSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  sessionId: true,
  completedAt: true
});

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type UpdateSurveyResponse = z.infer<typeof surveyResponseUpdateSchema>;

// Survey data structure for frontend state management
export const surveyDataSchema = z.object({
  tone: z.string().optional(),
  style: z.object({
    sentenceLength: z.number().min(1).max(5).default(3),
    vocabulary: z.number().min(1).max(5).default(3),
    formality: z.number().min(1).max(5).default(3),
    examples: z.number().min(1).max(5).default(3)
  }).default({}),
  audiences: z.array(z.string()).default([]),
  contentTypes: z.array(z.string()).default([]),
  personality: z.array(z.string()).default([]),
  preferences: z.object({
    useBulletPoints: z.boolean().default(false),
    useHeaders: z.boolean().default(false),
    useCTA: z.boolean().default(false)
  }).default({}),
  industry: z.string().optional(),
  customInstructions: z.string().optional(),
  audienceContext: z.string().optional()
});

export type SurveyData = z.infer<typeof surveyDataSchema>;
