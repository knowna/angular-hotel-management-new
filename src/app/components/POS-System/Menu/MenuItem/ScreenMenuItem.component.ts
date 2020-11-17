import { Component, OnInit, ViewChild } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMenuItem, IScreenMenuItem, IScreenMenuItems } from '../../../../Model/Menu/MenuItem';
import { IMenuCategory } from '../../../../Model/Menu/MenuCategory';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../../Shared/global';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { Location } from '@angular/common';

@Component({
    templateUrl: './ScreenMenuItem.component.html'
})


export class ScreenMenuItemComponent implements OnInit {
  
    screenmenuitems: IScreenMenuItem[];
    msg: string;
    indLoading: boolean = false;
    MenuItemForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;

    Name = '';
    categoryId: number;

    constructor(private fb: FormBuilder, private _menuItemService: BillingService, private route: ActivatedRoute,
        private modalService: BsModalService,
        private router: Router,
        private _location: Location) {
    }

    ngOnInit(): void {

        this.MenuItemForm = this.fb.group({
            Id: [''],
            Name: [''],
            categoryId: [''],
            MenuItem_Bool: [''],
            MenuItemPortions: this.fb.array([])
        });
        this.route.params.subscribe((params: Params) => {
            this.categoryId = params['categoryid'];
            this.LoadScreenCategoryItems(params['categoryid']);
        });
    }

    back() {
        this._location.back();
        // this.router.navigate(['menu-category/' + this.categoryId])
    }

    LoadScreenCategoryItems(Id: number): void {
        
        this.indLoading = true;
        this._menuItemService.get(Global.BASE_CATEGORIESITEM_ENDPOINT + Id)
            .subscribe(screenmenuitems => { this.screenmenuitems = screenmenuitems; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    addMenuToCategories(ItemId: number, categoryId, MenuItem_Bool: boolean, MenuId: number): void {
        
        let MenuCategoriesItem = new IScreenMenuItems(ItemId, categoryId, MenuId, MenuItem_Bool);
            this._menuItemService.post(Global.BASE_CATEGORIESITEM_ENDPOINT, MenuCategoriesItem).subscribe(
                data => {
                    
                    if (data == 1) {
                        alert("Product added successfully");
                    }
                    else if (data == 2) {
                        alert("Product deleted successfully");
                    }
                    else {
                        alert("There is some issue in saving records, please contact to system administrator!");
                    }
                },
                error => {
                    this.msg = error;
                }
            );
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.MenuItemForm.enable() : this.MenuItemForm.disable();
    }
}