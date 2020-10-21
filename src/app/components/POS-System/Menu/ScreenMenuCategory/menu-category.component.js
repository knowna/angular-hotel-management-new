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
var MenuCategory_1 = require("../../../Model/Menu/MenuCategory");
var global_1 = require("../../../Shared/global");
var MenuCategoryComponent1 = /** @class */ (function () {
    function MenuCategoryComponent1(fb, _menucategoryService, _menuService, route) {
        this.fb = fb;
        this._menucategoryService = _menucategoryService;
        this._menuService = _menuService;
        this.route = route;
        this.indLoading = false;
    }
    MenuCategoryComponent1.prototype.ngOnInit = function () {
        var _this = this;
        this.MenuCategoryFrm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required],
            MenuId: [''],
            Menu_Bool: ['']
        });
        this.route.params.subscribe(function (params) {
            _this.LoadMenuCategory(params['menuid']);
        });
    };
    MenuCategoryComponent1.prototype.LoadMenuCategory = function (Id) {
        var _this = this;
        
        this.indLoading = true;
        this._menucategoryService.get(global_1.Global.BASE_MENUSCATEOGRY_ENDPOINT + Id)
            .subscribe(function (screenmenucategories) {
            _this.screenmenucategories = screenmenucategories;
            _this.indLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    MenuCategoryComponent1.prototype.addCategoriesToMenu = function (categoryId, MenuId, Menu_Bool) {
        var _this = this;
        
        var MenuCategory = new MenuCategory_1.IScreenMenuCategorys(categoryId, MenuId, Menu_Bool);
        this._menucategoryService.posts(global_1.Global.BASE_MENUSCATEOGRY_ENDPOINT, MenuCategory).subscribe(function (data) {
            if (data == 1) {
                alert("Category successfully added.");
                _this.route.params.subscribe(function (params) {
                    _this.LoadMenuCategory(params['menuid']);
                });
            }
            else if (data == 2) {
                alert("Category successfully deleted");
            }
            else {
                alert("There is some issue in saving records, please contact to system administrator!");
            }
        }, function (error) {
            alert("There is some issue in saving records, please contact to system administrator!");
        });
    };
    MenuCategoryComponent1.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.MenuCategoryFrm.enable() : this.MenuCategoryFrm.disable();
    };
    MenuCategoryComponent1 = __decorate([
        core_1.Component({
            selector: 'my-menu-category-list',
            templateUrl: './Menu-Category.component.html'
        })
    ], MenuCategoryComponent1);
    return MenuCategoryComponent1;
}());
exports.MenuCategoryComponent1 = MenuCategoryComponent1;
