import type {
  ToolSchema,
  PromptSchema,
  ResourceSchema,
  ResourceTemplateSchema,
} from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

export interface MCPAvailableCapabilities {
  tools: z.infer<typeof ToolSchema>[];
  resources: z.infer<typeof ResourceSchema>[];
  resourceTemplates: z.infer<typeof ResourceTemplateSchema>[];
  prompts: z.infer<typeof PromptSchema>[];
}
