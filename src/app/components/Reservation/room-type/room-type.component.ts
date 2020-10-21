import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RoomTypeService } from '../../../Service/reservation/room-type.services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RoomType } from '../../../Model/reservation/room-type.model';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global'; import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';


@Component({
    templateUrl: './room-type.component.html',
    styleUrls: ['./room-type.component.css']
})

export class RoomTypeComponent implements OnInit {
    roomTypes: RoomType[];
    roomType: RoomType;
    msg: string;
    isLoading: boolean = false;
    roomTypeForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    
    constructor(private fb: FormBuilder, private _roomTypeService: RoomTypeService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.roomTypeForm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadRoomTypes();
    }
    
    LoadRoomTypes(): void {
        ' '
        this.isLoading = true;
        this._roomTypeService.get(Global.BASE_ROOM_TYPES_ENDPOINT)
            .subscribe(roomTypes => { this.roomTypes = roomTypes; this.isLoading = false; },
            error => this.msg = <any>error);
    }

    openModal(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Room Type";
        this.modalBtnTitle = "Save";
        this.roomTypeForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Room Type";
        this.modalBtnTitle = "Update";
        this.roomType = this.roomTypes.filter(x => x.Id == id)[0];
        this.roomTypeForm.setValue(this.roomType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.roomType = this.roomTypes.filter(x => x.Id == id)[0];
        this.roomTypeForm.setValue(this.roomType);
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
        let departfrm = this.roomTypeForm;

        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._roomTypeService.post(Global.BASE_ROOM_TYPES_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully added.");
                                this.LoadRoomTypes();
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
                    this._roomTypeService.put(Global.BASE_ROOM_TYPES_ENDPOINT,  formData.value.Id, formData.value).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadRoomTypes();
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
                    this._roomTypeService.delete(Global.BASE_ROOM_TYPES_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.LoadRoomTypes();
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
            this.validateAllFields(departfrm);
        }
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.roomTypeForm.enable() : this.roomTypeForm.disable();
    }
}
