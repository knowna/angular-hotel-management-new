import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { PaymentTypeService } from '../../../services/reservation/payment-type.services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PaymentType } from '../../../models/reservation/payment-type.model';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';

@Component({
    templateUrl: './payment-type.component.html'
})

export class PaymentTypeComponent implements OnInit {
    paymentTypes: PaymentType[];
    paymentType: PaymentType;
    msg: string;
    isLoading: boolean = false;
    paymentTypeForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    
    constructor(private fb: FormBuilder, private _paymentTypeService: PaymentTypeService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.paymentTypeForm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadPaymentTypes();
    }
    
    LoadPaymentTypes(): void {
        ' '
        this.isLoading = true;
        this._paymentTypeService.get(Global.BASE_PAYMENT_TYPES_ENDPOINT)
            .subscribe(paymentTypes => { this.paymentTypes = paymentTypes; this.isLoading = false; },
            error => this.msg = <any>error);
    }

    openModal(template: TemplateRef<any>) {

        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Payment Type";
        this.modalBtnTitle = "Save";
        this.paymentTypeForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Payment Type";
        this.modalBtnTitle = "Update";
        this.paymentType = this.paymentTypes.filter(x => x.Id == id)[0];
        this.paymentTypeForm.setValue(this.paymentType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.paymentType = this.paymentTypes.filter(x => x.Id == id)[0];
        this.paymentTypeForm.setValue(this.paymentType);
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
        let departfrm = this.paymentTypeForm;

        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._paymentTypeService.post(Global.BASE_PAYMENT_TYPES_ENDPOINT, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadPaymentTypes();
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
                    this._paymentTypeService.put(Global.BASE_PAYMENT_TYPES_ENDPOINT, formData._value.Id, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadPaymentTypes();
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
                    this._paymentTypeService.delete(Global.BASE_PAYMENT_TYPES_ENDPOINT, formData._value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.LoadPaymentTypes();
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
        isEnable ? this.paymentTypeForm.enable() : this.paymentTypeForm.disable();
    }
}
