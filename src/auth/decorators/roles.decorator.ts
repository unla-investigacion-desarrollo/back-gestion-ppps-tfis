// Referencia: https://docs.nestjs.com/security/authorization
import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../src/users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
