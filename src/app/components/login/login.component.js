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
var global_1 = require("../../Shared/global");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(fb, loginService, authenticationSevice, route, router) {
        this.fb = fb;
        this.loginService = loginService;
        this.authenticationSevice = authenticationSevice;
        this.route = route;
        this.router = router;
        this.model = {};
        this.loading = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.form = this.fb.group({
            UserName: ['', forms_1.Validators.required],
            Password: ['', forms_1.Validators.required],
            Remember: ['']
        });
    };
    LoginComponent.prototype.validateAllFields = function (formGroup) {
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
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        var loginfrm = this.form;
        this.authenticationSevice.login(global_1.Global.BASE_LOGIN_ENDPOINT, loginfrm.value).subscribe(function (data) {
             ;
            if (data != 0) {
                alert("User Logged in successfully.");
                _this.router.navigate(['/dashboard']);
            }
            else {
                alert("Login failed");
            }
        }, function (error) {
            alert("Login failed");
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            styleUrls: ['./login.component.css'],
            templateUrl: './login.component.html'
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
