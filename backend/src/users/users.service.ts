import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'avatar', 'createdAt'],
    });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'avatar', 'createdAt'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateRole(id: number, role: UserRole) {
    const user = await this.findById(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  async updateProfile(id: number, data: Partial<User>) {
    const user = await this.findById(id);
    Object.assign(user, data);
    return this.userRepository.save(user);
  }
}
