import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminUserEntity } from '../entities/admin-user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUserEntity)
    private readonly adminRepo: Repository<AdminUserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const admin = await this.adminRepo.findOne({ where: { email: dto.email, isActive: 1 } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    admin.lastLoginAt = new Date();
    await this.adminRepo.save(admin);

    const token = this.jwtService.sign({
      sub: admin.adminId,
      email: admin.email,
      role: admin.role,
    });

    return { accessToken: token };
  }
}
