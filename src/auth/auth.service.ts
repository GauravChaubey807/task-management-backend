import { AuthCredsDto } from './dto/auth-creds.dto';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { JwtPayload } from './jwt-payload.interface';
import { AccessToken } from './accesstoken.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UsersRepository)
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
	) {}

	async signUp(authcredsDto: AuthCredsDto): Promise<AccessToken> {
		const username = await this.usersRepository.SignUp(authcredsDto);
		const payload: JwtPayload = { username };
		const accesstoken = this.jwtService.sign(payload);
		return { message: 'User created successfully', accesstoken };
	}

	async signIn(authcredsDto: AuthCredsDto): Promise<AccessToken> {
		const { username, password } = authcredsDto;
		const user = await this.usersRepository.findOne({
			where: {
				username: username,
			},
		});

		if (user && (await bcrypt.compare(password, user.password))) {
			const payload: JwtPayload = { username };
			const accesstoken = this.jwtService.sign(payload);
			return { accesstoken };
		} else {
			throw new UnauthorizedException('Check your login credentials');
		}
	}
}
