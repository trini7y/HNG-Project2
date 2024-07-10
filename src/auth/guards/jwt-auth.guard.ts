
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,  private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log("In the can activate", context)
    const request = context.switchToHttp().getRequest();
    const token = request['token'];
    // console.log("request", request);
    console.log('Token gotten', token);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
        console.log('Its public');
        return true;
        }
    
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('The payload in for token', payload);
      request['user'] = payload;
      console.log(request['user']);
    } catch {
      console.log('In the catch');
      throw new UnauthorizedException();
    }
    return true;
  }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
}
