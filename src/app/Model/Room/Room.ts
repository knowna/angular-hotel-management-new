export interface IRoom {
    Id: number,
    RoomNumber: number,
    RoomPrice: number,
    RoomTypeId: number

}

export interface IRoomType {
    Id: number,
    Name: string
}

export interface IRoomBooking {
    Id: number,
    RoomNumberId: number,
    BookingFromDate: Date,
    BookingToDate: Date,
    BookingStatus: string,
    PaymentType: string,
    AdvancePaid: string,
    TotalAmountPaid: string
}