import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginDto, RegisterDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard.ts/auth.guard';
import { TokenDecorator, UserDecorator } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';



@Controller('auth')
export class AuthController {

  constructor(
    @Inject(NATS_SERVICE) 
    private readonly natsClient: ClientProxy
  ) {}

  @Post('register')
  register(
    @Body() registerDto: RegisterDto
  ) {
    
    return this.natsClient.send('auth.register.user', registerDto).pipe(
              catchError(err => {          
                throw new RpcException(err)
              })
            );
  }

  @Post('login')
  login(
     @Body() loginDto: LoginDto
  ) {    
    return this.natsClient.send('auth.login.user', loginDto).pipe(
              catchError(err => {          
                throw new RpcException(err)
              })
            );
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  refresh(
    @UserDecorator() user: CurrentUser,
    @TokenDecorator() token: string,
  ) {
    
    return { user, token };
  }
}
