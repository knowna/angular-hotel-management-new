export interface Customer {
    Id: number;
 
    CustomerTypeId?: number;
    CustomerName?: string;
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    Description?: string;
    Email?: string;
    Country?: string;
    MemberId?: string;
    MemberSince?: Date;
    MobileNumber?: number;
    Title?: string;
    CustomerTypes?: CustomerType[];
}

export class CustomerType {
    Id: number;
    name: string;
}