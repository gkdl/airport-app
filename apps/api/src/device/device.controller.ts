import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdatePushTokenDto } from './dto/update-push-token.dto';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@ApiTags('devices')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiOperation({ summary: '디바이스 등록' })
  async register(@Body() dto: CreateDeviceDto) {
    return this.deviceService.registerDevice(dto);
  }

  @Patch(':deviceId/push-token')
  @ApiOperation({ summary: 'FCM 토큰 갱신' })
  async updatePushToken(@Param('deviceId') deviceId: string, @Body() dto: UpdatePushTokenDto) {
    return this.deviceService.updatePushToken(deviceId, dto);
  }

  @Get(':deviceId/favorites')
  @ApiOperation({ summary: '즐겨찾기 목록' })
  async getFavorites(@Param('deviceId') deviceId: string) {
    return this.deviceService.getFavorites(deviceId);
  }

  @Post(':deviceId/favorites')
  @ApiOperation({ summary: '즐겨찾기 추가' })
  async addFavorite(@Param('deviceId') deviceId: string, @Body() dto: CreateFavoriteDto) {
    return this.deviceService.addFavorite(deviceId, dto);
  }

  @Delete(':deviceId/favorites/:favoriteId')
  @ApiOperation({ summary: '즐겨찾기 삭제' })
  async removeFavorite(
    @Param('deviceId') deviceId: string,
    @Param('favoriteId', ParseIntPipe) favoriteId: number,
  ) {
    return this.deviceService.removeFavorite(deviceId, favoriteId);
  }
}
