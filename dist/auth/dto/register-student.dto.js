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
exports.RegisterStudentDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterStudentDto {
    firstName;
    lastName;
    dni;
    email;
    password;
    yearOfAdmission;
    completedCoursesWithFinal;
    completedCoursesWithoutFinal;
}
exports.RegisterStudentDto = RegisterStudentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es un campo obligatorio' }),
    (0, class_validator_1.MinLength)(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El apellido es un campo obligatorio' }),
    (0, class_validator_1.MinLength)(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El DNI es un campo obligatorio' }),
    (0, class_validator_1.Length)(7, 8, { message: 'El DNI debe tener entre 7 y 8 digitos' }),
    (0, class_validator_1.Matches)(/^[0-9]+$/, { message: 'El DNI solo puede contener números' }),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "dni", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'El email es un campo obligatorio' }),
    (0, class_validator_1.IsEmail)({}, { message: 'El formato de email no es valido' }),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    __metadata("design:type", String)
], RegisterStudentDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterStudentDto.prototype, "yearOfAdmission", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterStudentDto.prototype, "completedCoursesWithFinal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterStudentDto.prototype, "completedCoursesWithoutFinal", void 0);
//# sourceMappingURL=register-student.dto.js.map