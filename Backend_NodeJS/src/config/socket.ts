import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

/**
 * Khởi tạo Socket.IO Server kết hợp với HTTP Server
 * @param server Instance HTTP Server của Node.js
 */
export const initSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Bạn có thể tùy chỉnh domain cụ thể của Frontend tại đây khi deploy (ví dụ: http://localhost:3000)
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client đã kết nối Socket.IO thành công: ${socket.id}`);

    // Xử lý sự kiện ngắt kết nối
    socket.on('disconnect', (reason) => {
      console.log(`❌ Client ngắt kết nối (${socket.id}): ${reason}`);
    });
  });

  return io;
};

/**
 * Lấy instance Socket.IO Server để sử dụng phát sự kiện ở các Controllers / Services khác
 */
export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io chưa được khởi tạo! Hãy gọi initSocket(server) trước.');
  }
  return io;
};
