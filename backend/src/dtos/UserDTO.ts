export class UserDto {
  id: number;
  email: string;
  password: string;
  banned: boolean;
  banReason?: string;
}
