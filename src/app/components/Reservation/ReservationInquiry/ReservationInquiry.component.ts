import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Reservation } from '../../../Model/reservation/reservation.model';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
 import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';

import { ReservationType } from '../../../Model/reservation/reservation-type.model';
import { Customer } from '../../../Model/reservation/customer.model';
import { RoomType } from '../../../Model/reservation/customer-screen.model';
import { PaymentType } from '../../../Model/reservation/payment-type.model';

@Component({
    templateUrl: './ReservationInquiry.component.html',
    styleUrls:[
        './ReservationInquiry.component.css'
    ]
})

export class ReservationInquiryComponent implements OnInit {
    // Variable References
    @ViewChild('template',{static:false}) template: any;

    roomTypes: RoomType[];
    msg: string;
    isLoading: boolean = false;
    InqueryForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    formSubmitAttempt: boolean;
    settings = {
		bigBanner: false,
		timePicker: false,
		format: 'dd/MM/yyyy',
		defaultOpen: false
	}

    constructor(
        private fb: FormBuilder,
        private _reservationService: AccountTransactionTypeService,
        private modalService: BsModalService,
        private date: DatePipe
    ) { }

    ngOnInit(): void {
        this.modalTitle = "Reservation Inquiry Form";
        this.modalBtnTitle = "Search Room Availability";
        this.InqueryForm = this.fb.group({
            Id: [''],
            Rooms: [1, Validators.required],            
            RoomTypeId: ['', Validators.required],
            CheckInDate: [new Date(), Validators.required],
            CheckOutDate: [new Date(), Validators.required]
        });
        this.loadRoomTypes();
    }
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
     * Loads list of all room types
     */
    loadRoomTypes() {
        this._reservationService.get(Global.BASE_ROOM_TYPES_ENDPOINT)
            .subscribe(
                roomTypes => { this.roomTypes = roomTypes; this.isLoading = false; },
                error => this.msg = <any>error
            );
    }

    /**
     * Checks the availability of the reservations
     * @param formData 
     */
    checkAvailability(formData: any) {
        this.msg = "";
        this.formSubmitAttempt = true;
        let inquery = this.InqueryForm;
        if (inquery.valid) {
            this._reservationService.get(
                Global.BASE_RESERVATION_INQUERY_ENDPOINT
                + '?FromDate=' + this.date.transform(formData.get('CheckInDate').value, 'yyyy-MM-dd')
                + '&toDate=' + this.date.transform(formData.get('CheckOutDate').value, 'yyyy-MM-dd')
                + '&RoomType=' + formData.get('RoomTypeId').value
                + '&Rooms=' + formData.get('Rooms').value
            ).subscribe(
                data => {
                    if (data) {
                        alert('Reservation you are looking for is available!');
                        this.formSubmitAttempt = false;

                    } else {
                        alert('Reservation you are looking for is not available!');
                        this.formSubmitAttempt = false;
                    }
                },
                error => console.log(error)
                );
        } else {
            this.validateAllFields(inquery);
        }
    }
}
