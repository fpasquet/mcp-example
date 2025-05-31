import type { Express, Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'node:crypto';

import { McpServer } from '../mcp-server.js';

interface McpServerOptions {
  enableSessions?: boolean;
}

export function registerMcpServerHttp(app: Express, options: McpServerOptions = {}) {
  const { enableSessions = true } = options;

  // Map to store transports by session ID (only used if sessions are enabled)
  const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, mcp-session-id');
    next();
  });

  if (enableSessions) {
    // Stateful mode with session support
    console.log('MCP Server: Running in stateful mode (sessions enabled)');

    // Handle POST requests for client-to-server communication
    app.post('/mcp', async (req, res) => {
      console.error(`MCP POST request from ${req.ip}`);

      try {
        // Check for existing session ID
        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        let transport: StreamableHTTPServerTransport;

        if (sessionId && transports[sessionId]) {
          // Reuse existing transport
          transport = transports[sessionId];
        } else if (!sessionId && isInitializeRequest(req.body)) {
          // New initialization request
          transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sessionId) => {
              // Store the transport by session ID
              transports[sessionId] = transport;
            },
          });

          // Clean up transport when closed
          transport.onclose = () => {
            if (transport.sessionId) {
              delete transports[transport.sessionId];
            }
          };

          const mcpServer = new McpServer();
          // Connect to the MCP server
          await mcpServer.connect(transport);
        } else {
          // Invalid request
          res.status(400).json({
            jsonrpc: '2.0',
            error: {
              code: -32000,
              message: 'Bad Request: No valid session ID provided',
            },
            id: null,
          });
          return;
        }

        // Handle the request
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('MCP POST error:', error);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal error',
            },
            id: null,
          });
        }
      }
    });

    // Reusable handler for GET and DELETE requests
    const handleSessionRequest = async (req: ExpressRequest, res: ExpressResponse) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
      }

      const transport = transports[sessionId];
      await transport.handleRequest(req, res);
    };

    // Handle GET requests for server-to-client notifications via SSE
    app.get('/mcp', handleSessionRequest);

    // Handle DELETE requests for session termination
    app.delete('/mcp', handleSessionRequest);
  } else {
    // Stateless mode without session support
    console.log('MCP Server: Running in stateless mode (sessions disabled)');

    app.post('/mcp', async (req, res) => {
      console.error(`MCP POST request from ${req.ip} (stateless)`);

      // In stateless mode, create a new instance of transport and server for each request
      // to ensure complete isolation. A single instance would cause request ID collisions
      // when multiple clients connect concurrently.

      try {
        const mcpServer = new McpServer();
        const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });

        res.on('close', () => {
          Promise.all([transport.close(), mcpServer.close()])
            .then(() => {
              console.log('Request closed');
            })
            .catch((error) => {
              console.error('Error closing request:', error);
            });
        });

        await mcpServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
    });

    app.get('/mcp', (_, res) => {
      console.log('Received GET MCP request (stateless mode)');
      res.writeHead(405).end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Method not allowed.',
          },
          id: null,
        })
      );
    });

    app.delete('/mcp', (_, res) => {
      console.log('Received DELETE MCP request (stateless mode)');
      res.writeHead(405).end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Method not allowed.',
          },
          id: null,
        })
      );
    });
  }
}
