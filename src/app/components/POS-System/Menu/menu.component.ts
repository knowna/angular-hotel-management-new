import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingService } from '../../../Service/Billing/billing.service';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { IMenu } from '../../../Model/Menu/Menu';
import { IMenuCategory } from '../../../Model/Menu/MenuCategory';
import { DBOperation } from '../../../Shared/enum';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';

@Component({
    selector: 'my-menu-list',
    templateUrl: './Menu.component.html'
})

export class MenuComponent implements OnInit {
    menus: IMenu[];
    menu: IMenu;
    //menucategories: IMenuCategory[];
   // menucategory: IMenuCategory;
    msg: string;
    indLoading: boolean = false;
    public formSubmitAttempt: boolean;
    MenuFrm: FormGroup;

    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;

    name = '';

    constructor(private fb: FormBuilder, private _menuService: BillingService, private modalService: BsModalService) {
    }

    ngOnInit(): void {
        this.MenuFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadMenu();
    }

    LoadMenu(): void {
        this.indLoading = true;
        this._menuService.get(Global.BASE_MENU_ENDPOINT)
            .subscribe(menus => { this.menus = menus; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    addMenu(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add";
        this.modalBtnTitle = "Save";
        this.MenuFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }
    
    editMenu(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit";
        this.modalBtnTitle = "Update";
        this.menu = this.menus.filter(x => x.Id == id)[0];
        this.MenuFrm.controls['Id'].setValue(this.menu.Id);
        this.MenuFrm.controls['Name'].setValue(this.menu.Name);
        // this.MenuFrm.setValue(this.menu);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
        //this.modal.open();
    }

    deleteMenu(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.menu = this.menus.filter(x => x.Id == id)[0];
        // this.MenuFrm.setValue(this.menu);
        this.MenuFrm.controls['Id'].setValue(this.menu.Id);
        this.MenuFrm.controls['Name'].setValue(this.menu.Name);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
        //this.modal.open();
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
        let MenuFrm = this.MenuFrm;

        if (MenuFrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._menuService.post(Global.BASE_MENU_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadMenu();
                                this.formSubmitAttempt = true;
                                this.modalRef.hide();
                            }
                            else {
                                this.msg = "There is some issue in saving records, please contact to system administrator!"
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.update:
                    this._menuService.put(Global.BASE_MENU_ENDPOINT, formData.value.Id, formData.value).subscribe(
                  
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = true;
                                this.LoadMenu();
                                
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
                case DBOperation.delete:
                    this._menuService.delete(Global.BASE_MENU_ENDPOINT, formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadMenu();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            //this.modal.dismiss();
                        },
                        error => {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    );
                    break;
            }
        }
        else {
            this.validateAllFields(MenuFrm);
        }
        
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.MenuFrm.enable() : this.MenuFrm.disable();
    }
}