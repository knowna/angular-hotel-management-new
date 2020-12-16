import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RoomOccupiedService } from '../../../services/reservation/room-occupied.services';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { RoomOccupied } from '../../../models/reservation/room-occupied.model';
import { Reservation } from '../../../models/reservation/reservation.model';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { forkJoin } from "rxjs/observable/forkJoin";
import { Global } from '../../../Shared/global';
import { Customer } from '../../../models/reservation/customer.model';
import { Room } from '../../../models/reservation/room.model';

@Component({
    templateUrl: './room-occupied.component.html'
})

export class RoomOccupiedComponent implements OnInit {
    occupiedRooms: RoomOccupied[];
    rooms: Room[];
    reservations: Reservation[];
    customers: Customer[];

    occupiedRoom: RoomOccupied;
    msg: string;
    isLoading: boolean = false;
    occupiedRoomForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    public company: any = {};
    constructor(
        private fb: FormBuilder,
        private _roomOccupiedService: RoomOccupiedService,
        private modalService: BsModalService,
        private date: DatePipe
    ) { this.company = JSON.parse(localStorage.getItem('company'));}

    ngOnInit(): void {
        this.occupiedRoomForm = this.fb.group({
            Id: [''],
            CustomerId: ['', Validators.required],
            ReservationId: ['', Validators.required],
            listRoomOccupiedDetail: this.fb.array([this.initRoomlistRoomOccupiedDetail()])
        });
        debugger
        this.loadData();
    }

    /**
     * Loads data for reserved rooms list
     */
    loadData() {
        debugger
        this.isLoading = true;
        let rooms = this._roomOccupiedService.get(Global.BASE_RESERVATION_ROOM_ENDPOINT);
        let customers = this._roomOccupiedService.get(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT);
        let reservations = this._roomOccupiedService.get(Global.BASE_RESERVATION_ENDPOINT + '?fetchType=today&moduleName=test');
        let occupiedRooms = this._roomOccupiedService.get(Global.BASE_ROOM_OCCUPIED_ENDPOINT + '?fetchType=today&moduleName=roomOccupancy');

        forkJoin([rooms, reservations, customers, occupiedRooms])
            .subscribe(results => {
                this.rooms = results[0];
                this.reservations = results[1];
                this.customers = results[2];
                this.occupiedRooms = results[3];
                this.isLoading = false;
            },
                error => this.msg = <any>error
            );
    }

    initRoomlistRoomOccupiedDetail() {
        //initialize our vouchers
        return this.fb.group({
            Id: [''],
            ReservationId: [''],
            RoomOccupiedId: [''],
            RoomId: ['', Validators.required],
            GuestName: ['', Validators.required]
        });
    }

    addRoom() {
        debugger
        const control = <FormArray>this.occupiedRoomForm.controls['listRoomOccupiedDetail'];
        const addRoom = this.initRoomlistRoomOccupiedDetail();
        control.push(addRoom);
    }

    loadOccupiedRooms() {
        this._roomOccupiedService.get(Global.BASE_ROOM_OCCUPIED_ENDPOINT + '?fetchType=today&moduleName=roomOccupancy')
            .subscribe(
                occupiedRooms => {
                    ' '
                    this.occupiedRooms = occupiedRooms;
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
    }

    openModal(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Room Occupancy (Allocation)";
        this.modalBtnTitle = "Save";
        this.occupiedRoomForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-lg' });
    }

    editOccupiedRoom(id: number, template: TemplateRef<any>) {
        debugger
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Room Occupancy (Allocation)";
        this.modalBtnTitle = "Update";
        this.occupiedRoom = this.occupiedRooms.filter(x => x.Id == id)[0];
        this.occupiedRoomForm.controls.Id.setValue(this.occupiedRoom.Id);
        this.occupiedRoomForm.controls.CustomerId.setValue(this.occupiedRoom.CustomerId);
        this.occupiedRoomForm.controls.ReservationId.setValue(this.occupiedRoom.ReservationId);

        this.occupiedRoomForm.controls['listRoomOccupiedDetail'] = this.fb.array([]);
        const control = <FormArray>this.occupiedRoomForm.controls['listRoomOccupiedDetail'];
        control.reset();

        for (let i = 0; i < this.occupiedRoom.listRoomOccupiedDetail.length; i++) {
            let valuesFromServer = this.occupiedRoom.listRoomOccupiedDetail[i];
            let instance = this.fb.group(valuesFromServer);
            control.push(instance);
        }
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-lg' });
    }

    deleteOccupiedRoom(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Room Occupancy (Allocation) Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.occupiedRoom = this.occupiedRooms.filter(x => x.Id == id)[0];
        this.occupiedRoomForm.controls.Id.setValue(this.occupiedRoom.Id);
        this.occupiedRoomForm.controls.CustomerId.setValue(this.occupiedRoom.CustomerId);
        this.occupiedRoomForm.controls.ReservationId.setValue(this.occupiedRoom.ReservationId);

        this.occupiedRoomForm.controls['listRoomOccupiedDetail'] = this.fb.array([]);
        const control = <FormArray>this.occupiedRoomForm.controls['listRoomOccupiedDetail'];
        control.reset();

        for (let i = 0; i < this.occupiedRoom.listRoomOccupiedDetail.length; i++) {
            let valuesFromServer = this.occupiedRoom.listRoomOccupiedDetail[i];
            let instance = this.fb.group(valuesFromServer);
            control.push(instance);
        }
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-lg' });
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

    onSubmit(formData: any) {
        debugger
        this.msg = "";
        this.formSubmitAttempt = true;
        let roomOccupied = this.occupiedRoomForm;

        if (roomOccupied.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._roomOccupiedService.post(Global.BASE_ROOM_OCCUPIED_ENDPOINT, formData._value)
                        .subscribe(
                            data => {
                                if (data == 1) {
                                    alert("Data successfully added.");
                                    this.loadOccupiedRooms();
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
                    this._roomOccupiedService.put(Global.BASE_ROOM_OCCUPIED_ENDPOINT, formData._value.Id, formData._value).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.loadOccupiedRooms();
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
                    this._roomOccupiedService.delete(Global.BASE_ROOM_OCCUPIED_ENDPOINT, formData._value.Id).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully deleted.");
                                this.modalRef.hide();
                                this.loadOccupiedRooms();
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
        } else {
            this.validateAllFields(roomOccupied);
        }
    }

    // Remove Individual Room
    removeRoom(i: number) {
        let controls = <FormArray>this.occupiedRoomForm.controls['listRoomOccupiedDetail'];
        let controlToRemove = this.occupiedRoomForm.controls.listRoomOccupiedDetail['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        if (selectedControl) {
            this._roomOccupiedService.delete(Global.BASE_ROOM_OCCUPIED_DETAILS_ENDPOINT, i).subscribe(data => {
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

    getReservation(Id: number) {
        if (this.reservations) {
            return JSON.parse(JSON.stringify(this.reservations)).filter((r) => {
                return r.Id === Id;
            })[0];
        }
    }

    getCustomer(Id: number) {
        if (this.customers) {
            return JSON.parse(JSON.stringify(this.customers)).filter((customer) => {
                return customer.Id === Id;
            })[0];
        }
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.occupiedRoomForm.enable() : this.occupiedRoomForm.disable();
    }

    /**
     * Filters reservation fills the form
     * @param event 
     */
    fillForm<FormGroup>(event) {
        ' '
        let param = event.target.value;
        let reservationId = param.split(':')[1];
        let reservation = JSON.parse(JSON.stringify(this.reservations)).filter((reservation) => {
            return reservation.Id == reservationId;
        })[0];
        if (reservation) {
            this.occupiedRoomForm.controls.ReservationId.setValue(reservation.Id);
            this.occupiedRoomForm.controls.CustomerId.setValue(reservation.CustomerId);
        }

        return this.occupiedRoomForm;
    }

    // Fetch reservations based on given fetch type
    getData(fetchType: string) {
        this.isLoading = true;
        this._roomOccupiedService.get(Global.BASE_ROOM_OCCUPIED_ENDPOINT + '?fetchType=' + fetchType +'&moduleName=roomOccupancy')
            .subscribe(
                reservations => {
                    this.reservations = reservations;
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
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
        filename = filename ? filename + '.xls' : 'Room Allocation of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
