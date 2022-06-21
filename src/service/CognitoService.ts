import User from '../entity/User';
import {CognitoRepository} from '../repository/CognitoRepository';

/**
 * Administration Cognito
 */
export class CognitoService {
  /**
   * Creation Cognito
   * @param {User} entity
   * @param {User} requestCognito
   */
  async create(entity: User): Promise<User|any> {
    try {
      const cognitoRepository = new CognitoRepository();
      const existUser = await cognitoRepository.findUserExist(entity.username);
      if (existUser) {
        return {message: 'User exist'};
      } else {
        return await cognitoRepository.create(entity);
      }
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
