import {SearchFilter} from '../../dto/SearchFilter';

/**
 * s
 */
export interface IPostgresCommonService<T> {
    create(entity: T): Promise<T|undefined|null>;
    find(searchFilter: SearchFilter): Promise<T[]>;
    findById(id: number): Promise<T>;
    update(entity: T): any;
    remove(id: number): void;
}
