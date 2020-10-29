import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ICategory } from '../../../Model/Category';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';


@Component({
    templateUrl: './category.component.html'
})


export class CategoryComponent implements OnInit {
    categorys: ICategory[];
    category: ICategory;
    msg: string;
    indLoading: boolean = false;
    private formSubmitAttempt: boolean;
    CategoryFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    ItemCategory: string = '';

    constructor(private fb: FormBuilder, private _categoryService: AccountTransactionTypeService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.CategoryFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadDepartment();
    }
    
    LoadDepartment(): void {
          
        this.indLoading = true;
        this._categoryService.get(Global.BASE_CATEGORY_ENDPOINT)
            .subscribe(categorys => { this.categorys = categorys; this.indLoading = false; },
            error => this.msg = <any>error);
    }
    openModal(template: TemplateRef<any>) {

        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Category";
        this.modalBtnTitle = "Save";
        this.CategoryFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editCategory(id: number, template: TemplateRef<any>) {
          
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Category";
        this.modalBtnTitle = "Save";
        this.category = this.categorys.filter(x => x.Id == id)[0];
        this.CategoryFrm.setValue(this.category);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteCategory(id: number, template: TemplateRef<any>) {
          
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.category = this.categorys.filter(x => x.Id == id)[0];
        this.CategoryFrm.setValue(this.category);
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
        let departfrm = this.CategoryFrm;

        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._categoryService.post(Global.BASE_CATEGORY_ENDPOINT,  formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadDepartment();
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
                    this._categoryService.put(Global.BASE_CATEGORY_ENDPOINT,  formData.value.Id,  formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadDepartment();
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
                    this._categoryService.delete(Global.BASE_CATEGORY_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.LoadDepartment();
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
        isEnable ? this.CategoryFrm.enable() : this.CategoryFrm.disable();
    }

}
