import type { Express } from 'express';

import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

import { McpServer } from '../mcp-server.js';

export function registerMcpServerSse(app: Express) {
  let transport: SSEServerTransport | null = null;

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
    next();
  });

  app.get('/sse', (req, res) => {
    console.error(`New SSE connection from ${req.ip}`);

    const mcpServer = new McpServer();
    transport = new SSEServerTransport('/messages', res);
    mcpServer.connect(transport).catch((error) => {
      console.error('SSE connection error:', error);
      res.status(500).end();
    });
  });

  app.post('/messages', async (req, res) => {
    if (transport) {
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).send('No active SSE transport');
    }
  });
}
