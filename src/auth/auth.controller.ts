import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginDto, RegisterDto } from './dto';
import { catchError } from 'rxjs';



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

  @Get('refresh')
  refresh() {
    return this.natsClient.send('auth.refresh.user', {});
  }
}
