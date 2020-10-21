import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ReservationTypeService } from '../../../Service/reservation/reservation-type.services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReservationType } from '../../../Model/reservation/reservation-type.model';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs';
import { Global } from '../../../Shared/global'; import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';

@Component({
    templateUrl: './reservation-type.component.html',
    styleUrls: ['./reservation-type.component.css']
})
export class ReservationTypeComponent implements OnInit {
    reservationTypes: ReservationType[];
    reservationType: ReservationType;
    msg: string;
    isLoading: boolean = false;
    reservationTypeForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    
    constructor(private fb: FormBuilder, private _reservationTypeService: ReservationTypeService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.reservationTypeForm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadReservationTypes();
    }
    
    LoadReservationTypes(): void {
        ' '
        this.isLoading = true;
        this._reservationTypeService.get(Global.BASE_RESERVATION_TYPES_ENDPOINT)
            .subscribe(reservationTypes => { this.reservationTypes = reservationTypes; this.isLoading = false; },
            error => this.msg = <any>error);
    }

    openModal(template: TemplateRef<any>) {

        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Reservation Type";
        this.modalBtnTitle = "Save";
        this.reservationTypeForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Reservation Type";
        this.modalBtnTitle = "Update";
        this.reservationType = this.reservationTypes.filter(x => x.Id == id)[0];
        this.reservationTypeForm.setValue(this.reservationType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.reservationType = this.reservationTypes.filter(x => x.Id == id)[0];
        this.reservationTypeForm.setValue(this.reservationType);
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
        let departfrm = this.reservationTypeForm;

        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._reservationTypeService.post(Global.BASE_RESERVATION_TYPES_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadReservationTypes();
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
                    this._reservationTypeService.put(Global.BASE_RESERVATION_TYPES_ENDPOINT,  formData.value.Id, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadReservationTypes();
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
                    this._reservationTypeService.delete(Global.BASE_RESERVATION_TYPES_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.LoadReservationTypes();
                                this.formSubmitAttempt = false;
                            } else {
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
        isEnable ? this.reservationTypeForm.enable() : this.reservationTypeForm.disable();
    }
}
