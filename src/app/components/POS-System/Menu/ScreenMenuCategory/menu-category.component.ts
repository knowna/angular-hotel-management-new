import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Params } from '@angular/router';
import { BillingService } from '../../../../Service/Billing/billing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMenuItem } from '../../../../Model/Menu/MenuItem';
import { IMenuCategory, IScreenMenuCategorys } from '../../../../Model/Menu/MenuCategory';
import { IMenu } from '../../../../Model/Menu/Menu';
import { DBOperation } from '../../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../../Shared/global';

@Component({
    selector: 'my-menu-category-list',
    templateUrl: './Menu-Category.component.html'
})

export class MenuCategoryComponent1 implements OnInit {

    screenmenucategories: IScreenMenuCategorys[];
    msg: string;
    indLoading: boolean = false;
    MenuCategoryFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;

    Name = '';

    constructor(private fb: FormBuilder, private _menucategoryService: BillingService, private _menuService: BillingService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.MenuCategoryFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            MenuId: [''],
            Menu_Bool: ['']
        });
        this.route.params.subscribe((params: Params) => {
            this.LoadMenuCategory(params['menuid']);
        });
    }

    LoadMenuCategory(Id: number): void {
        
        this.indLoading = true;
        this._menucategoryService.get(Global.BASE_MENUSCATEOGRY_ENDPOINT + Id)
            .subscribe(screenmenucategories => {
                this.screenmenucategories = screenmenucategories;
                this.indLoading = false;
            },
            error => this.msg = <any>error);
    }

    addCategoriesToMenu(categoryId, MenuId, Menu_Bool: boolean): void {
        
        let MenuCategory = new IScreenMenuCategorys(categoryId, MenuId, Menu_Bool);

        this._menucategoryService.post(Global.BASE_MENUSCATEOGRY_ENDPOINT, MenuCategory).subscribe(
            data => {
                
                if (data == 1) {
                    alert("Category successfully added.");
                    this.route.params.subscribe((params: Params) => {
                        this.LoadMenuCategory(params['menuid']);
                    });
                }
                else if (data == 2) {
                    alert("Category successfully deleted");
                }
                else {
                    alert("There is some issue in saving records, please contact to system administrator!");
                }

            },
            error => {
                alert("There is some issue in saving records, please contact to system administrator!");
            }
        );
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.MenuCategoryFrm.enable() : this.MenuCategoryFrm.disable();
    }
}
