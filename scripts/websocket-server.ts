import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { parse } from 'url';
import jwt from 'jsonwebtoken';

// Simple in-memory store for connections per tenant
const tenantConnections = new Map<string, Set<WebSocket>>();

function addConnection(tenantId: string, ws: WebSocket) {
  if (!tenantConnections.has(tenantId)) {
    tenantConnections.set(tenantId, new Set());
  }
  tenantConnections.get(tenantId)!.add(ws);
  
  ws.on('close', () => {
    tenantConnections.get(tenantId)?.delete(ws);
    if (tenantConnections.get(tenantId)?.size === 0) {
      tenantConnections.delete(tenantId);
    }
  });
}

function broadcastToTenant(tenantId: string, message: object) {
  const connections = tenantConnections.get(tenantId);
  if (!connections) return;
  
  const data = JSON.stringify(message);
  connections.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

// HTTP server untuk WebSocket upgrade
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'WebSocket server running', tenants: tenantConnections.size }));
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const url = parse(req.url || '', true);
  const token = url.query.token as string;
  
  if (!token) {
    ws.close(4001, 'Token required');
    return;
  }
  
  try {
    // Verify JWT token (Clerk session token or custom)
    // For simplicity, expect tenantId in token payload
    const decoded = jwt.verify(token, process.env.WS_JWT_SECRET || 'dev-secret') as { tenantId: string; userId: string };
    const tenantId = decoded.tenantId;
    
    if (!tenantId) {
      ws.close(4002, 'Invalid token: no tenantId');
      return;
    }
    
    console.log(`[WS] Client connected: tenant=${tenantId}, user=${decoded.userId}`);
    addConnection(tenantId, ws);
    
    // Send welcome
    ws.send(JSON.stringify({ type: 'connected', tenantId }));
    
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        // Handle ping/pong, subscription changes, etc.
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        }
      } catch {}
    });
    
  } catch (err) {
    console.error('[WS] Auth failed:', err);
    ws.close(4003, 'Invalid token');
  }
});

const PORT = parseInt(process.env.WS_PORT || '3001', 10);

server.listen(PORT, () => {
  console.log(`[WS] WebSocket server running on port ${PORT}`);
  console.log(`[WS] Connect: ws://localhost:${PORT}?token=<JWT>`);
});

// Export broadcast function for API routes
export { broadcastToTenant };

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[WS] Shutting down...');
  tenantConnections.forEach(connections => {
    connections.forEach(ws => ws.close(1001, 'Server shutting down'));
  });
  server.close(() => process.exit(0));
});