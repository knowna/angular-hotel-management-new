import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { IWareHouseType } from '../../../Model/WareHouse/WareHouse';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';


@Component({
    selector: 'my-warehouse-list',
    templateUrl: './warehousetype.component.html'
})


export class WareHouseTypeComponent implements OnInit {
    warehousetypes: IWareHouseType[];
    warehousetype: IWareHouseType;
    msg: string;
    indLoading: boolean = false;
    private formSubmitAttempt: boolean;
    warehousetypefrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;

    constructor(private fb: FormBuilder, private _warehousetypeService: AccountTransactionTypeService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.warehousetypefrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadWarehousetype();
    }

    LoadWarehousetype(): void {
          
        this.indLoading = true;
        this._warehousetypeService.get(Global.BASE_WAREHOUSETYPE_ENDPOINT)
            .subscribe(warehousetypes => {
                  
                this.warehousetypes = warehousetypes; this.indLoading = false;
            },
            error => this.msg = <any>error);
    }
    openModal(template: TemplateRef<any>) {

        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Room";
        this.modalBtnTitle = "Save";
        this.warehousetypefrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editwarehousetype(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit DepartmentName";
        this.modalBtnTitle = "Update";
        this.warehousetype = this.warehousetypes.filter(x => x.Id == id)[0];
        this.warehousetypefrm.setValue(this.warehousetype);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deletewarehousetype(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.warehousetype = this.warehousetypes.filter(x => x.Id == id)[0];
        this.warehousetypefrm.setValue(this.warehousetype);
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
        let roomtypefrm = this.warehousetypefrm;

        if (roomtypefrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._warehousetypeService.post(Global.BASE_WAREHOUSETYPE_ENDPOINT,  formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                  
                                alert("Data successfully added.");
                                this.LoadWarehousetype();
                                this.formSubmitAttempt = false;
                                this.modalRef.hide();
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
                    this._warehousetypeService.put(Global.BASE_WAREHOUSETYPE_ENDPOINT,  formData.value.Id,  formData.value).subscribe(
                        data => {
                              
                            if (data == 1) //Success
                            {
                                  
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadWarehousetype();
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
                    this._warehousetypeService.delete(Global.BASE_WAREHOUSETYPE_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadWarehousetype();
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
            this.validateAllFields(roomtypefrm);
        }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.warehousetypefrm.enable() : this.warehousetypefrm.disable();
    }

}
