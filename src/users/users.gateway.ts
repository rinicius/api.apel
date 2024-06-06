import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneUserDto } from './dto/find-user.dto';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from 'src/pipes/validation.pipe';

@UsePipes(new ValidationPipe())
@UseFilters(WsExceptionFilter)
@WebSocketGateway()
export class UsersGateway {
  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage('findAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @SubscribeMessage('findOneUser')
  findOne(@MessageBody() findOneUserDto: FindOneUserDto) {
    return this.usersService.findOne(findOneUserDto);
  }

  @SubscribeMessage('createUser')
  create(@MessageBody() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @SubscribeMessage('updateUser')
  update(@MessageBody() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }
}
