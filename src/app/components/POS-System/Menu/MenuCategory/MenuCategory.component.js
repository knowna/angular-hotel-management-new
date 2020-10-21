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
var MenuCategoryComponent = /** @class */ (function () {
    function MenuCategoryComponent(fb, _menucategoryService, modalService) {
        this.fb = fb;
        this._menucategoryService = _menucategoryService;
        this.modalService = modalService;
        this.indLoading = false;
        //this._menucategoryService.getMenuItems().subscribe(data => { this.menuItems = data });
        //this._menucategoryService.getMenu().subscribe(data => { this.menus = data });
    }
    MenuCategoryComponent.prototype.ngOnInit = function () {
        this.MenuCategoryFrm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required]
        });
        this.LoadMenuCategory();
    };
    MenuCategoryComponent.prototype.LoadMenuCategory = function () {
        var _this = this;
        this.indLoading = true;
        this._menucategoryService.get(global_1.Global.BASE_MENUCATEGORY_ENDPOINT)
            .subscribe(function (menucategories) { _this.menucategories = menucategories; _this.indLoading = false; }, function (error) { return _this.msg = error; });
    };
    MenuCategoryComponent.prototype.addMenuCategory = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New MenuCategory";
        this.modalBtnTitle = "Save";
        this.MenuCategoryFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    MenuCategoryComponent.prototype.editMenuCategory = function (Id, template) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Category";
        this.modalBtnTitle = "Update";
        this.menucategory = this.menucategories.filter(function (x) { return x.Id == Id; })[0];
        this.MenuCategoryFrm.setValue(this.menucategory);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    MenuCategoryComponent.prototype.deleteMenuCategory = function (id, template) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.menucategory = this.menucategories.filter(function (x) { return x.Id == id; })[0];
        this.MenuCategoryFrm.setValue(this.menucategory);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    MenuCategoryComponent.prototype.validateAllFields = function (formGroup) {
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
    MenuCategoryComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var menucatform = this.MenuCategoryFrm;
        if (menucatform.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._menucategoryService.post(global_1.Global.BASE_MENUCATEGORY_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added");
                            _this.LoadMenuCategory();
                            _this.formSubmitAttempt = false;
                            _this.modalRef.hide();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    }, function (error) {
                        alert("There is some issue in saving records, please contact to system administrator!");
                    });
                    break;
                case enum_1.DBOperation.update:
                    this._menucategoryService.put(global_1.Global.BASE_MENUCATEGORY_ENDPOINT, formData.value.Id, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.formSubmitAttempt = false;
                            _this.LoadMenuCategory();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        _this.modalRef.hide();
                    }, function (error) {
                        alert("There is some issue in saving records, please contact to system administrator!");
                    });
                    break;
                case enum_1.DBOperation.delete:
                    this._menucategoryService.delete(global_1.Global.BASE_MENUCATEGORY_ENDPOINT, formData.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully deleted.");
                            _this.modalRef.hide();
                            _this.formSubmitAttempt = false;
                            _this.LoadMenuCategory();
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    }, function (error) {
                        alert("There is some issue in saving records, please contact to system administrator!");
                    });
                    break;
            }
        }
        else {
            this.validateAllFields(menucatform);
        }
    };
    MenuCategoryComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.MenuCategoryFrm.enable() : this.MenuCategoryFrm.disable();
    };
    MenuCategoryComponent = __decorate([
        core_1.Component({
            selector: 'my-menucategory-list',
            templateUrl: './MenuCategory.component.html'
        })
    ], MenuCategoryComponent);
    return MenuCategoryComponent;
}());
exports.MenuCategoryComponent = MenuCategoryComponent;
