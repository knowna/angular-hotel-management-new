import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { IMenuItem } from '../../../../Model/Menu/MenuItem';
import { IMenuCategory } from '../../../../Model/Menu/MenuCategory';
import { DBOperation } from '../../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../../Shared/global';
import { BillingService } from 'src/app/Service/Billing/billing.service';

@Component({
    selector : 'MenuCategoryItem',
    templateUrl: './MenuCategoryItem.component.html'
})


export class MenuCategoryItem implements OnInit {
    menuItems: IMenuItem[];
    menuItem: IMenuItem;
    menucategories: IMenuCategory[];
    menucategory: IMenuCategory;
    msg: string;
    indLoading: boolean = false;
    MenuItemForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;

    constructor(private fb: FormBuilder, private _menuItemService: BillingService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.MenuItemForm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            CategoryId: ['', Validators.required],
            Barcode: ['', Validators.required],
            Tag: ['', Validators.required],
            MenuItemPortions: this.fb.array([])
        });
        this.route.params.subscribe((params: Params) => {
            this.LoadMenuItems(params['productid']);
        });
     
    }

    LoadMenuItems(Id: number): void {
        
        this.indLoading = true;
        this._menuItemService.get(Global.BASE_MENUCATEGORYITEM_ENDPOINT + Id)
            .subscribe(menuItems => { this.menuItems = menuItems; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.MenuItemForm.enable() : this.MenuItemForm.disable();
    }
}