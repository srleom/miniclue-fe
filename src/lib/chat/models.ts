export const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast and efficient model for quick responses",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Advanced model with enhanced reasoning capabilities",
  },
  {
    id: "gpt-5-nano",
    name: "GPT-5 Nano",
    description: "The smallest model in the GPT-5 family",
  },
];
