import { AuthService } from './auth.service';
import { AuthCredsDto } from './dto/auth-creds.dto';
import { Controller } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { AccessToken } from './accesstoken.interface';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('/signup')
	signUp(@Body() authcredsDto: AuthCredsDto): Promise<AccessToken> {
		return this.authService.signUp(authcredsDto);
	}

	@Post('/signin')
	signIn(@Body() authcredsDto: AuthCredsDto): Promise<AccessToken> {
		return this.authService.signIn(authcredsDto);
	}
}
