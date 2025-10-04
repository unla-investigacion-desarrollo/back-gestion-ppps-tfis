"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async registerStudent(registerDto) {
        const userExistsByDNI = await this.usersService.findOneByDNI(registerDto.dni);
        if (userExistsByDNI) {
            throw new common_1.ConflictException('Ya existe un usuario con ese DNI');
        }
        const userExistsByEmail = await this.usersService.findOneByEmail(registerDto.email);
        if (userExistsByEmail) {
            throw new common_1.ConflictException('Ya existe un usuario con ese email');
        }
        const createUserDto = {
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            dni: registerDto.dni,
            email: registerDto.email,
            password: registerDto.password,
        };
        const createStudentDto = {
            yearOfAdmission: registerDto.yearOfAdmission,
            completedCoursesWithFinal: registerDto.completedCoursesWithFinal,
            completedCoursesWithoutFinal: registerDto.completedCoursesWithoutFinal,
        };
        const student = await this.usersService.createUserAndStudent(createUserDto, createStudentDto);
        return {
            message: 'Estudiante creado exitosamente',
            studentId: student.id_user,
        };
    }
    async login(loginDto) {
        const userExists = await this.usersService.findOneByEmail(loginDto.email);
        if (!userExists) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, userExists.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        const payload = {
            email: userExists.email,
            role: userExists.role,
        };
        const token = await this.jwtService.signAsync(payload);
        return {
            token,
            email: loginDto.email,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map