import { AuthCredsDto } from './dto/auth-creds.dto';
import { Injectable } from '@nestjs/common';
import {
	ConflictException,
	InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { User } from './user.entity';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async SignUp(authcredsDto: AuthCredsDto): Promise<string> {
		const { username, password } = authcredsDto;

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		try {
			await this.save(
				this.create({
					username: username,
					password: hashedPassword,
				}),
			);
		} catch (error) {
			if (error.code === '23505') {
				throw new ConflictException('Username already exists');
			} else {
				throw new InternalServerErrorException();
			}
		}

		return username;
	}
}
