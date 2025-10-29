import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { NameValidationPipe } from '../common/pipe/nameValidation.pipe';
import { ShoppingListService } from './shopping-list.service';
import { ShoppingList } from './shoppintg-list.entity';

@Controller('shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Post('/item')
  @HttpCode(201)
  async addItem(
    @Body('userId') userId: string,
    @Body('item', NameValidationPipe) item: string,
  ) {
    await this.shoppingListService.addItem(userId, item);
  }

  @Delete(':roomName')
  @HttpCode(204)
  async delete(@Param('roomName', NameValidationPipe) roomName: string) {
    return this.shoppingListService.delete(roomName);
  }

  @Delete(':userId/item/:itemName')
  async deleteItem(
    @Param('userId') userId: string,
    @Param('itemName', NameValidationPipe) itemName: string,
  ) {
    await this.shoppingListService.deleteItem(userId, itemName);
  }

  @Get(':userId/items')
  async getItems(@Param('userId') userId: string) {
    return this.shoppingListService.getItems(userId);
  }

  @Post(':roomName')
  async create(
    @Param('roomName', NameValidationPipe) roomName: string,
  ): Promise<ShoppingList> {
    return this.shoppingListService.create(roomName);
  }
}
