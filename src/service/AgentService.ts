import {SearchFilter} from '../dto/SearchFilter';
import {AgentRepository} from '../repository/AgentRepository';
import {Agent} from '../util/Database';
import {Authorization} from '../util/Utils';
import {ICommonService} from './interface/ICommonService';

/**
 * Administration Agent
 */
export class AgentService implements ICommonService<Agent> {
  /**
   * Creation Agent
   * @param {authorizationParams} authorizationParams
   * @param {Agent} entity
   */
  async create(authorizationParams: Authorization, entity: Agent): Promise<Agent> {
    try {
      const agentRepository = new AgentRepository();
      return await agentRepository.create(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find all with pagination
   * @param {authorizationParams} authorizationParams
   * @param {SearchFilter} searchFilter
   */
  async find(authorizationParams: Authorization, searchFilter: SearchFilter): Promise<any> {
    try {
      const agentRepository = new AgentRepository();
      return await agentRepository.findAllByPaginates(searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Find by id
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async findById(authorizationParams: Authorization, id: number): Promise<any> {
    try {
      const agentRepository = new AgentRepository();
      return await agentRepository.getOne(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Update Agent
   * @param {authorizationParams} authorizationParams
   * @param {Agent} entity
   */
  async update(authorizationParams: Authorization, entity: Agent) {
    try {
      const agentRepository = new AgentRepository();
      return await agentRepository.update(entity);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
  /**
   * Delete
   * @param {authorizationParams} authorizationParams
   * @param {number} id
   */
  async remove(authorizationParams: Authorization, id: number) {
    throw new Error('Method not implemented.');
  }
}
