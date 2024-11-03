import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPassword } from 'src/user/user-password.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginData: LoginDto): Promise<User | null> {
    const user = await this.userService.findByEmail(loginData.email);

    if (!user) return null;

    const storedPassword = await this.userService.getUserPassword(user);

    if (await bcrypt.compare(loginData.password, storedPassword)) {
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
