import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/hashProvider/models/IHashProvide';

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}
@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: ICreateUser): Promise<User> {
    const userExist = await this.usersRepository.FindAnEmail(email);

    if (userExist) {
      throw new AppError('Email address already used.', 403);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    const userCreated = await this.usersRepository.CreateUser(user);

    const userCreatedSave = await this.usersRepository.save(userCreated);

    return userCreatedSave;
  }
}

export default CreateUserService;
