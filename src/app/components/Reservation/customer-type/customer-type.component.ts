import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerTypeService } from '../../../Service/reservation/customer-type.services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomerType } from '../../../Model/reservation/customer-type.model';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs';
import { Global } from '../../../Shared/global'; import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';

@Component({
    templateUrl: './customer-type.component.html',
    styleUrls: ['./customer-type.component.css']
})
export class CustomerTypeComponent implements OnInit {
    customerTypes: CustomerType[];
    customerType: CustomerType;
    msg: string;
    isLoading: boolean = false;
    customerTypeForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    
    constructor(private fb: FormBuilder,
        private _customerTypeService: CustomerTypeService,
        private modalService: BsModalService) { }

    ngOnInit(): void {
        this.customerTypeForm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadCustomerTypes();
    }
    
    LoadCustomerTypes(): void {
        ' '
        this.isLoading = true;
        this._customerTypeService.get(Global.BASE_CUSTOMER_TYPES_ENDPOINT)
            .subscribe(customerTypes => { this.customerTypes = customerTypes; this.isLoading = false; },
            error => this.msg = <any>error);
    }

    openModal(template: TemplateRef<any>) {

        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Customer Type";
        this.modalBtnTitle = "Save";
        this.customerTypeForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Customer Type";
        this.modalBtnTitle = "Update";
        this.customerType = this.customerTypes.filter(x => x.Id == id)[0];
        this.customerTypeForm.setValue(this.customerType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.customerType = this.customerTypes.filter(x => x.Id == id)[0];
        this.customerTypeForm.setValue(this.customerType);
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
        let departfrm = this.customerTypeForm;

        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._customerTypeService.post(Global.BASE_CUSTOMER_TYPES_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadCustomerTypes();
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
                    this._customerTypeService.put(Global.BASE_CUSTOMER_TYPES_ENDPOINT,  formData.value.Id, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadCustomerTypes();
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
                    this._customerTypeService.delete(Global.BASE_CUSTOMER_TYPES_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.LoadCustomerTypes();
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
        isEnable ? this.customerTypeForm.enable() : this.customerTypeForm.disable();
    }
}
