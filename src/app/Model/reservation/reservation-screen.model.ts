/**	
 * Defines the model for Reservation Screen entity
 */
export interface ReservationScreen {
	Id: number;
	Adult: number;
	AdvancePaid: number;
	CheckInDate: Date;
	CheckOutDate: Date;
	Children: number;
	CustomerCountry: string;
	CustomerEmail: string;
	CustomerMobileNumber: number;
	CustomerName: string;
	NumberofRoom: number;
	PaymentTypeName: string;
	ReservationTypeName: string;
	RoomType: string;
	SpecialRequest: string;
	Status: string;
}