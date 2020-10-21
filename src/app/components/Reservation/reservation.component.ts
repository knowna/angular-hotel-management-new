import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Reservation } from '../../Model/reservation/reservation.model';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { forkJoin } from "rxjs/observable/forkJoin";

import { Global } from '../../Shared/global';
import { ReservationType } from '../../Model/reservation/reservation-type.model';
import { Customer } from '../../Model/reservation/customer.model';
import { RoomType } from '../../Model/reservation/customer-screen.model';
import { PaymentType } from '../../Model/reservation/payment-type.model';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';

@Component({
    templateUrl: './reservation.component.html',
    styleUrls:[
        './reservation.component.css'
    ]
})

export class ReservationComponent implements OnInit {
    today = new Date();
    today1 = new Date();
    reservations: Reservation[];
    reservationsTypes: ReservationType[];
    customers: Customer[];
    roomTypes: RoomType[];
    paymentTypes: PaymentType[];
    reservation: Reservation;
    msg: string;
    isLoading: boolean = false;
    reservationForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    roomAvailabalityMessage: string = '';
    public fromDate: any;
    public toDate: any;
    public company: any = {};

    /**
     * Constructor
     * @param fb 
     * @param _reservationService 
     * @param modalService 
     * @param date 
     */
    constructor(
        private fb: FormBuilder,
        private _reservationService: AccountTransactionTypeService,
        private modalService: BsModalService,
        private date: DatePipe
    ) {
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    /**
     * Overrides ngOnInit 
     */
    ngOnInit(): void {
        this.today = new Date();
        this.today.setDate(new Date().getDate() - 1);
        this.reservationForm = this.fb.group({
            Id: [''],
            BookingId: ['', Validators.required],
            GuestName: ['', Validators.required],
            Adult: ['', Validators.required],
            Children: ['', Validators.required],
            IsAdvancePaid: ['', Validators.required],
            AmountPaid: ['', Validators.required],
            RDate: [new Date(), Validators.required],
            CustomerId: ['', Validators.required],
            PaymentType: ['', Validators.required],
            RoomTypeId: ['', Validators.required],
            ReservationType: ['', Validators.required],
            ReservationDetails: this.fb.array([], Validators.required),
            SpecialRequest: ['', Validators.required],
            CheckInDate: [new Date(), Validators.required],
            CheckOutDate: [new Date(), Validators.required],
            NumberOfRoom: ['', Validators.required],
            Status: ['', Validators.required]
        });
        
        this.loadData();
    }

    /**
     * Loads data for reserved rooms list
     */
    loadData () {
        this.isLoading = true;
        let customers = this._reservationService.get(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT);
        let paymentTypes = this._reservationService.get(Global.BASE_PAYMENT_TYPES_ENDPOINT);
        let roomTypes = this._reservationService.get(Global.BASE_ROOM_TYPES_ENDPOINT);
        let reservationsTypes = this._reservationService.get(Global.BASE_RESERVATION_TYPES_ENDPOINT);
        let reservations = this._reservationService.get(Global.BASE_RESERVATION_ENDPOINT + '?fetchType=today&moduleName=test');

        forkJoin([customers, paymentTypes, roomTypes, reservationsTypes, reservations])
            .subscribe (
                results => {
                    this.customers = results[0];
                    this.paymentTypes = results[1];
                    this.roomTypes = results[2];
                    this.reservationsTypes = results[3];
                    this.reservations = results[4];
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
    }

    /**
     * Init Reservation Details
     */
    initReservationDetails() {
        //initialize our vouchers
        return this.fb.group({
            Id: [''],
            ChildrenAge: [''],
            ReservationId: ['']
        });
    }

    /**
     * Gets individual journal voucher
     * @param Id 
     */
    getReservation(Id: number) {
        this.isLoading = true;
        return this._reservationService.get(Global.BASE_RESERVATION_ENDPOINT + '?ReservationId=' + Id);
    }

    /**
     * Add Childern Age
     * @param childrenCount 
     */
    addChildrenAge(childrenCount) {
        var childrenCount = childrenCount.split(":")[0];
        this.reservationForm.controls['ReservationDetails'] = this.fb.array([]);
        const control = <FormArray>this.reservationForm.controls['ReservationDetails'];
        for (let i = 0; i < childrenCount; i++) {
            const reservationDetail = this.initReservationDetails();
            control.push(reservationDetail);
        }
    }

    /**
     * Load Reservation Types
     */
    loadReservationTypes() {
        this._reservationService.get(Global.BASE_RESERVATION_TYPES_ENDPOINT)
            .subscribe(
                reservationsTypes => {
                    this.reservationsTypes = reservationsTypes;
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
    }

    /**
     * Load Reservations
     */
    loadReservations() {
        this._reservationService.get(Global.BASE_RESERVATION_ENDPOINT)
            .subscribe(
                reservations => {
                    this.reservations = reservations;
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
    }

    /**
     * Load Customers
     */
    loadCustomers() {
        this._reservationService.get(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT)
            .subscribe(
                customers => { this.customers = customers; this.isLoading = false; },
                error => this.msg = <any>error
            );
    }

    /**
     * Load Payment Types
     */
    loadPaymentTypes() {
        this._reservationService.get(Global.BASE_PAYMENT_TYPES_ENDPOINT)
            .subscribe(
                paymentTypes => { this.paymentTypes = paymentTypes; this.isLoading = false; },
                error => this.msg = <any>error
            );
    }

    /**
     * Load Room Types
     */
    loadRoomTypes() {
        this._reservationService.get(Global.BASE_ROOM_TYPES_ENDPOINT)
            .subscribe(
                roomTypes => { this.roomTypes = roomTypes; this.isLoading = false; },
                error => this.msg = <any>error
            );
    }

    /**
     * Open model
     * @param template 
     */
    openModal(template: TemplateRef<any>) {
        this.roomAvailabalityMessage = '';
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Reservation";
        this.modalBtnTitle = "Save";
        this.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-xl' });
    }

    /**
     * Edit Reservation
     */
    editReservation(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Reservation";
        this.modalBtnTitle = "Update";
        this.reset();
        this.getReservation(id)
            .subscribe((reservation: Reservation) => {
                this.isLoading = false;
                this.reservation = reservation;
                this.reservationForm.controls.Id.setValue(this.reservation.Id);
                this.reservationForm.controls.BookingId.setValue(this.reservation.BookingId);
                this.reservationForm.controls.GuestName.setValue(this.reservation.GuestName);
                this.reservationForm.controls.IsAdvancePaid.setValue(this.reservation.IsAdvancePaid);
                this.reservationForm.controls.Adult.setValue(this.reservation.Adult);
                this.reservationForm.controls.Children.setValue(this.reservation.Children);
                this.reservationForm.controls.NumberOfRoom.setValue(this.reservation.NumberOfRoom);
                this.reservationForm.controls.Status.setValue(this.reservation.Status);
                this.reservationForm.controls.AmountPaid.setValue(this.reservation.AmountPaid);
                this.reservationForm.controls.RDate.setValue(new Date(this.reservation.RDate));
                this.reservationForm.controls.CheckInDate.setValue(new Date(this.reservation.CheckInDate));
                this.reservationForm.controls.CheckOutDate.setValue(new Date(this.reservation.CheckOutDate));
                this.reservationForm.controls.CustomerId.setValue(this.reservation.CustomerId);
                this.reservationForm.controls.PaymentType.setValue(this.reservation.PaymentType);
                this.reservationForm.controls.RoomTypeId.setValue(this.reservation.RoomTypeId);
                this.reservationForm.controls.ReservationType.setValue(this.reservation.ReservationType);
                this.reservationForm.controls.SpecialRequest.setValue(this.reservation.SpecialRequest);

                this.reservationForm.controls['ReservationDetails'] = this.fb.array([]);
                const control = <FormArray>this.reservationForm.controls['ReservationDetails'];
                control.reset();

                for (let i = 0; i < this.reservation.ReservationDetails.length; i++) {
                    let valuesFromServer = this.reservation.ReservationDetails[i];
                    let instance = this.fb.group(valuesFromServer);
                    control.push(instance);
                }
                this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-xl' });
            });
    }

    /**
     * Delete Reservation
     * @param id 
     * @param template 
     */
    deleteReservation(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.reset();
        this.getReservation(id)
            .subscribe((reservation: Reservation) => {
                this.isLoading = false;
                this.reservation = reservation;
                this.reservationForm.controls.Id.setValue(this.reservation.Id);
                this.reservationForm.controls.BookingId.setValue(this.reservation.BookingId);
                this.reservationForm.controls.GuestName.setValue(this.reservation.GuestName);
                this.reservationForm.controls.IsAdvancePaid.setValue(this.reservation.IsAdvancePaid);
                this.reservationForm.controls.Adult.setValue(this.reservation.Adult);
                this.reservationForm.controls.Children.setValue(this.reservation.Children);
                this.reservationForm.controls.NumberOfRoom.setValue(this.reservation.NumberOfRoom);
                this.reservationForm.controls.Status.setValue(this.reservation.Status);
                this.reservationForm.controls.AmountPaid.setValue(this.reservation.AmountPaid);
                this.reservationForm.controls.RDate.setValue(new Date(this.reservation.RDate));
                this.reservationForm.controls.CheckInDate.setValue(new Date(this.reservation.CheckInDate));
                this.reservationForm.controls.CheckOutDate.setValue(new Date(this.reservation.CheckOutDate));
                this.reservationForm.controls.CustomerId.setValue(this.reservation.CustomerId);
                this.reservationForm.controls.PaymentType.setValue(this.reservation.PaymentType);
                this.reservationForm.controls.RoomTypeId.setValue(this.reservation.RoomTypeId);
                this.reservationForm.controls.ReservationType.setValue(this.reservation.ReservationType);
                this.reservationForm.controls.SpecialRequest.setValue(this.reservation.SpecialRequest);
                this.reservationForm.controls['ReservationDetails'] = this.fb.array([]);
                const control = <FormArray>this.reservationForm.controls['ReservationDetails'];
                for (let i = 0; i < this.reservation.ReservationDetails.length; i++) {
                    let valuesFromServer = this.reservation.ReservationDetails[i];
                    let instance = this.fb.group(valuesFromServer);
                    control.push(instance);
                }
                this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-xl' });
            });
    }

    /**
     * Validate All fields
     * @param formGroup 
     */
    validateAllFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFields(control);
            }
        });
    }

    /**
     * Check Availability Message
     */
    checkAv(): boolean {
        return this.roomAvailabalityMessage !== '';
    }

    /**
     * Check Availability of reservation
     * @param formData 
     */
    checkAvailability(formData: any) {
        let reserve = this.reservationForm;

        if (reserve.valid) {
            this._reservationService.get(Global.BASE_RESERVATION_INQUERY_ENDPOINT + '?FromDate=' + this.date.transform(formData.get('CheckInDate').value, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(formData.get('CheckOutDate').value, 'yyyy-MM-dd') + '&RoomType=' + formData.get('RoomTypeId').value)
                .subscribe(
                    data => {
                        if (data) {
                            this.roomAvailabalityMessage = "The room on the day you specified is available!"
                        } else {
                            this.roomAvailabalityMessage = "The room on the day you specified is not available!"
                        }
                    },
                    error => {
                        this.msg = error;
                    }
                );
        }
    }

    /**
     * On Submitting the form
     */
    onSubmit(formData: any) {
         ;
        this.msg = "";
        this.formSubmitAttempt = true;
        let reserve = this.reservationForm;

        let newDate = new Date();
        let checkInDate = new Date(reserve.get('CheckInDate').value);
        let checkOutDate = new Date(reserve.get('CheckOutDate').value);
        let rDate = new Date(reserve.get('RDate').value);
        checkInDate.setTime(checkInDate.getTime() - (newDate.getTimezoneOffset() * 60000));
        checkOutDate.setTime(checkOutDate.getTime() - (newDate.getTimezoneOffset() * 60000));
        rDate.setTime(rDate.getTime() - (newDate.getTimezoneOffset() * 60000));

        reserve.get('CheckInDate').setValue(checkInDate);
        reserve.get('CheckOutDate').setValue(checkOutDate);
        reserve.get('RDate').setValue(rDate);

        if (reserve.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                     ;
                    this._reservationService.post(Global.BASE_RESERVATION_ENDPOINT, reserve.value).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully added.");
                                this.loadReservations();
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                             ;
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.update:
                    this._reservationService.put(Global.BASE_RESERVATION_ENDPOINT,  formData.value.Id, reserve.value).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.loadReservations();
                                this.formSubmitAttempt = false;
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.delete:
                    this._reservationService.delete(Global.BASE_RESERVATION_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Reservation successfully deleted.");
                                this.modalRef.hide();
                                this.loadReservations();
                                this.formSubmitAttempt = false;
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
            }
        }
        else {
            this.validateAllFields(reserve);
        }
    }

    /**
     * Get Reservation Type
     * @param Id 
     */
    getReservationType(Id: number) {
        if (this.reservationsTypes) {
            return this.reservationsTypes.filter((rType) => {
                return rType.Id === Id;
            })[0];
        }
    }

    /**
     * Get Payment Type
     * @param Id 
     */
    getPaymentType(Id: number) {
        if (this.paymentTypes) {
            return this.paymentTypes.filter((pType) => {
                return pType.Id === Id;
            })[0];
        }
    }

    /**
     * Get Room Type
     * @param Id 
     */
    getRoomType(Id: number) {
        if (this.roomTypes) {
            return this.roomTypes.filter((rType) => {
                return rType.Id === Id;
            })[0];
        }
    }

    /**
     * Get customer Details
     * @param Id 
     */
    getCustomer(Id: number) {
        if (this.customers) {
            return this.customers.filter((customer) => {
                return customer.Id === Id;
            })[0];
        }
    }

    // Remove Individual Age
    deleteAge(i: number) {
        let controls = <FormArray>this.reservationForm.controls['ReservationDetails'];
        let controlToRemove = this.reservationForm.controls.ReservationDetails['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        if (selectedControl) {
            this._reservationService.delete(Global.BASE_RESERVATION_DETAILS_ENDPOINT, selectedControl)
                .subscribe(data => {
                    (data == 1) && controls.removeAt(i);
                });
        } else {
            if (i >= 0) {
                controls.removeAt(i);
            } else {
                alert("Form requires at least one row");
            }
        }
    }

    // Fetch reservations based on given fetch type
    getData(fetchType: string) {
        this.isLoading = true;
        this._reservationService.get(Global.BASE_RESERVATION_ENDPOINT + '?fetchType=' + fetchType + '&moduleName=test')
            .subscribe(
                reservations => {
                    this.reservations = reservations;
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
    }
    // Fetch reservations based on given fetch type
    getDataDateFilter(fetchType: string) {
         
        this.isLoading = true;
        this._reservationService.get(Global.BASE_RESERVATION_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&fetchType=' + fetchType)
            .subscribe(
                reservations => {
                    this.reservations = reservations;
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
    }
    /**
     * Set control state
     * @param isEnable 
     */
    SetControlsState(isEnable: boolean) {
        isEnable ? this.reservationForm.enable() : this.reservationForm.disable();
    }
    /**
     * Export formatter table in excel
     * @param tableID 
     * @param filename 
     */
    exportTableToExcel(tableID, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var clonedtable = $('#' + tableID);
        var clonedHtml = clonedtable.clone();
        $(clonedtable).find('.export-no-display').remove();
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        $('#' + tableID).html(clonedHtml.html());

        // Specify file name
        filename = filename ? filename + '.xls' : 'Reservation of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }
    /**
     * Resets the journal form
     */
    reset() {
        this.reservationForm.controls['Id'].reset();
        this.reservationForm.controls['BookingId'].reset();
        this.reservationForm.controls['GuestName'].reset();
        this.reservationForm.controls['RoomTypeId'].reset();
        this.reservationForm.controls['CheckInDate'].reset();
        this.reservationForm.controls['CheckOutDate'].reset();
        this.reservationForm.controls['Adult'].reset();
        this.reservationForm.controls['Children'].reset();
        this.reservationForm.controls['NumberOfRoom'].reset();
        this.reservationForm.controls['ReservationDetails'] = this.fb.array([]);
        this.reservationForm.controls['IsAdvancePaid'].reset();
        this.reservationForm.controls['AmountPaid'].reset();
        this.reservationForm.controls['RDate'].reset();
        this.reservationForm.controls['CustomerId'].reset();
        this.reservationForm.controls['PaymentType'].reset();
        this.reservationForm.controls['ReservationType'].reset();
        this.reservationForm.controls['SpecialRequest'].reset();
        this.reservationForm.controls['Status'].reset();
        this.reservationForm.controls['Status'].reset();
    }
}
