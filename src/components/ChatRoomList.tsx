import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { disconnectSocket } from '../socket';
import { ChatRoom, ApiResponse } from '../types';

const ChatRoomList: React.FC = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [error, setError] = useState<string>('');
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }
    const { api, logout } = authContext;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatRooms = async (): Promise<void> => {
            try {
                const response = await api.get<ApiResponse<ChatRoom[]>>('/chat/rooms');
                setChatRooms(response.data.data);
            } catch (err: any) {
                setError(err.response?.data?.message || '채팅방 목록 조회 실패');
            }
        };
        fetchChatRooms();
    }, [api]);

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            disconnectSocket();
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>채팅방 목록</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {chatRooms.map((room) => (
                    <li key={room.id}>
                        <a href={`/chat/room/${room.id}`}>채팅방 {room.id}</a>
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/chat/create')}>채팅방 생성</button>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default ChatRoomList;