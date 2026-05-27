import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('admin')
@Controller('admin/auth')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @ApiOperation({ summary: '관리자 로그인' })
  async login(@Body() dto: LoginDto) {
    return this.adminService.login(dto);
  }
}
