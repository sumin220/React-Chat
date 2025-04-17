export interface User {
    id: number;
    email: string;
    username: string;
}

export interface JwtToken {
    accessToken: string;
    refreshToken: string;
}

export interface ChatRoom {
    id: number;
    user1Id: number;
    user2Id: number;
}

export interface ChatMessage {
    id?: number;
    chatRoomId: number;
    userId: number;
    message: string;
    timestamp: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}