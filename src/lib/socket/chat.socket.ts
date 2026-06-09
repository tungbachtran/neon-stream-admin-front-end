import { io, Socket } from 'socket.io-client';
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
class AdminChatSocket {
  private socket: Socket | null = null;

  connect(token: string): Socket {
    if (this.socket?.connected) return this.socket;

    this.socket = io(
      `${API_URL}/admin-chat`,
      {
        auth: { token },
        withCredentials: true,
      transports: ['websocket'],
      },
    );

    this.socket.on('connect', () =>
      console.log('✅ [Admin] Chat socket connected'),
    );
    this.socket.on('disconnect', () =>
      console.log('❌ [Admin] Chat socket disconnected'),
    );

    return this.socket;
  }

  get instance(): Socket | null {
    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const adminChatSocket = new AdminChatSocket();
