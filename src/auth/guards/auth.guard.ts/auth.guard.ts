
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    @Inject('NATS_SERVICE') 
    private readonly natsClient: ClientProxy
  ) {}


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
   
    
    if (!token) {
      throw new UnauthorizedException('Token not valid');
    }

    try {
      //* enviando el token al microservicio de auth para que lo valide
       const { user, token:newToken } = await  firstValueFrom(
         this.natsClient.send('auth.refresh.user', token )
       );
    
      request['user'] = user;
      request['token'] = newToken;

    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
