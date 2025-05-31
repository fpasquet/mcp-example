import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { GetWeeklyReportSchema, PROMPTS, weeklyReport } from './prompts.js';
import { RESOURCES, RULES } from './resources.js';
import {
  addPointsToAstronaut,
  AddPointsToAstronaut,
  getPlanetRankings,
  searchAstronaut,
  SearchAstronautSchema,
  TOOLS,
} from './tools.js';

export class McpServer extends Server {
  constructor() {
    super(
      {
        name: 'mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      }
    );
    this.setupPromptHandlers();
    this.setupResourceHandlers();
    this.setupToolHandlers();
  }

  private setupPromptHandlers() {
    this.setRequestHandler(ListPromptsRequestSchema, () => {
      return {
        prompts: PROMPTS,
      };
    });
    this.setRequestHandler(GetPromptRequestSchema, (request) => {
      try {
        switch (request.params.name) {
          case 'weekly_report': {
            const args = GetWeeklyReportSchema.parse(request.params.arguments);
            return weeklyReport(args.weekNumber);
          }
          default:
            throw new Error(`Unknown prompt: ${request.params.name}`);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
        }
        throw error;
      }
    });
  }

  private setupResourceHandlers() {
    this.setRequestHandler(ListResourcesRequestSchema, () => {
      return {
        resources: RESOURCES,
      };
    });

    this.setRequestHandler(ReadResourceRequestSchema, (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'file://rules.md':
          return {
            contents: [
              {
                mimeType: 'text/markdown',
                text: RULES,
                uri,
              },
            ],
          };
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });
  }

  private setupToolHandlers() {
    this.setRequestHandler(ListToolsRequestSchema, () => {
      return {
        tools: TOOLS,
      };
    });
    this.setRequestHandler(CallToolRequestSchema, (request) => {
      try {
        switch (request.params.name) {
          case 'search_astronaut': {
            const args = SearchAstronautSchema.parse(request.params.arguments);
            return searchAstronaut(args);
          }
          case 'add_points_to_astronaut': {
            const args = AddPointsToAstronaut.parse(request.params.arguments);
            return addPointsToAstronaut(args);
          }
          case 'get_planet_rankings':
            return getPlanetRankings();
          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
        }
        throw error;
      }
    });
  }
}
