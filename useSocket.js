// useSocket.js — Socket.io hook for real-time room updates
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Platform } from 'react-native';

const SOCKET_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export default function useSocket({ onRoomClaimed }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    // Real-time: another user claimed a room
    socket.on('room:claimed', (data) => {
      console.log('📡 Room claimed via socket:', data.roomNumber);
      if (onRoomClaimed) onRoomClaimed(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef;
}
