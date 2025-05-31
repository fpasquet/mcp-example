#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { McpServer } from './mcp-server.js';

async function run() {
  const mcpServer = new McpServer();
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.error('MCP server started successfully on stdio');
}

run().catch((error) => {
  console.error('Fatal error in run():', error);
  process.exit(1);
});
