import {SearchFilter} from '../dto/SearchFilter';
import {BannerPublicRepository} from '../repository/BannerPublicRepository';

/**
 * Administration Banner
 */
export class BannerPublicService {
  /**
   * Find all with pagination
   * @param {SearchFilter} searchFilter
   */
  async findPublic( searchFilter: SearchFilter): Promise<any> {
    try {
      const bannerRepository = new BannerPublicRepository();
      return await bannerRepository.findAllByPaginates(searchFilter);
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }
}
