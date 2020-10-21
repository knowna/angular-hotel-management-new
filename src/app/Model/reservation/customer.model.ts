import { CustomerType } from './customer-type.model';

/**	
 * Defines the model for Customer entity
 */
export interface Customer {
    Id: number;
    Title: string;
    FirstName: string;       
	MiddleName: string;
    LastName: string;
    Email: string;
    MemberId?: string;
    MemberSince: Date;
    MobileNumber: number;
    Country: string;
    CustomerName?: string;
    CustomerTypeId: number;
    CustomerTypes?: CustomerType[];
}
