export class UserDto {
  user: {
    id: number;
    email: string;
    password: string;
    banned: boolean;
    banReason?: string;
  }
}
