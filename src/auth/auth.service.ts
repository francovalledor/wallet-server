import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginData: LoginDto): Promise<User | null> {
    const user = await this.userService.findByEmail(loginData.email);

    if (!user) return null;

    if (await bcrypt.compare(loginData.password, user.password)) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.userService.create({
      ...userData,
      password: hashedPassword,
    });
  }
}
