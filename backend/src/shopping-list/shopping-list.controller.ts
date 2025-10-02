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

  @Post(':roomName')
  async create(
    @Param('roomName', NameValidationPipe) roomName: string,
  ): Promise<ShoppingList> {
    return this.shoppingListService.create(roomName);
  }

  @Delete(':roomName')
  @HttpCode(204)
  async delete(@Param('roomName', NameValidationPipe) roomName: string) {
    return this.shoppingListService.delete(roomName);
  }

  @Post(':roomName/items')
  @HttpCode(201)
  async addItems(
    @Param('roomName', NameValidationPipe) roomName: string,
    @Body('items', NameValidationPipe) items: string,
  ) {
    return this.shoppingListService.addItems(roomName, items);
  }

  @Delete(':roomName/items/:itemName')
  async deleteItems(
    @Param('roomName', NameValidationPipe) roomName: string,
    @Param('itemName', NameValidationPipe) itemName: string,
  ) {
    return this.shoppingListService.deleteItems(roomName, itemName);
  }

  @Get(':roomName/items')
  async getItems(@Param('roomName', NameValidationPipe) roomName: string) {
    return this.shoppingListService.getItems(roomName);
  }
}
