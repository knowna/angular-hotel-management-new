import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { DBOperation } from '../../../../Shared/enum';
import { Global } from '../../../../Shared/global';

//Models
import { IMenuItem } from '../../../../Model/Menu/MenuItem';
import { IMenuCategory } from '../../../../Model/Menu/MenuCategory';
import { IMenu } from '../../../../Model/Menu/Menu';

//Service
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BillingService } from 'src/app/Service/Billing/billing.service';

@Component({
    selector: 'my-menucategory-list',
    templateUrl: './MenuCategory.component.html'
})

export class MenuCategoryComponent implements OnInit {
    menucategories: IMenuCategory[];
    menucategory: IMenuCategory;
    msg: string;
    indLoading: boolean = false;
    public formSubmitAttempt: boolean;
    MenuCategoryFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    MenuCategory: string = '';

    constructor(
        private fb: FormBuilder,
        private _menucategoryService: BillingService,
        private modalService: BsModalService) {
    }

    ngOnInit(): void {
        this.MenuCategoryFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadMenuCategory();
    }

    LoadMenuCategory(): void {
        this.indLoading = true;
        this._menucategoryService.get(Global.BASE_MENUCATEGORY_ENDPOINT)
            .subscribe(menucategories => { this.menucategories = menucategories; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    addMenuCategory(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New MenuCategory";
        this.modalBtnTitle = "Save";
        this.MenuCategoryFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editMenuCategory(Id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Category";
        this.modalBtnTitle = "Update";
        this.menucategory = this.menucategories.filter(x => x.Id == Id)[0];
        this.MenuCategoryFrm.setValue(this.menucategory);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteMenuCategory(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.menucategory = this.menucategories.filter(x => x.Id == id)[0];
        this.MenuCategoryFrm.setValue(this.menucategory);
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
        let menucatform = this.MenuCategoryFrm;
        if (menucatform.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._menucategoryService.post(Global.BASE_MENUCATEGORY_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added")
                                this.LoadMenuCategory();
                                this.formSubmitAttempt = false;
                                this.modalRef.hide();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    );
                    break;
                case DBOperation.update:
                    this._menucategoryService.put(Global.BASE_MENUCATEGORY_ENDPOINT, formData.value.Id, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadMenuCategory();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                        },
                        error => {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    );
                    break;
                case DBOperation.delete:
                    this._menucategoryService.delete(Global.BASE_MENUCATEGORY_ENDPOINT, formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadMenuCategory();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    );
                    break;
            }
        }
        else {
            this.validateAllFields(menucatform);
        }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.MenuCategoryFrm.enable() : this.MenuCategoryFrm.disable();
    }
}
