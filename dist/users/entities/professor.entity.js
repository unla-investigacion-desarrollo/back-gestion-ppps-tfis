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
exports.Professor = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Professor = class Professor {
    id_user;
    user;
    specialization;
    isTutor;
};
exports.Professor = Professor;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Professor.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_user' }),
    __metadata("design:type", user_entity_1.User)
], Professor.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Professor.prototype, "specialization", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Professor.prototype, "isTutor", void 0);
exports.Professor = Professor = __decorate([
    (0, typeorm_1.Entity)()
], Professor);
//# sourceMappingURL=professor.entity.js.map