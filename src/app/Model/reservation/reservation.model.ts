
/**	
 * Defines the model for Reservation Entity
 */
export interface Reservation {
	Id: number,
    IsAdvancePaid: boolean,
    AmountPaid: string,
    BookingId: string,
    RDate: any,
    CustomerId: number,
    GuestName: string,
    PaymentType: number,
    RoomTypeId: number,
    ReservationType: number,
    ReservationDetails: any[],
    SpecialRequest: string,
    CheckInDate: any,
    CheckOutDate: any,
    Adult: string;
    Children: string;
    NumberOfRoom: number,
    Status: string    
}
