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
var TableComponent = /** @class */ (function () {
    function TableComponent(fb, _tableService, modalService) {
        this.fb = fb;
        this._tableService = _tableService;
        this.modalService = modalService;
        this.indLoading = false;
    }
    TableComponent.prototype.ngOnInit = function () {
        this.TableForm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required]
        });
        this.LoadTable();
    };
    TableComponent.prototype.LoadTable = function () {
        var _this = this;
         ;
        this.indLoading = true;
        this._tableService.get(global_1.Global.BASE_TABLEAPI_ENDPOINT)
            .subscribe(function (tables) { _this.tables = tables; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    TableComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Table";
        this.modalBtnTitle = "Save";
        this.TableForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    TableComponent.prototype.editTable = function (id, template) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Table";
        this.modalBtnTitle = "Update";
        this.table = this.tables.filter(function (x) { return x.Id == id; })[0];
        this.TableForm.setValue(this.table);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    TableComponent.prototype.deleteTable = function (id, template) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.table = this.tables.filter(function (x) { return x.Id == id; })[0];
        this.TableForm.setValue(this.table);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    TableComponent.prototype.validateAllFields = function (formGroup) {
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
    TableComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var tablefrm = this.TableForm;
        if (tablefrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._tableService.post(global_1.Global.BASE_TABLEAPI_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Table successfully added.");
                            _this.LoadTable();
                            _this.modalRef.hide();
                            _this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
                case enum_1.DBOperation.update:
                    this._tableService.put(global_1.Global.BASE_TABLEAPI_ENDPOINT,  formData.value.Id, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Table successfully updated.");
                            _this.modalRef.hide();
                            _this.LoadTable();
                            _this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
                case enum_1.DBOperation.delete:
                    this._tableService.delete(global_1.Global.BASE_TABLEAPI_ENDPOINT,  formData.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Table successfully deleted.");
                            _this.modalRef.hide();
                            _this.formSubmitAttempt = false;
                            _this.LoadTable();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    }, function (error) {
                        _this.msg = error;
                    });
                    break;
            }
        }
        else {
            this.validateAllFields(tablefrm);
        }
    };
    TableComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.TableForm.enable() : this.TableForm.disable();
    };
    TableComponent = __decorate([
        core_1.Component({
            selector: 'my-table-list',
            templateUrl: './table.component.html'
        })
    ], TableComponent);
    return TableComponent;
}());
exports.TableComponent = TableComponent;
