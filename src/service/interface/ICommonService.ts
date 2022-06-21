import {SearchFilter} from '../../dto/SearchFilter';
import {Authorization} from '../../util/Utils';

/**
 * s
 */
export interface ICommonService<T> {
    create(authorizationParams: Authorization, entity: T): Promise<T|undefined|null>;
    find(authorizationParams: Authorization, searchFilter: SearchFilter): Promise<T[]>;
    findById(authorizationParams: Authorization, id: number): Promise<T>;
    update(authorizationParams: Authorization, entity: T): any;
    remove(authorizationParams: Authorization, id: number): void;
}
