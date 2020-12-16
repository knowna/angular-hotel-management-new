import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { Room } from 'src/app/Model/reservation/room.model';
import { RoomType } from 'src/app/Model/reservation/customer-screen.model';
import { FacilityService } from 'src/app/Service/reservation/facility.services';

@Component({
    templateUrl: './room.component.html'
})

export class RoomComponent implements OnInit {
    rooms: Room[];
    roomTypes: RoomType[];
    room: Room;
    msg: string;
    isLoading: boolean = false;
    roomForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;

    constructor(private fb: FormBuilder, private _roomService: FacilityService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.roomForm = this.fb.group({
            Id: [''],
            MaxCapacity: ['', Validators.required],
            RoomNumber: ['', Validators.required],
            RoomPrice: ['', Validators.required],
            RoomTypeId: ['', Validators.required]
        });
        this.LoadRoomTypes();
        this.LoadRooms();
    }

    LoadRoomTypes(): void {
        this.isLoading = true;
        this._roomService.get(Global.BASE_ROOM_TYPES_ENDPOINT)
            .subscribe(roomTypes => { this.roomTypes = roomTypes; this.isLoading = false; },
                error => this.msg = <any>error);
    }

    LoadRooms(): void {
        this.isLoading = true;
        this._roomService.get(Global.BASE_RESERVATION_ROOM_ENDPOINT)
            .subscribe(rooms => { this.rooms = rooms; this.isLoading = false; },
                error => this.msg = <any>error);
    }

    openModal(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Room";
        this.modalBtnTitle = "Save";
        this.roomForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editRoom(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Room";
        this.modalBtnTitle = "Save";
        this.room = this.rooms.filter(x => x.Id == id)[0];
        this.roomForm.setValue(this.room);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteRoom(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Room";
        this.modalBtnTitle = "Delete";
        this.room = this.rooms.filter(x => x.Id == id)[0];
        this.roomForm.setValue(this.room);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
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
        this.msg = "";
        this.formSubmitAttempt = true;
        let departfrm = this.roomForm;

        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._roomService.post(Global.BASE_RESERVATION_ROOM_ENDPOINT, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadRooms();
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.update:
                    this._roomService.put(Global.BASE_RESERVATION_ROOM_ENDPOINT, formData._value.Id, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadRooms();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.delete:
                    this._roomService.delete(Global.BASE_RESERVATION_ROOM_ENDPOINT, formData._value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Room successfully deleted.");
                                this.modalRef.hide();
                                this.LoadRooms();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            //this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
            }
        }
        else {
            this.validateAllFields(departfrm);
        }
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.roomForm.enable() : this.roomForm.disable();
    }

    getRoomType(Id: number) {
        return this.roomTypes.length && this.roomTypes.filter((rType) => {
            return rType.Id === Id;
        })[0];
    }
}
