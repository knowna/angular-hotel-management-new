"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// Import Mocks
var MenuListComponent = /** @class */ (function () {
    function MenuListComponent() {
        this.menuList = [];
        // Constructions goes here
        this.menuList = [
            {
                id: 10007,
                name: "Vegetarian Menu",
                description: "Description about the vegetarian menu",
            },
            {
                id: 10008,
                name: "Non Vegetarian Menu",
                description: "Description about non vegetarian menu"
            }
        ];
    }
    MenuListComponent = __decorate([
        core_1.Component({
            selector: 'dcubeHotel-menu-list',
            templateUrl: './menu-list.component.html'
        })
    ], MenuListComponent);
    return MenuListComponent;
}());
exports.MenuListComponent = MenuListComponent;
