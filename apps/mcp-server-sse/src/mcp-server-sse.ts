import { registerMcpServerSse } from '@repo/mcp/utils/register-mcp-server-sse';
import cors from 'cors';
import express from 'express';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(cors());
registerMcpServerSse(app);

app.listen(PORT, () => {
  console.error(`MCP SSE server started on port ${PORT}`);
  console.error(`SSE endpoint: http://localhost:${PORT}/sse`);
});
