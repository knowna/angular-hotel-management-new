import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { forkJoin } from "rxjs/observable/forkJoin";
import { RoomReserverd } from 'src/app/Model/reservation/room-reserved.model';
import { Reservation } from 'src/app/Model/reservation/reservation.model';
import { Customer } from 'src/app/Model/customer.model';
import { RoomType } from 'src/app/Model/reservation/customer-screen.model';
import { Room } from 'src/app/Model/reservation/room.model';
import { ReservationTypeService } from 'src/app/Service/reservation/reservation-type.services';
import { RoomOccupiedService } from 'src/app/Service/reservation/room-occupied.services';
import { FileService } from 'src/app/Service/file.service';

@Component({
    templateUrl: './checkin.component.html'
})
export class CheckInComponent implements OnInit {
    @ViewChild('template') TemplateRef: TemplateRef<any>;
    @ViewChild('fileInput') fileInput: ElementRef;
    reservedRooms: RoomReserverd[];
    reservations: Reservation[];
    customers: Customer[];
    roomTypes: RoomType[];
    rooms: Room[];
    reservedRoom: RoomReserverd;
    msg: string;
    isLoading: boolean = false;
    reservedRoomForm: FormGroup;
    checkInCheckOutForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    checkOutModalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    fileUrl: string = '';
    file: any[] = [];
    public currentUser: any = {};
    dropMessage: string = "Upload Reference File";
    public company: any = {};
    File: string;
    public fromDate: any;
    public toDate: any;
    settings = {
		bigBanner: true,
		timePicker: true,
		format: 'dd/MM/yyyy hh:mm:ss a',
		defaultOpen: false
	};
    
    constructor(
        private fb: FormBuilder,
        private _reservationService: ReservationTypeService,
        private _roomOccupiedService: RoomOccupiedService,
        private modalService: BsModalService,
        private fileService: FileService,
        private date: DatePipe,
    ) {
        this.company = JSON.parse(localStorage.getItem('company'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit(): void {
        let nd = new Date();   
        let selectedDate = new Date();  
        this.reservedRoomForm = this.fb.group({
            Id: [''],
            GuestName: ['', Validators.required],
            GRC: ['', Validators.required],
            Adult: ['', Validators.required],
            Children: ['', Validators.required],
            IdentityFileName: null,
            IdentityFileType: null,
            PhotoIdentity: null,
            NumberofRoom: ['', Validators.required],
            ReservationId: [''],
            RoomTypeId: ['', Validators.required],
            ToCheckInDate: [new Date(), Validators.required],
            ToCheckOutDate: [new Date(), Validators.required],
            Rate: ['', Validators.required],
            AdvanceAmount: ['', Validators.required],
            Address: [''],
            Country: [''],
            Id_Passport_No: [''],
            DateofIssue: [new Date()],
            VisaNo: [''],
            PlaceIssued: [''],
            DateofBirth: [new Date()],
            Occupation: [''],
            Organization: [''],
            PurposeofVisit: [''],
            NextVisit: [''],
            VehicleNo: [''],
            MobileNo: [''],
            Remarks: [''],
            Relation: [''],
            PAX: [''],
            UserName: [''],
            Plan: [''],
            listRoomOccupiedDetail: this.fb.array([this.initRoomlistRoomOccupiedDetail()])
        });
        this.loadData("today");
        this.reservedRoom = { File: '' };
    }
    initRoomlistRoomOccupiedDetail() {
        return this.fb.group({
            Id: [''],
            ReservationId: [''],
            RoomOccupiedId: [''],
            RoomId: ['', Validators.required],
            PAX: ['', Validators.required],
            GuestName: ['']
        });
    }
    // Remove Individual Room
    removeRoom(i: number) {
        debugger
        let controls = <FormArray>this.reservedRoomForm.controls['listRoomOccupiedDetail'];
        let controlToRemove = this.reservedRoomForm.controls.listRoomOccupiedDetail['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;
        let currentRoomid = controlToRemove.Id.value;
        if (currentRoomid == "" || currentRoomid == null) {
            currentRoomid = 0;
        }
        if (currentRoomid != "0" && i != 0) {
            this._reservationService.delete(Global.BASE_ROOM_OCCUPIED_DETAILS_ENDPOINT, currentRoomid).subscribe(data => {
                (data == 1) && controls.removeAt(i);
            });
        } else {
            if (i != 0) {
                controls.removeAt(i);
            } else {
                alert("Form requires at least one row");
            }
        }
    }
    //Add Room
    addRoom() {
        debugger
        const control = <FormArray>this.reservedRoomForm.controls['listRoomOccupiedDetail'];
        const addRoom = this.initRoomlistRoomOccupiedDetail();
        control.push(addRoom);
    }
    getDataDateFilter() {
        this.isLoading = true;
        this._reservationService.get(Global.BASE_RESERVATION_ROOM_ENDPOINT)
            .subscribe(roomlists => { this.rooms = roomlists; this.isLoading = false; },
                error => this.msg = <any>error);
        let customers = this._reservationService.get(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT);
        let roomTypes = this._reservationService.get(Global.BASE_ROOM_TYPES_ENDPOINT);
        let reservations = this._reservationService.get(Global.BASE_RESERVATION_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&fetchType=current')
        let reservedRooms = this._reservationService.get(Global.BASE_CHECKIN_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&fetchType=current')

        forkJoin([customers, roomTypes, reservations, reservedRooms])
            .subscribe(results => {
                this.customers = results[0];
                this.roomTypes = results[1];
                this.reservations = results[2];
                results[3].map((room) => room['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + room.Id + '&ApplicationModule=CheckInCheckOut');
                this.reservedRooms = results[3];
                this.isLoading = false;
            },
                error => this.msg = <any>error
            );
    }
    /**
     * Loads data for reserved rooms list
     */
    loadData(fetchType: string) {
        debugger
        this.isLoading = true;
        this._reservationService.get(Global.BASE_RESERVATION_ROOM_ENDPOINT)
            .subscribe(roomlists => { this.rooms = roomlists; this.isLoading = false; },
                error => this.msg = <any>error);
        let customers =this._reservationService.get(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT);
        let roomTypes = this._reservationService.get(Global.BASE_ROOM_TYPES_ENDPOINT);
        let reservations = this._reservationService.get(Global.BASE_RESERVATION_ENDPOINT + '?fetchType='+fetchType+'&moduleName=test');
        let reservedRooms = this._reservationService.get(Global.BASE_CHECKIN_ENDPOINT + '?fetchType=' + fetchType + '&moduleName=test');

        forkJoin([customers, roomTypes, reservations, reservedRooms])
            .subscribe(results => {
                this.customers = results[0];
                this.roomTypes = results[1];
                this.reservations = results[2];
                results[3].map((room) => room['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + room.Id + '&ApplicationModule=CheckInCheckOut');
                this.reservedRooms = results[3];
                this.isLoading = false;
            },
            error => this.msg = <any>error
        );
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
        }
    }

    clearFile() {
        this.fileInput.nativeElement.value = '';
    }

    deleteFile(id) {
        this._reservationService.delete(Global.BASE_FILE_UPLOAD_ENDPOINT, id)
            .subscribe(
                result => {
                   if (result) {
                       this.reservedRoom.File = '';
                   }
                },
                error => this.msg = <any>error
            );
    }

    loadRoomReserveds() {
        this._reservationService.get(Global.BASE_CHECKIN_ENDPOINT+ '?fetchType=new')
            .subscribe(
                reservedRooms => {
                    reservedRooms.map((room) => room['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + room.Id + '&ApplicationModule=CheckInCheckOut');
                    this.reservedRooms = reservedRooms;
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
    }
    /**
     * Gets individual CHECK IN CHECK OUT
     * @param Id 
     */
    getCHECKINCHECKOUT(Id: number) {
        debugger
        this.isLoading = false;
        return this._reservationService.get(Global.BASE_CHECKIN_ENDPOINT + '?ReservationId=' + Id + '&fetchType=new');
    }
    openModal(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Check In";
        this.modalBtnTitle = "Save";
        this.reservedRoomForm.reset();
        this.reservedRoom.File = '';
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    viewFile(fileUrl, template: TemplateRef<any>) {
        this.fileUrl = fileUrl;
        this.modalTitle = "View Attachment";
        this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-lg' });
    }

    editReservedRoom(id: number, template: TemplateRef<any>) {
        debugger
        this.isLoading = false;
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Checkin";
        this.modalBtnTitle = "Update";
        this.getCHECKINCHECKOUT(id)
            .subscribe((reservedroom: RoomReserverd) => {
                this.reservedRoomForm.controls.Id.setValue(reservedroom.Id);
                this.reservedRoomForm.controls.ReservationId.setValue(reservedroom.ReservationId);
                this.reservedRoomForm.controls.Adult.setValue(reservedroom.Adult);
                this.reservedRoomForm.controls.AdvanceAmount.setValue(reservedroom.AdvanceAmount);
                this.reservedRoomForm.controls.Children.setValue(reservedroom.Children);
                this.reservedRoomForm.controls.GuestName.setValue(reservedroom.GuestName);
                this.reservedRoomForm.controls.GRC.setValue(reservedroom.GRC);
                this.reservedRoomForm.controls.NumberofRoom.setValue(reservedroom.NumberofRoom);
                this.reservedRoomForm.controls.RoomTypeId.setValue(reservedroom.RoomTypeId);
                this.reservedRoomForm.controls.ToCheckInDate.setValue(new Date(reservedroom.ToCheckInDate));
                this.reservedRoomForm.controls.ToCheckOutDate.setValue(new Date(reservedroom.ToCheckOutDate));
                this.reservedRoomForm.controls.Address.setValue(reservedroom.Address);
                this.reservedRoomForm.controls.Country.setValue(reservedroom.Country);
                this.reservedRoomForm.controls.Id_Passport_No.setValue(reservedroom.Id_Passport_No);
                this.reservedRoomForm.controls.DateofIssue.setValue(new Date(reservedroom.DateofIssue));
                this.reservedRoomForm.controls.VisaNo.setValue(reservedroom.VisaNo);
                this.reservedRoomForm.controls.PlaceIssued.setValue(reservedroom.PlaceIssued);
                this.reservedRoomForm.controls.DateofBirth.setValue(new Date(reservedroom.DateofBirth));
                this.reservedRoomForm.controls.Occupation.setValue(reservedroom.Occupation);
                this.reservedRoomForm.controls.Organization.setValue(reservedroom.Organization);
                this.reservedRoomForm.controls.PurposeofVisit.setValue(reservedroom.PurposeofVisit);
                this.reservedRoomForm.controls.NextVisit.setValue(reservedroom.NextVisit);
                this.reservedRoomForm.controls.VehicleNo.setValue(reservedroom.VehicleNo);
                this.reservedRoomForm.controls.MobileNo.setValue(reservedroom.MobileNo);
                this.reservedRoomForm.controls.Remarks.setValue(reservedroom.Remarks);
                this.reservedRoomForm.controls.Relation.setValue(reservedroom.Relation);
                this.reservedRoomForm.controls.Rate.setValue(reservedroom.Rate);
                this.reservedRoomForm.controls.PAX.setValue(reservedroom.PAX);
                this.reservedRoomForm.controls.UserName.setValue(reservedroom.UserName);
                this.reservedRoomForm.controls.Plan.setValue(reservedroom.Plan);
                this.reservedRoomForm.controls['listRoomOccupiedDetail'] = this.fb.array([]);
                const control = <FormArray>this.reservedRoomForm.controls['listRoomOccupiedDetail'];
                control.reset();

                for (let i = 0; i < reservedroom.listRoomOccupiedDetail.length; i++) {
                    let valuesFromServer = reservedroom.listRoomOccupiedDetail[i];
                    let instance = this.fb.group(valuesFromServer);
                    control.push(instance);
                }
                this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-lg' });
            },
            error => this.msg = <any>error);
    }

    deleteReservedRoom(id: number, template: TemplateRef<any>) {
        this.isLoading = false;
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.getCHECKINCHECKOUT(id)
            .subscribe((reservedroom: RoomReserverd) => {
                this.reservedRoomForm.controls.Id.setValue(reservedroom.Id);
                this.reservedRoomForm.controls.ReservationId.setValue(reservedroom.ReservationId);
                this.reservedRoomForm.controls.Adult.setValue(reservedroom.Adult);
                this.reservedRoomForm.controls.AdvanceAmount.setValue(reservedroom.AdvanceAmount);
                this.reservedRoomForm.controls.Children.setValue(reservedroom.Children);
                this.reservedRoomForm.controls.GuestName.setValue(reservedroom.GuestName);
                this.reservedRoomForm.controls.GRC.setValue(reservedroom.GRC);
                this.reservedRoomForm.controls.NumberofRoom.setValue(reservedroom.NumberofRoom);
                this.reservedRoomForm.controls.RoomTypeId.setValue(reservedroom.RoomTypeId);
                this.reservedRoomForm.controls.ToCheckInDate.setValue(new Date(reservedroom.ToCheckInDate));
                this.reservedRoomForm.controls.ToCheckOutDate.setValue(new Date(reservedroom.ToCheckOutDate));
                this.reservedRoomForm.controls.Address.setValue(reservedroom.Address);
                this.reservedRoomForm.controls.Country.setValue(reservedroom.Country);
                this.reservedRoomForm.controls.Id_Passport_No.setValue(reservedroom.Id_Passport_No);
                this.reservedRoomForm.controls.DateofIssue.setValue(new Date(reservedroom.DateofIssue));
                this.reservedRoomForm.controls.VisaNo.setValue(reservedroom.VisaNo);
                this.reservedRoomForm.controls.PlaceIssued.setValue(reservedroom.PlaceIssued);
                this.reservedRoomForm.controls.DateofBirth.setValue(new Date(reservedroom.DateofBirth));
                this.reservedRoomForm.controls.Occupation.setValue(reservedroom.Occupation);
                this.reservedRoomForm.controls.Organization.setValue(reservedroom.Organization);
                this.reservedRoomForm.controls.PurposeofVisit.setValue(reservedroom.PurposeofVisit);
                this.reservedRoomForm.controls.NextVisit.setValue(reservedroom.NextVisit);
                this.reservedRoomForm.controls.VehicleNo.setValue(reservedroom.VehicleNo);
                this.reservedRoomForm.controls.MobileNo.setValue(reservedroom.MobileNo);
                this.reservedRoomForm.controls.Remarks.setValue(reservedroom.Remarks);
                this.reservedRoomForm.controls.Relation.setValue(reservedroom.Relation);
                this.reservedRoomForm.controls.Rate.setValue(reservedroom.Rate);
                this.reservedRoomForm.controls.PAX.setValue(reservedroom.PAX);
                this.reservedRoomForm.controls.UserName.setValue(reservedroom.UserName);
                this.reservedRoomForm.controls.Plan.setValue(reservedroom.Plan);
                this.reservedRoomForm.controls['listRoomOccupiedDetail'] = this.fb.array([]);
                const control = <FormArray>this.reservedRoomForm.controls['listRoomOccupiedDetail'];
                control.reset();

                for (let i = 0; i < reservedroom.listRoomOccupiedDetail.length; i++) {
                    let valuesFromServer = reservedroom.listRoomOccupiedDetail[i];
                    let instance = this.fb.group(valuesFromServer);
                    control.push(instance);
                }
                this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-lg' });
            },
                error => this.msg = <any>error);
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
     * 
     * @param formData 
     * @param fileUpload 
     */
    async onSubmit(formData: any, fileUpload: any) {
        this.msg = "";
        this.formSubmitAttempt = true;
        let roomReserve = this.reservedRoomForm;

        if (roomReserve.valid) {
            debugger
            let newDate = new Date();
            let checkInDate = new Date(roomReserve.get('ToCheckInDate').value);
            let checkOutDate = new Date(roomReserve.get('ToCheckOutDate').value);
            let DateofIssue = new Date(roomReserve.get('DateofIssue').value);
            let DateofBirth = new Date(roomReserve.get('DateofBirth').value);
            checkInDate.setTime(checkInDate.getTime() - (newDate.getTimezoneOffset() * 60000));
            checkOutDate.setTime(checkOutDate.getTime() - (newDate.getTimezoneOffset() * 60000));
            DateofIssue.setTime(DateofIssue.getTime() - (newDate.getTimezoneOffset() * 60000));
            DateofBirth.setTime(DateofBirth.getTime() - (newDate.getTimezoneOffset() * 60000));
            let CurrentUserName = this.currentUser['FullName'];
            roomReserve.get('ToCheckInDate').setValue(checkInDate);
            roomReserve.get('ToCheckOutDate').setValue(checkOutDate);
            roomReserve.get('DateofIssue').setValue(DateofIssue);
            roomReserve.get('DateofBirth').setValue(DateofBirth);
            roomReserve.get('UserName').setValue(CurrentUserName);
            
            switch (this.dbops) {
                case DBOperation.create:
                    this._reservationService.post(Global.BASE_CHECKIN_ENDPOINT, roomReserve.value).subscribe(
                        async data => {
                            if (data > 0) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'CheckInCheckOut',
                                    'id': data
                                });
                                alert("Data successfully added.");
                                this.loadRoomReserveds();
                                this.modalRef.hide();
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
                case DBOperation.update:
                    this._reservationService.put(Global.BASE_CHECKIN_ENDPOINT, formData._value.Id, roomReserve.value).subscribe(
                        async (data) => {
                            ' '
                            if (data > 0) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'CheckInCheckOut',
                                    'id': data
                                });
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.loadRoomReserveds();
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
                    this._reservationService.delete(Global.BASE_CHECKIN_ENDPOINT, formData._value.Id).subscribe(
                        data => {
                            if (data == 1) {
                                alert("ReservedRoom successfully deleted.");
                                this.modalRef.hide();
                                this.loadRoomReserveds();
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
            this.validateAllFields(roomReserve);
        }
    }

    /**
     * 
     * @param Id 
     */
    getRoomReserverdType(Id: number) {
        if (this.reservations) {
            return this.reservations.filter((rType) => {
                return rType.Id === Id;
            })[0];
        }
    }

    /**
     * 
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
     * 
     * @param Id 
     */
    getReservation(Id: number) {
        if (this.reservations) {
            return JSON.parse(JSON.stringify(this.reservations)).filter((r) => {
                return r.Id === Id;
            })[0];
        }
    }

    /**
     * 
     * @param Id 
     */
    getCustomer(Id: number) {
        if (this.customers) {
            return this.customers.filter((customer) => {
                return customer.Id === Id;
            })[0];
        }
    }

    /**
     * returns the customer 
     * @param rm 
     */
    getCustomerFromReservation (rm: RoomReserverd) {
        let customer: any = { CustomerName: '' };
        let reservation: Reservation = this.getReservation(rm.ReservationId);
        if (reservation) {
            customer = this.getCustomer(reservation.CustomerId);
        }
        return customer;
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.reservedRoomForm.enable() : this.reservedRoomForm.disable();
    }

    /**
     * Filters reservation fills the form
     * @param event 
     */
    fillForm <FormGroup> (event) {
        let param = event.target.value;
        let reservationId = eval(param.split(':')[1].trim());
        let reservation = JSON.parse(JSON.stringify(this.reservations)).filter((reservation) => {
            return reservation.Id  == reservationId;
        })[0];
        if (reservation) {
            this.reservedRoomForm.controls.Adult.setValue(reservation.Adult);
            this.reservedRoomForm.controls.Children.setValue(reservation.Children);
            this.reservedRoomForm.controls.NumberofRoom.setValue(reservation.NumberOfRoom);
            this.reservedRoomForm.controls.RoomTypeId.setValue(reservation.RoomTypeId);
            this.reservedRoomForm.controls.ToCheckInDate.setValue(new Date(reservation.CheckInDate));
            this.reservedRoomForm.controls.ToCheckOutDate.setValue(new Date(reservation.CheckOutDate));
            this.reservedRoomForm.controls.GuestName.setValue(reservation.GuestName);
        }
    }
    
    // Fetch reservations based on given fetch type
    getData(fetchType: string) {
        debugger
        //this.isLoading = true;
        //this._reservationService.get(Global.BASE_CHECKIN_ENDPOINT + '?fetchType=' + fetchType + '&moduleName=test')
        //    .subscribe(
        //        reservations => {
        //            this.reservations = reservations;
        //            this.isLoading = false;
        //        },
        //        error => this.msg = <any>error
        //    );
        this.loadData(fetchType);
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
        filename = filename ? filename + '.xls' : 'Reservation Check In of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
}
