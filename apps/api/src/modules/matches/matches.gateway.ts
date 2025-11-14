import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

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
})
export class MatchesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MatchesGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`room:${roomId}`);
    this.logger.log(`Client ${client.id} joined room: ${roomId}`);
    return { success: true, roomId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`room:${roomId}`);
    this.logger.log(`Client ${client.id} left room: ${roomId}`);
    return { success: true, roomId };
  }

  // Method called by the service when a match is created
  emitMatchCreated(roomId: string, match: any, movie?: any) {
    this.logger.log(`Emitting match created for room: ${roomId}`);
    this.server.to(`room:${roomId}`).emit('matchCreated', {
      roomId,
      match,
      movie,
    });
  }
}
