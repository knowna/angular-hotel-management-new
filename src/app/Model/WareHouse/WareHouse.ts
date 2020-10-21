export interface IWareHouse {
    Id: number,
    Name: string,
    WarehouseTypeId: number,
    SortOrder: string
}

export interface IWareHouseType {
    Id: number,
    name: string
}