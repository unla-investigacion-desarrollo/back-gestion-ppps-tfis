import { Role } from 'src/users/entities/user.entity';

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
}
