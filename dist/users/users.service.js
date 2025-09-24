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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("./entities/student.entity");
const professor_entity_1 = require("./entities/professor.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    usersRepository;
    studentsRepository;
    professorsRepository;
    dataSource;
    constructor(usersRepository, studentsRepository, professorsRepository, dataSource) {
        this.usersRepository = usersRepository;
        this.studentsRepository = studentsRepository;
        this.professorsRepository = professorsRepository;
        this.dataSource = dataSource;
    }
    async create(createUserDto) {
        const { password, ...rest } = createUserDto;
        const hashed = await bcrypt.hash(password, 12);
        const user = this.usersRepository.create({
            ...rest,
            password: hashed,
        });
        return await this.usersRepository.save(user);
    }
    async createStudent(createStudentDto, user) {
        const student = this.studentsRepository.create({
            user,
            yearOfAdmission: createStudentDto.yearOfAdmission,
            completedCoursesWithFinal: createStudentDto.completedCoursesWithFinal,
            completedCoursesWithoutFinal: createStudentDto.completedCoursesWithoutFinal,
        });
        return await this.studentsRepository.save(student);
    }
    async createUserAndStudent(createUserDto, createStudentDto) {
        return this.dataSource.transaction(async (manager) => {
            const userRepo = manager.getRepository(user_entity_1.User);
            const studentRepo = manager.getRepository(student_entity_1.Student);
            const { password, ...rest } = createUserDto;
            const hashed = await bcrypt.hash(password, 12);
            const user = userRepo.create({ ...rest, password: hashed });
            await userRepo.save(user);
            const student = studentRepo.create({ user, ...createStudentDto });
            await studentRepo.save(student);
            return student;
        });
    }
    async findOneByEmail(email) {
        return await this.usersRepository.findOneBy({ email });
    }
    async findOneByDNI(dni) {
        return await this.usersRepository.findOneBy({ dni });
    }
    findAll() {
        return `This action returns all users`;
    }
    findOne(id) {
        return `This action returns a #${id} user`;
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(professor_entity_1.Professor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], UsersService);
//# sourceMappingURL=users.service.js.map