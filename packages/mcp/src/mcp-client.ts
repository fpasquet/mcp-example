import type { StdioServerParameters } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';

import type { MCPAvailableCapabilities } from './types.js';

export interface McpClientOptions {
  /**
   * Provide a name for this client which will be its namespace for all tools and prompts.
   */
  name: string;

  /**
   * Provide a version number for this client (defaults to 1.0.0).
   */
  version?: string;

  /**
   * If you already have an MCP transport you'd like to use, pass it here to connect to the server.
   */
  transport?: Transport;

  /**
   * Start a local server process using the stdio MCP transport.
   */
  serverProcess?: StdioServerParameters;

  /**
   * Connect to a remote server process using the Streamable HTTP MCP transport.
   */
  serverUrl?: string;
}

export class McpClient extends Client {
  constructor(private readonly options: McpClientOptions) {
    super({
      name: options.name ?? 'mcp-client',
      version: options.version ?? '1.0.0',
    });
  }

  async getAvailableCapabilities(): Promise<MCPAvailableCapabilities> {
    const serverCapabilities = this.getServerCapabilities();

    const [resources, resourceTemplates, tools, prompts] = await Promise.all([
      serverCapabilities?.resources ? this.listResources().then((res) => res.resources || []) : Promise.resolve([]),
      serverCapabilities?.resources
        ? this.listResourceTemplates().then((res) => res.resourceTemplates || [])
        : Promise.resolve([]),
      serverCapabilities?.tools ? this.listTools().then((res) => res.tools || []) : Promise.resolve([]),
      serverCapabilities?.prompts ? this.listPrompts().then((res) => res.prompts || []) : Promise.resolve([]),
    ]);

    return {
      tools,
      resources,
      resourceTemplates,
      prompts,
    };
  }

  async initialize(): Promise<void> {
    const transport = await this.createMcpTransport();
    return super.connect(transport);
  }

  private async createMcpTransport() {
    if (this.options.transport) return this.options.transport;

    if (this.options.serverUrl) {
      const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');
      return new StreamableHTTPClientTransport(new URL(this.options.serverUrl));
    }

    if (this.options.serverProcess) {
      const { StdioClientTransport } = await import('@modelcontextprotocol/sdk/client/stdio.js');
      return new StdioClientTransport(this.options.serverProcess);
    }

    throw new Error(
      'Unable to create a server connection with supplied options. Must provide transport, stdio, or httpUrl.'
    );
  }
}
