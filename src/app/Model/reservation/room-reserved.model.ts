/**	
 * Defines the model for Room reserverd entity
 */
export class RoomReserverd {
	Id?: number;
    GRC?: number;
	Adult?: string;
    Children?: string;
    GuestName?: string;
	File?: string;
	IdentityFileName?: string;
	IdentityFileType?: string;	
	PhotoIdentity?: string;
	NumberofRoom?: string;
	ReservationId?: number;
	RoomTypeId?: string;
	RoomTypes?: string;
	ToCheckInDate?: any;
    ToCheckOutDate?: any;
    Address?: string;
    Country?: string;
    Id_Passport_No?: string;
    DateofIssue?: any;
    VisaNo?: string;
    PlaceIssued?: string;
    DateofBirth?: any;
    Occupation?: string;
    Organization?: string;
    PurposeofVisit?: string;
    NextVisit?: string;
    VehicleNo?: string;
    MobileNo?: string;
    Remarks?: string;
    Relation?: string;
    PAX?: string;
    Rate?: number;
    UserName?: string;
    Plan?: string;
    AdvanceAmount?: number;
    listRoomOccupiedDetail?: any[]
}
