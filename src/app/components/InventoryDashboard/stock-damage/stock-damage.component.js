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
var enum_1 = require("../../../Shared/enum");
var global_1 = require("../../../Shared/global");
var StockDamageComponent = /** @class */ (function () {
    function StockDamageComponent(fb, _pcitemService, _pConsumeservice, modalService, _menuConsumptionService, date) {
        var _this = this;
        this.fb = fb;
        this._pcitemService = _pcitemService;
        this._pConsumeservice = _pConsumeservice;
        this.modalService = modalService;
        this._menuConsumptionService = _menuConsumptionService;
        this.date = date;
        this.indLoading = false;
        this.currentYear = {};
        this.currentUser = {};
        this.company = {};
        this._menuConsumptionService.getMenuConsumptionProductPortions().subscribe(function (data) { return _this.MenuItemPortions = data; });
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = new Date(this.currentYear['StartDate']);
        this.toDate = new Date(this.currentYear['EndDate']);
    }
    StockDamageComponent.prototype.ngOnInit = function () {
        this.pConsumeFrm = this.fb.group({
            Id: [''],
            Name: [''],
            StartDate: ['', forms_1.Validators.required],
            LastUpdateTime: [''],
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: [''],
            PeriodicConsumptionItems: this.fb.array([
                this.initPeriodicConsumDetails(),
            ]),
        });
        this.loadPeriodicConsumptions();
    };
    StockDamageComponent.prototype.initPeriodicConsumDetails = function () {
        return this.fb.group({
            InventoryItemId: ['', forms_1.Validators.required],
            InStock: [''],
            Consumption: ['', forms_1.Validators.required],
            PhysicalInventory: ['', forms_1.Validators.required],
            PeriodicConsumptionId: [''],
            Cost: [''],
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: [''],
        });
    };
    StockDamageComponent.prototype.loadPeriodicConsumptions = function () {
        var _this = this;
        this.indLoading = true;
        this._pConsumeservice.get(global_1.Global.BASE_PERIODICCONSUMPTION_ENDPOINT)
            .subscribe(function (pConsumes) { _this.pConsumes = pConsumes; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    StockDamageComponent.prototype.getIRItem = function (Id) {
        if (this.MenuItemPortions) {
            return this.MenuItemPortions.filter(function (IRItem) {
                return IRItem.MenuItemPortionId === Id;
            })[0];
        }
    };
    StockDamageComponent.prototype.getPeriodicConsumption = function (Id) {
        debugger;
        this.indLoading = true;
        return this._pConsumeservice.get(global_1.Global.BASE_PERIODICCONSUMPTION_ENDPOINT + '?Id=' + Id);
    };
    StockDamageComponent.prototype.exportTableToExcel = function (tableID, filename) {
        if (filename === void 0) { filename = ''; }
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var clonedtable = $('#' + tableID);
        var clonedHtml = clonedtable.clone();
        $(clonedtable).find('.export-no-display').remove();
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        $('#' + tableID).html(clonedHtml.html());
        // Specify file name
        filename = filename ? filename + '.xls' : 'Inventory Receipts of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';
        // Create download link element
        downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        }
        else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
            // Setting the file name
            downloadLink.download = filename;
            //triggering the function
            downloadLink.click();
        }
    };
    StockDamageComponent.prototype.addPeriodicConsumed = function () {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Stock Damage";
        this.modalBtnTitle = "Save & Submit";
        this.pConsumeFrm.reset();
        this.pConsumeFrm.controls['Name'].setValue('Stock Damage');
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    };
    StockDamageComponent.prototype.editPeriodicConsumed = function (Id) {
        var _this = this;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Stock Damage";
        this.modalBtnTitle = "Update";
        debugger;
        this.getPeriodicConsumption(Id).subscribe(function (periodicConsumption) {
            debugger;
            _this.indLoading = false;
            _this.pConsumeFrm.controls['Id'].setValue(periodicConsumption.Id);
            _this.pConsumeFrm.controls['Name'].setValue(periodicConsumption.Name);
            _this.pConsumeFrm.controls['StartDate'].setValue(new Date(periodicConsumption.StartDate));
            _this.pConsumeFrm.controls['PeriodicConsumptionItems'] = _this.fb.array([]);
            var control = _this.pConsumeFrm.controls['PeriodicConsumptionItems'];
            for (var i = 0; i < periodicConsumption.PeriodicConsumptionItems.length; i++) {
                control.push(_this.fb.group(periodicConsumption.PeriodicConsumptionItems[i]));
            }
            _this.modalRef = _this.modalService.show(_this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        }, function (error) { return _this.msg = error; });
    };
    StockDamageComponent.prototype.deletePeriodicConsumed = function (Id) {
        var _this = this;
        debugger;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Stock Damage?";
        this.modalBtnTitle = "Delete";
        this.getPeriodicConsumption(Id).subscribe(function (periodicConsumption) {
            debugger;
            _this.indLoading = false;
            _this.pConsumeFrm.controls['Id'].setValue(periodicConsumption.Id);
            _this.pConsumeFrm.controls['Name'].setValue(periodicConsumption.Name);
            _this.pConsumeFrm.controls['StartDate'].setValue(new Date(periodicConsumption.StartDate));
            _this.pConsumeFrm.controls['PeriodicConsumptionItems'] = _this.fb.array([]);
            var control = _this.pConsumeFrm.controls['PeriodicConsumptionItems'];
            for (var i = 0; i < periodicConsumption.PeriodicConsumptionItems.length; i++) {
                control.push(_this.fb.group(periodicConsumption.PeriodicConsumptionItems[i]));
            }
            _this.modalRef = _this.modalService.show(_this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-lg'
            });
        }, function (error) { return _this.msg = error; });
    };
    // Push the values of PeriodicConsumptionItems 
    StockDamageComponent.prototype.addPeriodicitems = function () {
        var control = this.pConsumeFrm.controls['PeriodicConsumptionItems'];
        var addpcItems = this.initPeriodicConsumDetails();
        control.push(addpcItems);
    };
    //remove the rows//
    StockDamageComponent.prototype.removeInventory = function (i) {
        var controls = this.pConsumeFrm.controls['PeriodicConsumptionItems'];
        var controlToRemove = this.pConsumeFrm.controls.PeriodicConsumptionItems['controls'][i].controls;
        var selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;
        if (selectedControl) {
            this._pcitemService.delete(global_1.Global.BASE_PERIODICCONSUMPTIONITEM_ENDPOINT, i).subscribe(function (data) {
                (data == 1) && controls.removeAt(i);
            });
        }
        else {
            if (i >= 0) {
                controls.removeAt(i);
            }
            else {
                alert("Form requires at least one row");
            }
        }
    };
    StockDamageComponent.prototype.validateAllFields = function (formGroup) {
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
    //displays the confirm popup-window
    StockDamageComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    //Submit the Form
    StockDamageComponent.prototype.onSubmit = function () {
        var _this = this;
        debugger;
        this.msg = "";
        this.formSubmitAttempt = true;
        var pConsumer = this.pConsumeFrm;
        var pConsumptionDate = new Date(pConsumer.get('StartDate').value);
        pConsumer.get('StartDate').setValue(pConsumptionDate);
        if (!this.voucherDateValidator(pConsumer.get('StartDate'))) {
            return false;
        }
        pConsumer.get('FinancialYear').setValue(this.currentYear['Name'] || '');
        pConsumer.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
        pConsumer.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');
        if (pConsumer.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._pConsumeservice.post(global_1.Global.BASE_PERIODICCONSUMPTION_ENDPOINT, pConsumer.value).subscribe(function (data) {
                        debugger;
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadPeriodicConsumptions();
                        }
                        else {
                            // this.modal.backdrop;
                            _this.msg = "There is some issue in creating records, please contact to system administrator!";
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.update:
                    var pConsumeObj = {
                        Id: this.pConsumeFrm.controls['Id'].value,
                        Name: this.pConsumeFrm.controls['Name'].value,
                        StartDate: this.pConsumeFrm.controls['StartDate'].value,
                        PeriodicConsumptionItems: this.pConsumeFrm.controls['PeriodicConsumptionItems'].value
                    };
                    this._pConsumeservice.put(global_1.Global.BASE_PERIODICCONSUMPTION_ENDPOINT, pConsumer.value.Id, pConsumeObj).subscribe(function (data) {
                        if (data == 1) {
                            _this.openModal2(_this.TemplateRef2);
                            _this.loadPeriodicConsumptions();
                        }
                        else {
                            alert("There is some issue in updating records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    this._pConsumeservice.delete(global_1.Global.BASE_PERIODICCONSUMPTION_ENDPOINT, pConsumer.value.Id).subscribe(function (data) {
                        debugger;
                        if (data == 1) {
                            alert("Data deleted sucessfully");
                            _this.loadPeriodicConsumptions();
                        }
                        else {
                            alert("There is some issue in deleting records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                        _this.formSubmitAttempt = false;
                    });
            }
        }
        else {
            this.validateAllFields(pConsumer);
        }
    };
    StockDamageComponent.prototype.confirm = function () {
        this.modalRef2.hide();
    };
    StockDamageComponent.prototype.reset = function () {
        var control = this.pConsumeFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.pConsumeFrm.reset();
        }
    };
    StockDamageComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.pConsumeFrm.enable() : this.pConsumeFrm.disable();
    };
    StockDamageComponent.prototype.voucherDateValidator = function (control) {
        var today = new Date;
        if (!control.value) {
            alert("Please select the Inventory Date");
            return false;
        }
        var pConsumptionDate = new Date(control.value);
        var currentYearStartDate = new Date(this.currentYear.StartDate);
        var currentYearEndDate = new Date(this.currentYear.EndDate);
        if ((pConsumptionDate < currentYearStartDate) || (pConsumptionDate > currentYearEndDate) || (pConsumptionDate > today)) {
            alert("Date should be within current financial year's start date and end date inclusive, Error Occured!");
            return false;
        }
        return true;
    };
    /**
   *  Get the list of filtered journals by the form and to date
   */
    StockDamageComponent.prototype.filterJournalByDate = function () {
        var _this = this;
        this.indLoading = true;
        this._pConsumeservice.get(global_1.Global.BASE_PERIODICCONSUMPTION_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'dd-MM-yyyy') + '&toDate=' + this.date.transform(this.toDate, 'dd-MM-yyyy') + '&TransactionTypeId=' + 5)
            .subscribe(function (pConsumes) {
            _this.indLoading = false;
            return _this.pConsumes = pConsumes;
        }, function (error) { return _this.msg = error; });
    };
    StockDamageComponent.prototype.onFilterDateSelect = function (selectedDate) {
        var currentYearStartDate = new Date(this.currentYear.StartDate);
        var currentYearEndDate = new Date(this.currentYear.EndDate);
        if (selectedDate < currentYearStartDate) {
            this.fromDate = currentYearStartDate;
            alert("Date should not be less than current financial year's start date");
        }
        if (selectedDate > currentYearEndDate) {
            this.toDate = currentYearEndDate;
            alert("Date should not be greater than current financial year's end date");
        }
    };
    __decorate([
        core_1.ViewChild('template')
    ], StockDamageComponent.prototype, "TemplateRef", void 0);
    __decorate([
        core_1.ViewChild('templateNested')
    ], StockDamageComponent.prototype, "TemplateRef2", void 0);
    StockDamageComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'stock-damage.component.html'
        })
    ], StockDamageComponent);
    return StockDamageComponent;
}());
exports.StockDamageComponent = StockDamageComponent;
