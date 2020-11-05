import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {BillingService} from "../../../../Service/Billing/billing.service";
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MenuConsumption, MenuConsumptionDetail } from '../../../../Model/Menu/menuConsumption';
import { IMenuCategory } from '../../../../Model/Menu/MenuCategory';
import { Account } from '../../../../Model/Account/account';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { InventoryItem } from '../../../../Model/Inventory/inventoryItem';
import { IMenuItem, IScreenMenuItem, IScreenMenuItems, IMenuItemPortion } from '../../../../Model/Menu/MenuItem';
import { MenuItemPortion } from '../../../../Model/Menu/MenuItemPortion';
import { InventoryReceipt } from '../../../../Model/Inventory/InventoryReceipt';
import { IInventoryItem } from '../../../../Model/Inventory/inventoryItem';

import { DBOperation } from '../../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../../Shared/global';
import * as ProductSelector from '../../../../selectors/product.selector';
import { Product } from '../../../../Model/product.model';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'menu-consumption',
    templateUrl: 'menu-consumption.component.html'
})

export class MenuConsumptionComponent implements OnInit {
    menuConsumptions: MenuConsumption[];
    tempMenuConsumptions: MenuConsumption[];
    menuConsumption: MenuConsumption;
    menucategory;
    screenmenuitems: IScreenMenuItem[];
    menuItemFilter: IMenuItem[];
    MenuItemPortions;
    inventoryReceipt: InventoryReceipt[];
    inventoryReceiptItem;
    menuconsumptionDetails: MenuConsumptionDetail[];
    msg: string;
    indLoading: boolean = false;
    formSubmitAttempt: boolean;
    MenuConsumptionForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private sub: any;
    MenuConsumption: string = '';

    config = {
        search:true,
        displayKey:"Name",
        searchOnKey: 'Name',
        height: '300px'
    }

    productConfig ={
        search:true,
        displayKey:"Name",
        searchOnKey: 'Name',
        height: '300px'
    }

    constructor(private fb: FormBuilder, private _menuItemService: BillingService,
        private _menuportionservice: BillingService,
        private modalService: BsModalService,
        private _purchaseService: BillingService,
        private _menucategoryService: BillingService,
        private _menuConsumptionService: BillingService,
        private _inventoryReceiptService: BillingService, 
        private _menuConsumptionDetailsService: BillingService,
        private location: Location, 
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this._menuItemService.getMenuCategories().subscribe(data => { this.menucategory = data });
        this._inventoryReceiptService.getInventoryItems().subscribe(data => { this.inventoryReceiptItem = data });
        this._menuConsumptionService.getMenuConsumptionProductPortions().subscribe(data => this.MenuItemPortions = data);
    }

    ngOnInit(): void {
        // this.MenuConsumptionForm = this.fb.group({
        //     Id: [''],
        //     CategoryId: [''],
        //     ProductId: [''],
        //     ProductPortionId: [''],
        //     MenuConsumptionDetails: this.fb.array([this.initMenuConsumptionPortions()]),
        // });
        this.buildMenuConsumptionForm();
        this.LoadMenuConsumptions();
    }

    buildMenuConsumptionForm() {
        this.MenuConsumptionForm = this.fb.group({
            Id: [''],
            CategoryId: ['',Validators.required],
            ProductId: ['',Validators.required],
            ProductPortionId: ['',Validators.required],
            MenuConsumptionDetails: this.fb.array([this.initMenuConsumptionPortions()]),
        });
    }


    initMenuConsumptionPortions() {
        return this.fb.group({
            Id: [''],
            InventoryItemId: ['', Validators.required],
            MenuConsumptionId: [''],
            Quantity: ['', Validators.required]
        });
    }

    LoadMenuConsumptions(): void {
        
        this.indLoading = true;
        this._menuConsumptionService.get(Global.BASE_MENUCONSUMPTION_ENDPOINT)
            .subscribe(
                menuConsumptions => { 
                    // console.log(menuConsumptions);
                    
                    this.menuConsumptions = menuConsumptions; 
                    this._menuConsumptionService.getMenuConsumptionProductPortions()
                        .subscribe(
                            data => {
                                if(data) {
                                    this.menuConsumptions = this.menuConsumptions.map(function(x) {
                                        let ProductNamelist = data.filter(ISRItem =>ISRItem.MenuItemPortionId === x.ProductPortionId)[0];
                                        x.MenuConsumptionName = ProductNamelist.Name;
                                        return x;
                                    });
                                    
                                }
                    });
                        
                    this.indLoading = false; 
                },
            error => this.msg = <any>error);
    }

    getProductName(Id: number) {
        
        let ProductName;
        if (this.MenuItemPortions) {
            let ProductNamelist = this.MenuItemPortions.filter(ISRItem =>ISRItem.MenuItemPortionId === Id)[0];
            ProductName = ProductNamelist.Name;
        }
        return ProductName;
    }

    getIRItemName(Id: number) {
        //
        if (this.inventoryReceiptItem) {
            return this.inventoryReceiptItem.filter((ISRItem) => {
                return ISRItem.Id === Id;
            })[0];
        }
    }

    addMenuConsumptionDetail() {
        // const control = <FormArray>this.MenuConsumptionForm.controls['MenuConsumptionDetails'];
        // const AddPortions = this.initMenuConsumptionPortions();
        // control.push(AddPortions);
        this.MenuConsumptionDetails.push(this.initMenuConsumptionPortions());
    }

    // removeTrackerModel(index){
    //     this.AccountTransactionValues.removeAt(index);
    // }


    removeMenuConsumptionDetails(i: number) {
        
        if (window.confirm('Are sure you want to delete this consumption item ?')) {
            let controls = <FormArray>this.MenuConsumptionForm.controls['MenuConsumptionDetails'];
            let controlToRemove = this.MenuConsumptionForm.controls.MenuConsumptionDetails['controls'][i].controls;
            let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;
            let PositionConsumId = controlToRemove.Id.value;

            if (PositionConsumId !="") {
                this._menuConsumptionDetailsService.delete(Global.BASE_MENUCONSUMPTIONDETAILS_ENDPOINT, PositionConsumId).subscribe(data => {
                    (data == 1) && controls.removeAt(i);
                });
            } else {
                if (i >= 0) {
                    controls.removeAt(i);
                } else {
                    alert("Form requires at least one row");
                }
            }
        }
    }

    onChangeCategory(event) {
        
        this._menuItemService.get(Global.BASE_MENUITEM_ConsumptionCategory_ENDPOINT + '?CategoryId=' + event.Id).subscribe(data => {
            this.menuItemFilter = data;
            // this.MenuConsumptionForm.controls['ProductId'].setValue(null);
            // this.MenuConsumptionForm.controls['ProductPortionId'].setValue(null);
            this.indLoading = false;
        });
    }

    onChangeProduct(event) {
        this._menuItemService.get(Global.BASE_MENUITEMPORTION_ENDPOINT + '?ItemId=' + event.Id).subscribe(data => {
            this.screenmenuitems = data;
            // this.MenuConsumptionForm.controls['ProductPortionId'].setValue(null);
            this.indLoading = false;
        });
    }

    onChangePortion(i: number) {
        
        this._menuConsumptionDetailsService.get(Global.BASE_MENUCONSUMPTIONDETAILS_ENDPOINT + '?ProductPortionId=' + i).subscribe((data) => {
            this.menuconsumptionDetails = data;
            
            if (this.menuconsumptionDetails.length > 0) {
                alert("The item position already added. Please edit your item position from Edit")
                this.router.navigate(['pos-dashboard/table/menuconsumption'])
            }
            else {
                // this.MenuConsumptionForm.controls['MenuConsumptionDetails'] = this.fb.array([]);
            }
        });
    }

    getMenuComsumption(Id: number) {
        
        this.indLoading = true;
        return this._menuConsumptionService.get(Global.BASE_MENUCONSUMPTION_ENDPOINT + '?Id=' + Id);
    }

    addMenuConsumptions(template: TemplateRef<any>) {
        this.buildMenuConsumptionForm();
        // this.MenuConsumptionForm.reset();
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Menu Consumption";
        this.modalBtnTitle = "Save";

        this.modalRef = this.modalService.show(template, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    editMenuConsumptions(Id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Menu Consumption";
        this.modalBtnTitle = "Update";
        
        this.getMenuComsumption(Id).subscribe((menuConsumptions: MenuConsumption) => {
            this.indLoading = false;
            this.MenuConsumptionForm.controls['Id'].setValue(menuConsumptions.Id);

            let category= this.menucategory.find(cat=> cat.Id == menuConsumptions.CategoryId);

            this.MenuConsumptionForm.controls['CategoryId'].setValue(category);
            
            this.onChangeCategory(category);


            this._menuItemService.get(Global.BASE_MENUITEM_ConsumptionCategory_ENDPOINT + '?CategoryId=' + category.Id).subscribe(data => {
                this.menuItemFilter = data;
                let product = this.menuItemFilter.find(p => p.Id == menuConsumptions.ProductId); 
                this.MenuConsumptionForm.controls['ProductId'].setValue(product);

                this.onChangeProduct(product);
                this._menuItemService.get(Global.BASE_MENUITEMPORTION_ENDPOINT + '?ItemId=' + product.Id).subscribe(data => {
                    this.screenmenuitems = data;
                });
                this.MenuConsumptionForm.controls['ProductPortionId'].setValue(menuConsumptions.ProductPortionId);
            });


            // this.MenuConsumptionForm.controls['ProductId'].setValue(menuConsumptions.ProductId);
            // this.onChangeProduct(product);
            // console.log('the produc tport', this.screenmenuitems)
            // this.MenuConsumptionForm.controls['ProductPortionId'].setValue(menuConsumptions.ProductPortionId);

            this.MenuConsumptionForm.controls['MenuConsumptionDetails'] = this.fb.array([]);
            const control = <FormArray>this.MenuConsumptionForm.controls['MenuConsumptionDetails'];

            for (let i = 0; i < menuConsumptions.MenuConsumptionDetails.length; i++) {
                let valuesFromServer = menuConsumptions.MenuConsumptionDetails[i];
                let instance = this.fb.group(valuesFromServer);

                instance.controls['Id'].setValue(valuesFromServer.Id);
                instance.controls['MenuConsumptionId'].setValue(valuesFromServer.MenuConsumptionId);
                instance.controls['InventoryItemId'].setValue(valuesFromServer.InventoryItemId);
                instance.controls['Quantity'].setValue(valuesFromServer.Quantity);
                control.push(instance);
            }

             this.modalRef = this.modalService.show(template, {
                backdrop: 'static',
                 keyboard: false,
                 class: 'modal-lg'
            });
        },
            error => this.msg = <any>error);
    }

    deleteMenuConsumptions(Id: number, template: TemplateRef<any>) {
        
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";

        this.getMenuComsumption(Id).subscribe((menuConsumptions: MenuConsumption) => {
            this.indLoading = false;
            this.MenuConsumptionForm.controls['Id'].setValue(menuConsumptions.Id);
            this.MenuConsumptionForm.controls['CategoryId'].setValue(menuConsumptions.CategoryId);
            this.onChangeCategory(menuConsumptions.CategoryId);
            this.MenuConsumptionForm.controls['ProductId'].setValue(menuConsumptions.ProductId);
            this.onChangeProduct(menuConsumptions.ProductId);
            this.MenuConsumptionForm.controls['ProductPortionId'].setValue(menuConsumptions.ProductPortionId);

            this.MenuConsumptionForm.controls['MenuConsumptionDetails'] = this.fb.array([]);
            const control = <FormArray>this.MenuConsumptionForm.controls['MenuConsumptionDetails'];

            for (let i = 0; i < menuConsumptions.MenuConsumptionDetails.length; i++) {
                let valuesFromServer = menuConsumptions.MenuConsumptionDetails[i];
                let instance = this.fb.group(valuesFromServer);

                instance.controls['Id'].setValue(valuesFromServer.Id);
                instance.controls['MenuConsumptionId'].setValue(valuesFromServer.MenuConsumptionId);
                instance.controls['InventoryItemId'].setValue(valuesFromServer.InventoryItemId);
                instance.controls['Quantity'].setValue(valuesFromServer.Quantity);
                control.push(instance);
            }

            this.modalRef = this.modalService.show(template, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        },
            error => this.msg = <any>error);
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
        // console.log(formData.value);
        
        let categoryId;
        categoryId = formData.value.CategoryId.Id;

        let productId = formData.value.ProductId.Id;
        

        this.msg = "";
        this.formSubmitAttempt = true;
        let MenuConsumptionForm = this.MenuConsumptionForm;
        if (MenuConsumptionForm.valid) {
            
            switch (this.dbops) {
                case DBOperation.create:
                    let MenuItemAddObj = {
                        Id: this.MenuConsumptionForm.controls['Id'].value,
                        CategoryId: categoryId,
                        // ProductId: this.MenuConsumptionForm.controls['ProductId'].value,
                        ProductId: productId,
                        ProductPortionId: this.MenuConsumptionForm.controls['ProductPortionId'].value,
                        MenuConsumptionDetails: this.MenuConsumptionForm.controls['MenuConsumptionDetails'].value
                    }
                    this._menuConsumptionService.post(Global.BASE_MENUCONSUMPTION_ENDPOINT, MenuItemAddObj).subscribe(
                        data => {
                            
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.modalRef.hide();
                                this.reset();
                                this.LoadMenuConsumptions();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                alert("There is some issue in creating records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.update:
                    
                    let MenuItemObj = {
                        Id: this.MenuConsumptionForm.controls['Id'].value,
                        CategoryId: categoryId ,
                        // ProductId: this.MenuConsumptionForm.controls['ProductId'].value,
                        ProductId: productId,
                        ProductPortionId: this.MenuConsumptionForm.controls['ProductPortionId'].value,
                        MenuConsumptionDetails: this.MenuConsumptionForm.controls['MenuConsumptionDetails'].value
                    }

                    this._menuConsumptionService.put(Global.BASE_MENUCONSUMPTION_ENDPOINT, formData.value.Id, MenuItemObj).subscribe(

                        data => {
                            
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.reset();
                                this.formSubmitAttempt = false;
                                this.LoadMenuConsumptions();
                            }
                            else {
                                alert("There is some issue in updating records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.delete:
                    this._menuConsumptionService.delete(Global.BASE_MENUCONSUMPTION_ENDPOINT, formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");
                                this.modalRef.hide();
                                this.reset();
                                this.LoadMenuConsumptions();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                alert("There is some issue in deleting records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;

            }
        }
        else {
            this.validateAllFields(MenuConsumptionForm);
        }
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.MenuConsumptionForm.enable() : this.MenuConsumptionForm.disable();
    }
    reset() {
        this.MenuConsumptionForm.controls['Id'].reset();
        this.MenuConsumptionForm.controls['CategoryId'].reset();
        this.MenuConsumptionForm.controls['ProductId'].reset();
        this.MenuConsumptionForm.controls['ProductPortionId'].reset();
        this.MenuConsumptionForm.controls['MenuConsumptionDetails'] = this.fb.array([]);
        //this.addMenuConsumptionDetail();
    }
    cancel() {
        
        this.modalRef.hide();
        this.reset();
    }

    get MenuConsumptionDetails(): FormArray {
        return this.MenuConsumptionForm.get('MenuConsumptionDetails') as FormArray;
    }
}