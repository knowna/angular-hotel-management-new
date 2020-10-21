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
var PurchaseOrderComponent = /** @class */ (function () {
    function PurchaseOrderComponent(fb, _purchaseOrderService, _purchaseOrderDetailsService, date, modalService) {
        var _this = this;
        this.fb = fb;
        this._purchaseOrderService = _purchaseOrderService;
        this._purchaseOrderDetailsService = _purchaseOrderDetailsService;
        this.date = date;
        this.modalService = modalService;
        this.indLoading = false;
        this._purchaseOrderService.getAccounts()
            .subscribe(function (data) { _this.account = data; });
        this.fromDate = new Date(2018, 0, 1);
        this.toDate = new Date(2018, 11, 31);
    }
    PurchaseOrderComponent.prototype.ngOnInit = function () {
        this.purchaseOrderFrm = this.fb.group({
            Id: [''],
            Name: [''],
            AccountTransactionDocumentId: [''],
            Date: [''],
            Description: ['', forms_1.Validators.required],
            TotalAmount: [''],
            PurchaseOrderDetails: this.fb.array([
                this.initPurchaseOrder(),
            ]),
        });
        this.loadPurchaseOrderList();
    };
    PurchaseOrderComponent.prototype.loadPurchaseOrderList = function () {
        var _this = this;
        this.indLoading = true;
        this._purchaseOrderService.get(global_1.Global.BASE_PURCHASEORDER_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 9)
            .subscribe(function (purchaseorder) {
            
            _this.purchaseorder = purchaseorder;
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    PurchaseOrderComponent.prototype.addPurchaseOrder = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add";
        this.modalBtnTitle = "Save";
        this.purchaseOrderFrm.reset();
        this.purchaseOrderFrm.controls['Name'].setValue('PurchaseOrder');
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    PurchaseOrderComponent.prototype.editPurchaseOrder = function (Id) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit";
        this.modalBtnTitle = "Update";
        this.purchaseorders = this.purchaseorder.filter(function (x) { return x.Id == Id; })[0];
        this.purchaseOrderFrm.controls['Id'].setValue(this.purchaseorders.Id);
        this.formattedDate = this.purchaseorders.AccountTransactionValues[0]['Date'];
        this.purchaseOrderFrm.controls['Date'].setValue(this.formattedDate);
        this.purchaseOrderFrm.controls['Name'].setValue(this.purchaseorders.Name);
        this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].setValue(this.purchaseorders.AccountTransactionDocumentId);
        this.purchaseOrderFrm.controls['Description'].setValue(this.purchaseorders.Description);
        this.purchaseOrderFrm.controls['PurchaseOrderDetails'] = this.fb.array([]);
        var control = this.purchaseOrderFrm.controls['PurchaseOrderDetails'];
        for (var i = 0; i < this.purchaseorders.PurchaseOrderDetails.length; i++) {
            control.push(this.fb.group(this.purchaseorders.PurchaseOrderDetails[i]));
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    PurchaseOrderComponent.prototype.deletePurchaseOrder = function (Id) {
        
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.purchaseorders = this.purchaseorder.filter(function (x) { return x.Id == Id; })[0];
        this.purchaseOrderFrm.controls['Id'].setValue(this.purchaseorders.Id);
        this.formattedDate = this.purchaseorders.Date;
        this.purchaseOrderFrm.controls['Date'].setValue(this.formattedDate);
        this.purchaseOrderFrm.controls['Name'].setValue(this.purchaseorders.Name);
        this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].setValue(this.purchaseorders.AccountTransactionDocumentId);
        this.purchaseOrderFrm.controls['Description'].setValue(this.purchaseorders.Description);
        this.purchaseOrderFrm.controls['PurchaseOrderDetails'] = this.fb.array([]);
        var control = this.purchaseOrderFrm.controls['PurchaseOrderDetails'];
        for (var i = 0; i < this.purchaseorders.PurchaseOrderDetails.length; i++) {
            control.push(this.fb.group(this.purchaseorders.PurchaseOrderDetails[i]));
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    //initialize the array//
    PurchaseOrderComponent.prototype.initPurchaseOrder = function () {
        return this.fb.group({
            InventoryItemId: ['', forms_1.Validators.required],
            Quantity: [0, forms_1.Validators.required],
            PurchaseOrderRate: [0, forms_1.Validators.required],
            PurchaseOrderAmount: [0]
        });
    };
    //Push the values of PurchaseOrderDetails
    PurchaseOrderComponent.prototype.addPurchaseOrderitems = function () {
        var control = this.purchaseOrderFrm.controls['PurchaseOrderDetails'];
        var addPurchaseValues = this.initPurchaseOrder();
        control.push(addPurchaseValues);
    };
    //Remove rows generated//
    PurchaseOrderComponent.prototype.removePurchaseOrder = function (i, PurchaseOrderId) {
        
        var control = this.purchaseOrderFrm.controls['PurchaseOrderDetails'];
        if (i > 0) {
            this._purchaseOrderDetailsService.delete(global_1.Global.BASE_PURCHASEORDERDETAILS_ENDPOINT, PurchaseOrderId).subscribe(function (data) {
                if (data == 1)
                    control.removeAt(i);
            });
        }
        else {
            alert("Form requires at least one row");
        }
    };
    // calculate total Amount of all Columns
    PurchaseOrderComponent.prototype.calculateAmount = function () {
        var controls = this.purchaseOrderFrm.controls['PurchaseOrderDetails'].value;
        return controls.reduce(function (total, accounts) {
            return (accounts.PurchaseOrderAmount) ? (total + Math.round(accounts.PurchaseOrderAmount)) : total;
        }, 0);
    };
    PurchaseOrderComponent.prototype.validateAllFields = function (formGroup) {
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
    PurchaseOrderComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    PurchaseOrderComponent.prototype.onSubmit = function () {
        var _this = this;
        
        this.msg = "";
        this.formSubmitAttempt = true;
        var purchaseOrder = this.purchaseOrderFrm;
        if (purchaseOrder.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    
                    this._purchaseOrderService.post(global_1.Global.BASE_PURCHASEORDER_ENDPOINT, purchaseOrder.value).subscribe(function (data) {
                        
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadPurchaseOrderList();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.update:
                    var purchaseOrderObj = {
                        Id: this.purchaseOrderFrm.controls['Id'].value,
                        Date: this.purchaseOrderFrm.controls['Date'].value,
                        Name: this.purchaseOrderFrm.controls['Name'].value,
                        AccountTransactionDocumentId: this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.purchaseOrderFrm.controls['Description'].value,
                        PurchaseOrderDetails: this.purchaseOrderFrm.controls['PurchaseOrderDetails'].value
                    };
                    this._purchaseOrderService.put(global_1.Global.BASE_PURCHASEORDER_ENDPOINT, purchaseOrder.value.Id, purchaseOrderObj).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadPurchaseOrderList();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    var purchaseOrderObjc = {
                        Id: this.purchaseOrderFrm.controls['Id'].value,
                        Date: this.purchaseOrderFrm.controls['Date'].value,
                        Name: this.purchaseOrderFrm.controls['Name'].value,
                        AccountTransactionDocumentId: this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.purchaseOrderFrm.controls['Description'].value,
                        PurchaseOrderDetails: this.purchaseOrderFrm.controls['PurchaseOrderDetails'].value
                    };
                    this._purchaseOrderService.delete(global_1.Global.BASE_PURCHASEORDER_ENDPOINT, purchaseOrderObjc).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully deleted.");
                            _this.loadPurchaseOrderList();
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
            this.validateAllFields(purchaseOrder);
        }
    };
    PurchaseOrderComponent.prototype.confirm = function () {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    };
    PurchaseOrderComponent.prototype.reset = function () {
        var control = this.purchaseOrderFrm.controls["Id"].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].reset();
            this.purchaseOrderFrm.controls['Date'].reset();
            this.purchaseOrderFrm.controls['Description'].reset();
            this.purchaseOrderFrm.controls['PurchaseOrderDetails'].reset();
        }
    };
    PurchaseOrderComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.purchaseOrderFrm.enable() : this.purchaseOrderFrm.disable();
    };
    /**
     *  Get the list of filtered Purchases by the form and to date
     */
    PurchaseOrderComponent.prototype.filterPurchaseOrdersByDate = function () {
        var _this = this;
        this.indLoading = true;
        this._purchaseOrderService.get(global_1.Global.BASE_PURCHASEORDER_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 9)
            .subscribe(function (purchaseOrders) {
            _this.purchaseorders = purchaseOrders;
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    __decorate([
        core_1.ViewChild("template")
    ], PurchaseOrderComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], PurchaseOrderComponent.prototype, "TemplateRef2", void 0);
    PurchaseOrderComponent = __decorate([
        core_1.Component({
            templateUrl: './purchaseOrder.component.html',
            styleUrls: ['./purchaseOrder.component.css']
        })
    ], PurchaseOrderComponent);
    return PurchaseOrderComponent;
}());
exports.PurchaseOrderComponent = PurchaseOrderComponent;
