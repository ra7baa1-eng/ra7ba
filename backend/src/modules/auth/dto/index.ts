import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class RegisterMerchantDto {
  @ApiProperty({ example: 'merchant@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Ahmed Benali' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '0555123456' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'My Awesome Store' })
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiProperty({ example: 'متجري الرائع' })
  @IsString()
  @IsNotEmpty()
  storeNameAr: string;

  @ApiProperty({ example: 'mystore' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Subdomain must contain only lowercase letters, numbers, and hyphens',
  })
  subdomain: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
