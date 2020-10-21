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
var UnitTypeComponent = /** @class */ (function () {
    function UnitTypeComponent(fb, acctransTypeService, date, modalService) {
        var _this = this;
        this.fb = fb;
        this.acctransTypeService = acctransTypeService;
        this.date = date;
        this.modalService = modalService;
        this.indLoading = false;
        this.acctransTypeService.getAccountTypes().subscribe(function (data) { _this.unittype = data; });
    }
    UnitTypeComponent.prototype.ngOnInit = function () {
        this.unitTypeFrm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required]
        });
        this.LoadUnitTypes();
    };
    UnitTypeComponent.prototype.LoadUnitTypes = function () {
        var _this = this;
        this.indLoading = true;
        this.acctransTypeService.get(global_1.Global.BASE_UNITTYPE_ENDPOINT)
            .subscribe(function (unittypess) { _this.unitTypes = unittypess; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    UnitTypeComponent.prototype.exportTableToExcel = function (tableID, filename) {
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
        filename = filename ? filename + '.xls' : 'Unit Type of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';
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
    UnitTypeComponent.prototype.addUnitType = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Unit Type";
        this.modalBtnTitle = "Save";
        this.unitTypeFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    UnitTypeComponent.prototype.editUnitType = function (Id, template) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Unit Type";
        this.modalBtnTitle = "Save";
        this.unitType = this.unitTypes.filter(function (x) { return x.Id == Id; })[0];
        this.unitTypeFrm.setValue(this.unitType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    UnitTypeComponent.prototype.deleteUnitType = function (id, template) {
         
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Unit Type?";
        this.modalBtnTitle = "Delete";
        this.unitType = this.unitTypes.filter(function (x) { return x.Id == id; })[0];
        this.unitTypeFrm.setValue(this.unitType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    UnitTypeComponent.prototype.validateAllFields = function (formGroup) {
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
    UnitTypeComponent.prototype.openModal2 = function (template) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    };
    //Submit the Form
    UnitTypeComponent.prototype.onSubmit = function () {
        var _this = this;
         
        this.msg = "";
        var unitType = this.unitTypeFrm;
        this.formSubmitAttempt = true;
        if (unitType.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this.acctransTypeService.post(global_1.Global.BASE_UNITTYPE_ENDPOINT, unitType.value).subscribe(function (data) {
                        if (data == 1) {
                             
                            _this.LoadUnitTypes();
                            _this.formSubmitAttempt = false;
                            _this.modalRef.hide();
                        }
                        else {
                            // this.modal.backdrop;
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    });
                    break;
                case enum_1.DBOperation.update:
                    this.acctransTypeService.put(global_1.Global.BASE_UNITTYPE_ENDPOINT, unitType.value.Id, unitType.value).subscribe(function (data) {
                        if (data == 1) {
                             
                            _this.LoadUnitTypes();
                            _this.formSubmitAttempt = false;
                            _this.modalRef.hide();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    });
                    break;
                case enum_1.DBOperation.delete:
                     
                    this.acctransTypeService.delete(global_1.Global.BASE_UNITTYPE_ENDPOINT, unitType.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data deleted sucessfully");
                            _this.LoadUnitTypes();
                            _this.formSubmitAttempt = false;
                            _this.modalRef.hide();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    });
            }
        }
        else {
            this.validateAllFields(unitType);
        }
    };
    UnitTypeComponent.prototype.confirm = function () {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    };
    UnitTypeComponent.prototype.reset = function () {
        // 
        var control = this.unitTypeFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.unitTypeFrm.reset();
            this.formSubmitAttempt = false;
        }
    };
    UnitTypeComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.unitTypeFrm.enable() : this.unitTypeFrm.disable();
    };
    UnitTypeComponent = __decorate([
        core_1.Component({
            templateUrl: './UnitType.Component.html'
        })
    ], UnitTypeComponent);
    return UnitTypeComponent;
}());
exports.UnitTypeComponent = UnitTypeComponent;
