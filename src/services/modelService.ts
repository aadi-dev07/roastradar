
import { AIModel, AI_MODELS } from "@/types/analysis";

// Get available models
export const getAvailableModels = (): AIModel[] => {
  return AI_MODELS;
};

// Get models grouped by provider
export const getModelsByProvider = (): Record<string, AIModel[]> => {
  const modelsByProvider: Record<string, AIModel[]> = {};
  
  AI_MODELS.forEach(model => {
    if (!modelsByProvider[model.provider]) {
      modelsByProvider[model.provider] = [];
    }
    modelsByProvider[model.provider].push(model);
  });
  
  return modelsByProvider;
};

// Get free models
export const getFreeModels = (): AIModel[] => {
  return AI_MODELS.filter(model => model.isFree === true);
};

// Get the default model
export const getDefaultModel = (): AIModel => {
  return AI_MODELS.find(model => model.id === 'google/gemini-1.0-pro') || AI_MODELS[0];
};

// Find model by ID
export const getModelById = (modelId: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === modelId);
};
