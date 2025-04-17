import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import socket from '../socket';
import { ChatMessage } from '../types';

interface ErrorEvent {
    message: string;
}

const ChatRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }
    const { api } = authContext;
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        // 채팅방 참여
        socket.emit('joinRoom', { chatRoomId: parseInt(id) });

        // 메시지 조회
        const fetchMessages = async (): Promise<void> => {
            try {
                const response = await api.get<ChatMessage[]>(`/chat/room/${id}/messages?limit=50`);
                setMessages(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || '메시지 조회 실패');
            }
        };
        fetchMessages();

        // 새 메시지 수신
        socket.on('newMessage', (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        // 에러 처리
        socket.on('error', (err: ErrorEvent) => {
            setError(err.message);
        });

        return () => {
            socket.off('newMessage');
            socket.off('error');
        };
    }, [id, api]);

    const handleSendMessage = (e: React.FormEvent): void => {
        e.preventDefault();
        if (newMessage.trim() && id) {
            socket.emit('sendMessage', {
                chatRoomId: parseInt(id),
                message: newMessage,
            });
            setNewMessage('');
        }
    };

    return (
        <div>
            <h2>채팅방 {id}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>User {msg.userId}:</strong> {msg.message}{' '}
                        <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                />
                <button type="submit">보내기</button>
            </form>
            <button onClick={() => navigate('/chat')}>뒤로</button>
        </div>
    );
};

export default ChatRoom;