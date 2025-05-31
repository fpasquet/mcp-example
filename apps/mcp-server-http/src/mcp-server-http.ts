import { registerMcpServerHttp } from '@repo/mcp/utils/register-mcp-server-http';
import cors from 'cors';
import express from 'express';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(cors());
app.use(express.json());
registerMcpServerHttp(app);

app.listen(PORT, () => {
  console.error(`MCP HTTP server started on port ${PORT}`);
  console.error(`HTTP endpoint: http://localhost:${PORT}/mcp`);
});
