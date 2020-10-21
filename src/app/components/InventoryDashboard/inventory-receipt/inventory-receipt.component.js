"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var enum_1 = require("../../Shared/enum");
var global_1 = require("../../Shared/global");
var InventoryReceiptComponent = /** @class */ (function () {
    function InventoryReceiptComponent(fb, _inventoryReceiptService, _inventReceiptDetailsService, date, modalService) {
        var _this = this;
        this.fb = fb;
        this._inventoryReceiptService = _inventoryReceiptService;
        this._inventReceiptDetailsService = _inventReceiptDetailsService;
        this.date = date;
        this.modalService = modalService;
        this.indLoading = false;
        this._inventoryReceiptService.getAccounts().subscribe(function (data) { _this.account = data; });
    }
    InventoryReceiptComponent.prototype.ngOnInit = function () {
        this.InventReceiptFrm = this.fb.group({
            Id: [''],
            Date: ['', forms_1.Validators.required],
            AccountTypeId: ['', forms_1.Validators.required],
            ReceiptNumber: ['', forms_1.Validators.required],
            InventoryReceiptDetails: this.fb.array([
                this.initInventoryDetails(),
            ]),
        });
        this.loadInventoryReceipt();
    };
    InventoryReceiptComponent.prototype.initInventoryDetails = function () {
        return this.fb.group({
            Id: [''],
            Quantity: ['', forms_1.Validators.required],
            Rate: ['', forms_1.Validators.required],
            InventoryItemId: ['', forms_1.Validators.required],
            TotalAmount: [''],
        });
    };
    InventoryReceiptComponent.prototype.loadInventoryReceipt = function () {
        var _this = this;
         
        this.indLoading = true;
        this._inventoryReceiptService.get(global_1.Global.BASE_INVENTORYRECEIPT_ENDPOINT)
            .subscribe(function (inventoryReceipt) { _this.inventoryReceipt = inventoryReceipt; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    InventoryReceiptComponent.prototype.addDetails = function () {
        // add address to the list
        var control = this.InventReceiptFrm.controls['InventoryReceiptDetails'];
        var addInventDetails = this.initInventoryDetails();
        control.push(addInventDetails);
    };
    // remove address from the list
    InventoryReceiptComponent.prototype.removeInventory = function (i, Id) {
         
        var control = this.InventReceiptFrm.controls['InventoryReceiptDetails'];
        if (i > 0) {
            this._inventReceiptDetailsService.delete(global_1.Global.BASE_INVENTORYRECEIPTDETAIL_ENDPOINT, Id).subscribe(function (data) {
                if (data == 1) {
                    control.removeAt(i);
                }
            });
        }
        else {
            alert("Form requires at least one row");
        }
    };
    InventoryReceiptComponent.prototype.addInventoryReceipt = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Item";
        this.modalBtnTitle = "Add";
        this.InventReceiptFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    };
    InventoryReceiptComponent.prototype.editInventoryReceipt = function (Id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Items";
        this.modalBtnTitle = "Update";
        this.inventoryReceipts = this.inventoryReceipt.filter(function (x) { return x.Id == Id; })[0];
        this.InventReceiptFrm.controls['Id'].setValue(this.inventoryReceipts.Id);
        this.formattedDate = this.date.transform(this.inventoryReceipts.Date, 'dd-MM-yyyy');
        this.InventReceiptFrm.controls['Date'].setValue(this.formattedDate);
        this.InventReceiptFrm.controls['AccountTypeId'].setValue(this.inventoryReceipts.AccountTypeId);
        this.InventReceiptFrm.controls['ReceiptNumber'].setValue(this.inventoryReceipts.ReceiptNumber);
        this.InventReceiptFrm.controls['InventoryReceiptDetails'] = this.fb.array([]);
        var control = this.InventReceiptFrm.controls['InventoryReceiptDetails'];
        for (var i = 0; i < this.inventoryReceipts.InventoryReceiptDetails.length; i++) {
            control.push(this.fb.group(this.inventoryReceipts.InventoryReceiptDetails[i]));
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    };
    InventoryReceiptComponent.prototype.deleteInventory = function (Id) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Items";
        this.modalBtnTitle = "Delete";
        this.inventoryReceipts = this.inventoryReceipt.filter(function (x) { return x.Id == Id; })[0];
        this.InventReceiptFrm.controls['Id'].setValue(this.inventoryReceipts.Id);
        this.formattedDate = this.date.transform(this.inventoryReceipts.Date, 'dd/MM/yyyy');
        this.InventReceiptFrm.controls['Date'].setValue(this.formattedDate);
        this.InventReceiptFrm.controls['AccountTypeId'].setValue(this.inventoryReceipts.AccountTypeId);
        this.InventReceiptFrm.controls['ReceiptNumber'].setValue(this.inventoryReceipts.ReceiptNumber);
        this.InventReceiptFrm.controls['InventoryReceiptDetails'] = this.fb.array([]);
        var control = this.InventReceiptFrm.controls['InventoryReceiptDetails'];
        for (var i = 0; i < this.inventoryReceipts.InventoryReceiptDetails.length; i++) {
            control.push(this.fb.group(this.inventoryReceipts.InventoryReceiptDetails[i]));
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    };
    InventoryReceiptComponent.prototype.validateAllFields = function (formGroup) {
        var _this = this;
        Object.keys(formGroup.controls).forEach(function (field) {
            var control = formGroup.get(field);
            if (control instanceof forms_1.FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof forms_1.FormGroup) {
                _this.validateAllFields(control);
            }
        });
    };
    InventoryReceiptComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    //Form Submit
    InventoryReceiptComponent.prototype.onSubmit = function (form) {
        var _this = this;
         
        this.msg = "";
        this.formSubmitAttempt = true;
        var inventRec = this.InventReceiptFrm;
        if (inventRec.valid) {
             
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                     
                    this._inventoryReceiptService.post(global_1.Global.BASE_INVENTORYRECEIPT_ENDPOINT, inventRec.value).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadInventoryReceipt();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.update:
                     
                    var inventReceiptObj = {
                        Id: this.InventReceiptFrm.controls['Id'].value,
                        AccountTypeId: this.InventReceiptFrm.controls['AccountTypeId'].value,
                        ReceiptNumber: this.InventReceiptFrm.controls['ReceiptNumber'].value,
                        Date: this.InventReceiptFrm.controls['Date'].value,
                        InventoryReceiptDetails: this.InventReceiptFrm.controls['InventoryReceiptDetails'].value
                    };
                     
                    this._inventoryReceiptService.put(global_1.Global.BASE_INVENTORYRECEIPT_ENDPOINT, inventRec.value.Id, inventReceiptObj).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadInventoryReceipt();
                        }
                        else {
                            _this.msg = "There is some issue in saving records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    var inventReceiptObjc = {
                        Id: this.InventReceiptFrm.controls['Id'].value,
                        AccountTypeId: this.InventReceiptFrm.controls['AccountTypeId'].value,
                        ReceiptNumber: this.InventReceiptFrm.controls['ReceiptNumber'].value,
                        Date: this.InventReceiptFrm.controls['Date'].value,
                        InventoryReceiptDetails: this.InventReceiptFrm.controls['InventoryReceiptDetails'].value
                    };
                    this._inventoryReceiptService.delete(global_1.Global.BASE_INVENTORYRECEIPT_ENDPOINT, inventReceiptObjc).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully deleted.");
                            _this.loadInventoryReceipt();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
            }
        }
        else {
            this.validateAllFields(inventRec);
        }
    };
    InventoryReceiptComponent.prototype.confirm = function () {
        this.modalRef2.hide();
    };
    InventoryReceiptComponent.prototype.reset = function () {
        var control = this.InventReceiptFrm.controls["Id"].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.InventReceiptFrm.controls['ReceiptNumber'].reset();
            this.InventReceiptFrm.controls['Date'].reset();
            this.InventReceiptFrm.controls['SourceAccountTypeId'].reset();
            this.InventReceiptFrm.controls['InventoryReceiptDetails'].reset();
        }
    };
    InventoryReceiptComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.InventReceiptFrm.enable() : this.InventReceiptFrm.disable();
    };
    __decorate([
        core_1.ViewChild('template')
    ], InventoryReceiptComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], InventoryReceiptComponent.prototype, "TemplateRef2", void 0);
    InventoryReceiptComponent = __decorate([
        core_1.Component({
            selector: 'my-receipt-list',
            templateUrl: './inventory-receipt.component.html',
        })
    ], InventoryReceiptComponent);
    return InventoryReceiptComponent;
}());
exports.InventoryReceiptComponent = InventoryReceiptComponent;
