export interface SearchFilter {
    page: number,
    limit: number,
    filter: string|null,
    sort: string|null,
    isAsc: boolean|null,
    startDate: string|null,
    endDate: string|null
    businessId:number|null
}
