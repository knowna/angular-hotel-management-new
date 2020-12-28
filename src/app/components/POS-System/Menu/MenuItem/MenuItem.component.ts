﻿
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { IMenuItem, IMenuItemPortion } from '../../../../Model/Menu/MenuItem';
import { IMenuCategory } from '../../../../Model/Menu/MenuCategory';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../../Shared/global';
import { Router } from '@angular/router';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    templateUrl: './MenuItem.component.html'
})

export class MenuItemComponent implements OnInit {
    @ViewChild("template",{static:false}) TemplateRef: TemplateRef<any>;
    menuItems: IMenuItem[];
    menuItem: IMenuItem;
    MenuItemPortion: IMenuItemPortion;
    menuitemportions: IMenuItemPortion[];
    menucategories: IMenuCategory[];
    // menucategory: IMenuCategory;
     menucategory;
    msg: string;
    indLoading: boolean = false;
    formSubmitAttempt: boolean;
    MenuItemForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    menuitemPortions: IMenuItemPortion[];
    MenuItemName: string = '';
    departments:any;
    selectedFile: File;

    dropMessage: string = "Upload Reference Image";
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    fileUrl: string = '';
    file: any[] = [];

    config = {
        search:true,
        displayKey:"Name",
        searchOnKey: 'Name',
        height: '300px'
    }
    
    constructor(private router: Router,
        private fb: FormBuilder,
        private _menuItemService: BillingService,
        private _menuportionservice: BillingService,
        private modalService: BsModalService,
        private toastrService: ToastrService)
    {
        this._menuItemService.getCategories()
            .subscribe(
                data => { 
                    this.menucategory = data 
                },
                error=>console.log(error)
            );
    }

    ngOnInit(): void {
        this.MenuItemForm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            categoryId: ['', Validators.required],
            Barcode: ['', Validators.required],
            Tag: ['', Validators.required],
            Description:[''],
            DepartmentId:[''],
            PhoteIdentity:[''],
            MenuItemPortions: this.fb.array([this.initMenuItemPortions()]),
        });
        this.LoadMenuItems();
        this.LoadDepartments();
    }

    initMenuItemPortions() {
        return this.fb.group({
            Id:['0'],
            Name: ['', Validators.required],
            MenuItemPortionId: ['0'],
            Multiplier: ['', Validators.required],
            Price: ['', Validators.required],
            OpeningStock:['0']
        });
    }
    selectionChanged($event,i){}

    LoadDepartments(){
        this._menuItemService.getDepartments()
            .subscribe(
                data =>{
                    
                    this.departments=data;
                    
                }
            )
    }


    LoadMenuItems(): void {
        this.indLoading = true;
        
        this._menuItemService.get(Global.BASE_MENUITEM_ENDPOINT)
            .subscribe(menuItems => {
                console.log('menu items of image are',menuItems);
                
                this.menuItems = menuItems; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    addMenuItemPortions() {
        
        const control = <FormArray>this.MenuItemForm.controls['MenuItemPortions'];
        const AddPortions = this.initMenuItemPortions();
        control.push(AddPortions);
    }




    //Gets called when the user selects an image

  public onFileChanged(event) {

    //Select File

    this.selectedFile = event.target.files[0];

  }

    removeMenuItemPortions(i: number) {
        
        if (window.confirm('Are sure you want to delete this position item ?')) {
            let controls = <FormArray>this.MenuItemForm.controls['MenuItemPortions'];
            let controlToRemove = this.MenuItemForm.controls.MenuItemPortions['controls'][i].controls;
            let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

            let currentportion = controlToRemove.Id.value;

            if (currentportion != "0") {
                this._menuportionservice.delete(Global.BASE_MENUITEMPORTION_ENDPOINT, currentportion).subscribe(data => {
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

    addMenuItems() {
        
        this.modalTitle = "Add Item";
        this.modalBtnTitle = "Save";
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg',
        });
    }

    editMenuItems(Id: number, template: TemplateRef<any>) {
        
      
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Item";
        this.modalBtnTitle = "Save";
        this.menuItem = this.menuItems.filter(x => x.Id == Id)[0];
        
        let category= this.menucategory.find(cat=> cat.Id == this.menuItem.categoryId);

        this.MenuItemForm.controls['Id'].setValue(this.menuItem.Id);
        this.MenuItemForm.controls['categoryId'].setValue(category);
        this.MenuItemForm.controls['Name'].setValue(this.menuItem.Name);
        this.MenuItemForm.controls['Barcode'].setValue(this.menuItem.Barcode);
        this.MenuItemForm.controls['Tag'].setValue(this.menuItem.Tag);
        this.MenuItemForm.controls['PhoteIdentity'].setValue(this.menuItem.PhoteIdentity);
        this.MenuItemForm.controls['Description'].setValue(this.menuItem.Description);
        this.MenuItemForm.controls['DepartmentId'].setValue(this.menuItem.DepartmentId);
        this.MenuItemForm.controls['MenuItemPortions'] = this.fb.array([]);
        let control = <FormArray>this.MenuItemForm.controls['MenuItemPortions'];
        console.log(this.MenuItemForm.value);
        
        for (let i = 0; i < this.menuItem.MenuItemPortions.length; i++)
        {
            control.push(this.fb.group(this.menuItem.MenuItemPortions[i]));
        }
        
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg',
        });
    }

    deleteMenuItems(id: number, template: TemplateRef<any>) {
        
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.menuItem = this.menuItems.filter(x => x.Id == id)[0];
        this.MenuItemForm.controls['Id'].setValue(this.menuItem.Id);
        this.MenuItemForm.controls['categoryId'].setValue(this.menuItem.categoryId);
        this.MenuItemForm.controls['Name'].setValue(this.menuItem.Name);
        this.MenuItemForm.controls['Barcode'].setValue(this.menuItem.Barcode);
        this.MenuItemForm.controls['Tag'].setValue(this.menuItem.Tag);
        this.MenuItemForm.controls['PhoteIdentity'].setValue(this.menuItem.PhoteIdentity);

        this.MenuItemForm.controls['MenuItemPortions'] = this.fb.array([]);
        let control = <FormArray>this.MenuItemForm.controls['MenuItemPortions'];

        for (let i = 0; i < this.menuItem.MenuItemPortions.length; i++) {
            control.push(this.fb.group(this.menuItem.MenuItemPortions[i]));
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg',
        });
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

    onSubmit(formData: any,fileUpload: any) {
        let categoryId;
        categoryId = formData.value.categoryId.Id;
        
        this.msg = "";
        this.formSubmitAttempt = true;
        let menuitemform = this.MenuItemForm;
        console.log('the form', menuitemform)
        console.log('the file is', fileUpload)

        // let image =  fileUpload.fileToUpload ? fileUpload.fileToUpload : formData.value.PhoteIdentity;

        // if(image == null) {
        //     this.toastrService.info('Please upload a image !');
        // }

        if (menuitemform.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    let AddMenuItemObj = {
                        Id: this.MenuItemForm.controls['Id'].value,
                        Name: this.MenuItemForm.controls['Name'].value,
                        categoryId: categoryId,
                        Barcode: this.MenuItemForm.controls['Barcode'].value,
                        Tag: this.MenuItemForm.controls['Tag'].value,
                        DepartmentId:this.MenuItemForm.controls['DepartmentId'].value,
                        Description: this.MenuItemForm.controls['Description'].value,
                        // PhoteIdentity:this.selectedFile,

                        MenuItemPortions:this.MenuItemForm.controls['MenuItemPortions'].value
                    }
                    console.log(AddMenuItemObj);
                    
                    
                    this._menuItemService.post(Global.BASE_MENUITEM_ENDPOINT, AddMenuItemObj).subscribe(
                        async (data) => {
                            if (data > 0) {
                                // file upload stuff goes here
                                let upload = await fileUpload.handleFileUpload({
                                    'moduleName': 'MenuItem',
                                    'id': data
                                });

                                console.log('the upload is', upload);

                                if (upload == 'error' ) {
                                    alert('There is error uploading file!');
                                } 
                                
                                if (upload == true || upload == false) {
                                    this.modalRef.hide();
                                    this.formSubmitAttempt = false;
                                    this.reset();
                                }
                                
                                alert("Data successfully added.");
                                this.modalRef.hide();
                                // this.reset();
                                // this.formSubmitAttempt = false;
                                this.LoadMenuItems();
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
                        Id: this.MenuItemForm.controls['Id'].value,
                        Name: this.MenuItemForm.controls['Name'].value,
                        categoryId: categoryId,
                        Barcode: this.MenuItemForm.controls['Barcode'].value,
                        Tag: this.MenuItemForm.controls['Tag'].value,
                        DepartmentId:this.MenuItemForm.controls['DepartmentId'].value,
                        Description: this.MenuItemForm.controls['Description'].value,
                        MenuItemPortions: this.MenuItemForm.controls['MenuItemPortions'].value,
                        PhoteIdentity: this.MenuItemForm.controls['PhoteIdentity'].value
                    }


                    console.log('MenuItemObj', MenuItemObj);
                    this._menuItemService.put(Global.BASE_MENUITEM_ENDPOINT, formData.value.Id, MenuItemObj).subscribe(
                        
                        async (data) => {
                            
                            if (data > 0) //Success
                            {
                                let upload = await fileUpload.handleFileUpload({
                                    'moduleName': 'MenuItem',
                                    'id': data
                                });

                                console.log('the upload is', upload);

                                if (upload == 'error' ) {
                                    alert('There is error uploading file!');
                                } 
                                
                                if (upload == true || upload == false) {
                                    this.modalRef.hide();
                                    this.formSubmitAttempt = false;
                                    this.reset();
                                }

                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                // this.reset();
                                // this.formSubmitAttempt = false;
                                this.LoadMenuItems();
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
                    this._menuItemService.delete(Global.BASE_MENUITEM_ENDPOINT, formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");
                                this.modalRef.hide();
                                this.reset();
                                this.formSubmitAttempt = false;
                                this.LoadMenuItems();
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
            this.validateAllFields(menuitemform);
        }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.MenuItemForm.enable() : this.MenuItemForm.disable();
    }

    cancel() {
        
        this.modalRef.hide();
        this.reset();
    }
    reset() {
        this.MenuItemForm.controls['Id'].reset();
        this.MenuItemForm.controls['Name'].reset();
        this.MenuItemForm.controls['categoryId'].reset();
        this.MenuItemForm.controls['Barcode'].reset();
        this.MenuItemForm.controls['Tag'].reset();
        this.MenuItemForm.controls['MenuItemPortions'] = this.fb.array([]);
    }
}