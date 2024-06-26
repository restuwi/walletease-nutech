export interface IUserRegistration {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
