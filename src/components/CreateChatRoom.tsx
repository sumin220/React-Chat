import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatRoom } from '../types';

const CreateChatRoom: React.FC = () => {
    const [user2Id, setUser2Id] = useState<string>('');
    const [error, setError] = useState<string>('');
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }
    const { api } = authContext;
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            const response = await api.post<{ data: ChatRoom }>('/chat/rooms', { user2Id: parseInt(user2Id) });
            const chatRoomId = response.data.data.id;
            navigate(`/chat/room/${chatRoomId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || '채팅방 생성 실패');
        }
    };

    return (
        <div>
            <h2>채팅방 생성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>상대방 ID (user2Id):</label>
                    <input
                        type="number"
                        value={user2Id}
                        onChange={(e) => setUser2Id(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">채팅방 생성</button>
            </form>
            <button onClick={() => navigate('/chat')}>뒤로</button>
        </div>
    );
};

export default CreateChatRoom;