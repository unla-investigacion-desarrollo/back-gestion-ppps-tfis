export declare enum Role {
    ADMIN = "admin",
    PROFESSOR = "professor",
    STUDENT = "student"
}
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    password: string;
    role: Role;
}
