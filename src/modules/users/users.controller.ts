import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Patch,
    Put,
    Delete,
    Inject,
    HttpStatus,
    Res,
    Req,
    NotFoundException,
    ConflictException,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {Request} from 'express'
import { UsersService } from './users.service'
import { ChangePassword } from './dto/change-pass-dto'
import { UserDto } from './dto/dto'
import {RolesGuard} from '../../local/guard/role.guard'
import {PagingPipe} from '../../local/pipe/paging.pipe'
import { ApiBearerAuth,ApiUnauthorizedResponse } from '@nestjs/swagger'
import {User} from '../../local/decorator/user.decorator'

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) { }

    //Lay ra id cua nguoi dung
    // @Get('/me')
    // async findMe(@Req() req) {
    //     return this.userService.GetById(req.user._id)
    // }

    //Sử dụng class User thay cho việc dụng req
    @Get('/me')
    //Day la noi phai co token de access
    @ApiBearerAuth()
    @ApiUnauthorizedResponse()
    async findMe(@User() user){
      return this.userService.GetById(user._id)
    }

    @Get('/')
    @ApiBearerAuth()
    //sử dụng class pagepipe
    async GetAllUser(@Query(new PagingPipe()) query: { page?: number, limit?: number, search_string?: string }) {
        return this.userService.GetAll(query)
    }

    //lay id tung du lieu
    @Get('/:id')
    @ApiBearerAuth()
    async GetUserById(@Param('id') id: string) {
        return this.userService.GetById(id)
    }

    //Cap nhat
    @Put('/:id')
    @ApiBearerAuth()
    @UseGuards(new RolesGuard('User','admin'))
    async updateUser(@Param('id') id: string, @Body() userData: UserDto) {
        return this.userService.update(id, userData)
    }

    @Put('/me/change-password')
    @ApiBearerAuth()
    @UsePipes(new ValidationPipe())
    async changePassword(@Param('id') id: string, @Body() body: ChangePassword,@Req() req){
        return this.userService.changePassword(req.user._id,body.password,body.newPassword)
    }

    //Xoa
    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(new RolesGuard('User','admin'))
    async deleteUser(@Param('id') id: string) {
        return this.userService.delete(id)
    }

}
