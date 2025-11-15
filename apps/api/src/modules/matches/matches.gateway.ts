import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { MatchBaseDto } from './dtos/match.dto';

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const configService = new ConfigService();
      const allowedOrigins = [
        configService.get<string>('WEB_ORIGIN'),
        configService.get<string>('API_ORIGIN'),
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
  namespace: '/matches',
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  connectTimeout: 45000, // 45 seconds
  maxHttpBufferSize: 1e6, // 1 MB
  transports: ['websocket', 'polling'],
})
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MatchesGateway.name);
  private readonly connectedClients = new Map<
    string,
    { rooms: Set<string>; connectedAt: Date }
  >();

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');

    // Monitor server metrics every 5 minutes
    setInterval(() => {
      this.logServerMetrics();
    }, 5 * 60 * 1000);
  }

  handleConnection(client: Socket) {
    const clientIp =
      client.handshake.headers['x-forwarded-for'] || client.handshake.address;

    this.logger.log(
      `Client connected: ${client.id} from ${clientIp} (transport: ${client.conn.transport.name})`,
    );

    this.connectedClients.set(client.id, {
      rooms: new Set(),
      connectedAt: new Date(),
    });

    // Send welcome message
    client.emit('connected', {
      clientId: client.id,
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    const clientData = this.connectedClients.get(client.id);
    const connectionDuration = clientData
      ? Date.now() - clientData.connectedAt.getTime()
      : 0;

    this.logger.log(
      `Client disconnected: ${client.id} (duration: ${Math.round(connectionDuration / 1000)}s, rooms: ${clientData?.rooms.size || 0})`,
    );

    this.connectedClients.delete(client.id);
  }

  private logServerMetrics() {
    const totalClients = this.connectedClients.size;
    const totalRooms = this.server.sockets.adapter.rooms.size;

    this.logger.log(
      `WebSocket Metrics: ${totalClients} clients connected, ${totalRooms} rooms active`,
    );
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.join(`room:${roomId}`);

      // Track room membership
      const clientData = this.connectedClients.get(client.id);
      if (clientData) {
        clientData.rooms.add(roomId);
      }

      this.logger.log(`Client ${client.id} joined room: ${roomId}`);

      // Confirm join to client
      client.emit('roomJoined', { roomId, timestamp: new Date().toISOString() });

      return { success: true, roomId };
    } catch (error) {
      this.logger.error(
        `Error joining room ${roomId} for client ${client.id}:`,
        error,
      );
      return { success: false, error: 'Failed to join room' };
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.leave(`room:${roomId}`);

      // Remove room from tracking
      const clientData = this.connectedClients.get(client.id);
      if (clientData) {
        clientData.rooms.delete(roomId);
      }

      this.logger.log(`Client ${client.id} left room: ${roomId}`);

      // Confirm leave to client
      client.emit('roomLeft', { roomId, timestamp: new Date().toISOString() });

      return { success: true, roomId };
    } catch (error) {
      this.logger.error(
        `Error leaving room ${roomId} for client ${client.id}:`,
        error,
      );
      return { success: false, error: 'Failed to leave room' };
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    // Respond to client ping for connection health check
    client.emit('pong', { timestamp: new Date().toISOString() });
    return { success: true };
  }

  // Method called by the service when a match is created
  emitMatchCreated(roomId: string, match: MatchBaseDto, movie?: unknown) {
    this.logger.log(`Emitting match created for room: ${roomId}`);
    this.server.to(`room:${roomId}`).emit('matchCreated', {
      roomId,
      match,
      movie,
    });
  }
}
