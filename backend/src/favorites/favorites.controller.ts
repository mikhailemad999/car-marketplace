import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':id')
  async toggleFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.favoritesService.toggle(id, req.user.id);
  }

  @Get()
  async getMyFavorites(@Request() req: any) {
    return this.favoritesService.findAllForUser(req.user.id);
  }

  @Get('ids')
  async getMyFavoriteIds(@Request() req: any) {
    return this.favoritesService.getFavoriteIds(req.user.id);
  }

  @Delete(':id')
  async removeFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.favoritesService.remove(id, req.user.id);
  }
}
