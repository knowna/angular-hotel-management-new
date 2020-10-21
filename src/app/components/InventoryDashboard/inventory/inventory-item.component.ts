import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ICategory, IInventoryItem } from '../../../Model/Inventory/inventoryItem';
import { UnitType } from '../../../Model/Inventory/UnitType';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';

@Component({
    templateUrl: './inventory-item.component.html'
})

export class InventoryItemComponent implements OnInit {
    @ViewChild("template",{static:false}) TemplateRef: TemplateRef<any>;
    modalRef: BsModalRef;
    InventoryItems: IInventoryItem[];
    InventoryItem: IInventoryItem;
    UnitTypes: UnitType[];
    categories: ICategory[];
    category: ICategory;
    msg: string;
    indLoading: boolean = false;
    private formSubmitAttempt: boolean;
    InventFrm: FormGroup;
    InventoryForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    receiptProducts: any[] = [];
    _itemName: string;
    filteredInventoryItems:IInventoryItem[];

    constructor(private router: Router, private fb: FormBuilder, private _inventoryService: AccountTransactionTypeService, private modalService: BsModalService) {
        this._inventoryService.getCategories().subscribe(data => { this.categories = data,console.log(this.categories) });
        this._inventoryService.getMenuUnits(Global.BASE_UNITTYPE_ENDPOINT).subscribe(data => { this.UnitTypes = data });
    }
//SearchBox
get ItemName() :string {
    return this._itemName;
}
set IterName(searchData:string){
    this._itemName=searchData;
    this.filteredInventoryItems=this.filterInventoryItems(searchData);
}
filterInventoryItems(searchData:string){
    return this.InventoryItems.filter(category=>
        category.Name.toLocaleLowerCase().indexOf(searchData.toLocaleLowerCase() )!==-1) ;
        
}


    ngOnInit(): void {
        this.InventFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            BaseUnit: ['', Validators.required],
            TransactionUnit: ['', Validators.required],
            TransactionUnitMultiplier: ['', Validators.required],
            OpeningStock: ['', Validators.required],
            OpeningStockAmount: [''],
            OpeningStockRate: ['', Validators.required],
            StockLimit: ['', Validators.required],
            Category: ['', Validators.required]
        });
        this.LoadInventoryItems();

        
    }

    LoadInventoryItems(): void {
        this.indLoading = true;
        this._inventoryService.get(Global.BASE_INVENTORY_ENDPOINT)
            .subscribe(InventoryItems => { this.InventoryItems = InventoryItems;
                this.filteredInventoryItems=this.InventoryItems;

                this.indLoading = false; },
            error => this.msg = <any>error);
    }



    addInventory() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Item";
        this.modalBtnTitle = "Save & Submit";
        this.InventFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'

        });
    }
    editInventory(Id: number) {
         
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Item";
        this.modalBtnTitle = "Update";
        this.InventoryItem = this.InventoryItems.filter(x => x.Id == Id)[0];
        this.InventFrm.setValue(this.InventoryItem);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'

        });
    }

    deleteInventory(id: number) {
          
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.InventoryItem = this.InventoryItems.filter(x => x.Id == id)[0];
        this.InventFrm.setValue(this.InventoryItem);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'

        });
    }

    onSubmit(formData: any) {
          
        this.msg = "";
        this.formSubmitAttempt = true;
        let inventfrm = this.InventFrm;
        if (inventfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._inventoryService.post(Global.BASE_INVENTORY_ENDPOINT,  formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.reset();
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadInventoryItems();
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
                      
                    this._inventoryService.put(Global.BASE_INVENTORY_ENDPOINT,  formData.value.Id,  formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.reset();
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadInventoryItems();
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
                      
                    this._inventoryService.delete(Global.BASE_INVENTORY_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");
                                this.reset();
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadInventoryItems();
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
            }
        }
        else {
            this.validateAllFields(inventfrm);
        }
    }


    reset() {
        this.InventFrm.reset();
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

    SetControlsState(isEnable: boolean) {
        isEnable ? this.InventFrm.enable() : this.InventFrm.disable();
    }

    calculateGndAmount() {
        const OpeningStock = (<FormControl>this.InventFrm.controls['OpeningStock']);
        const OpeningStockRate = (<FormControl>this.InventFrm.controls['OpeningStockRate']);
        let calcGrandTot = 0;
        calcGrandTot = OpeningStock.value * OpeningStockRate.value;
        return calcGrandTot.toFixed(2);
    }
    CloseForm() {
          
        this.reset();
        this.modalRef.hide();
        
    }
}
