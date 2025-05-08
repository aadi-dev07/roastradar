
import { AIModel, AI_MODELS } from "@/types/analysis";

// Get available models
export const getAvailableModels = (): AIModel[] => {
  return AI_MODELS;
};

// Get the default model
export const getDefaultModel = (): AIModel => {
  return AI_MODELS[2]; // Default to Gemini Pro
};

// Find model by ID
export const getModelById = (modelId: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === modelId);
};
