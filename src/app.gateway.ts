import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from './prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Клиент подключился: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Клиент отключился: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { username: string }) {
    (client.data as { username: string }).username = payload.username;
    console.log(`Пользователь ${payload.username} присоединился к чату`);
    client.broadcast.emit('userJoined', { username: payload.username });
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { text: string }) {
    const username =
      (client.data as { username?: string }).username || 'Аноним';

    try {
      // Сохраняем сообщение в базу данных
      const message = await this.prisma.chat.create({
        data: {
          username,
          text: payload.text,
        },
      });

      // Отправляем сообщение всем клиентам
      this.server.emit('message', {
        id: message.id,
        username: message.username,
        text: message.text,
        createdAt: message.createdAt,
      });
    } catch (error) {
      console.error('Ошибка при сохранении сообщения:', error);
      client.emit('error', { message: 'Не удалось отправить сообщение' });
    }
  }

  @SubscribeMessage('getHistory')
  async handleGetHistory(client: Socket) {
    try {
      const messages = await this.prisma.chat.findMany({
        orderBy: { createdAt: 'asc' },
        take: 50, // Последние 50 сообщений
      });

      client.emit('history', messages);
    } catch (error) {
      console.error('Ошибка при получении истории:', error);
      client.emit('error', {
        message: 'Не удалось загрузить историю сообщений',
      });
    }
  }
}
