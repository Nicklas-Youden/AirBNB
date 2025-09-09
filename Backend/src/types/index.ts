export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserRequest {
    name?: string;
    email?: string;
    password?: string;
}