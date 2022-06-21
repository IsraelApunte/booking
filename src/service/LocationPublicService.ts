import {SearchFilter} from '../dto/SearchFilter';
import {LocationPublicRepository} from '../repository/LocationPublicRepository';

/**
 * Administration Location
 */
export class LocationPublicService {
  /**
   * Find Public by id
   * @param {number} id
   */
  async findPublicById(id: number): Promise<any> {
    try {
      const locationRepository = new LocationPublicRepository();
      return await locationRepository.getOnePublic(id);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Find all with pagination
   * @param {number} sportId
   * @param {SearchFilter} searchFilter
   */
  async findPublicBySportId(sportId: number,
      searchFilter: SearchFilter): Promise<any> {
    try {
      const locationRepository = new LocationPublicRepository();
      return await locationRepository.findAllBySportIdPaginates(sportId, searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
