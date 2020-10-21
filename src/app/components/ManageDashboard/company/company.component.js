"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var enum_1 = require("../../Shared/enum");
var global_1 = require("../../Shared/global");
var CompanyComponent = /** @class */ (function () {
    function CompanyComponent(fb, _reservationService, modalService, fileService, date) {
        this.fb = fb;
        this._reservationService = _reservationService;
        this.modalService = modalService;
        this.fileService = fileService;
        this.date = date;
        this.isLoading = false;
        this.uploadUrl = global_1.Global.BASE_FILE_UPLOAD_ENDPOINT;
        this.fileUrl = '';
    }
    CompanyComponent.prototype.ngOnInit = function () {
        this.companyForm = this.fb.group({
            Id: [''],
            BranchCode: [''],
            Email: [''],
            File: [''],
            IdentityFileName: [''],
            IdentityFileType: [''],
            PhotoIdentity: [''],
            IRD_Password: [''],
            IRD_UserName: [''],
            NameEnglish: [''],
            NameNepali: [''],
            Pan_Vat: [''],
            Phone: ['']
        });
        this.company = { File: '' };
        this.loadCompanies();
    };
    CompanyComponent.prototype.onFileChange = function (event) {
        if (event.target.files.length > 0) {
            var file = event.target.files[0];
        }
    };
    CompanyComponent.prototype.clearFile = function () {
        this.fileInput.nativeElement.value = '';
    };
    /**
     * Delete file for the server
     * @param id
     */
    CompanyComponent.prototype.deleteFile = function (id) {
        var _this = this;
        this._reservationService.delete(global_1.Global.BASE_FILE_UPLOAD_ENDPOINT, id)
            .subscribe(function (result) {
            if (result) {
                _this.company.File = '';
            }
        }, function (error) { return _this.msg = error; });
    };
    CompanyComponent.prototype.loadCompanies = function () {
        var _this = this;
        this._reservationService.get(global_1.Global.BASE_COMPANY_ENDPOINT)
            .subscribe(function (companies) {
            _this.companies = companies;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    /**
     * Opens the company form modal
     * @param template
     */
    CompanyComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Company";
        this.modalBtnTitle = "Save";
        this.companyForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    CompanyComponent.prototype.viewFile = function (fileUrl, template) {
        this.fileUrl = fileUrl;
        this.modalTitle = "View Attachment";
        this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-xl' });
    };
    CompanyComponent.prototype.editCompany = function (id, template) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Company";
        this.modalBtnTitle = "Update";
        this.company = this.companies.filter(function (x) { return x.Id == id; })[0];
        this.companyForm.controls.Id.setValue(this.company.Id);
        this.companyForm.controls.BranchCode.setValue(this.company.BranchCode);
        this.companyForm.controls.Email.setValue(this.company.Email);
        this.companyForm.controls.IRD_Password.setValue(this.company.IRD_Password);
        this.companyForm.controls.IRD_UserName.setValue(this.company.IRD_UserName);
        this.companyForm.controls.NameEnglish.setValue(this.company.NameEnglish);
        this.companyForm.controls.NameNepali.setValue(this.company.NameNepali);
        this.companyForm.controls.Pan_Vat.setValue(this.company.Pan_Vat);
        this.companyForm.controls.Phone.setValue(this.company.Phone);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    CompanyComponent.prototype.deleteCompany = function (id, template) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.company = this.companies.filter(function (x) { return x.Id == id; })[0];
        this.companyForm.controls.Id.setValue(this.company.Id);
        this.companyForm.controls.BranchCode.setValue(this.company.BranchCode);
        this.companyForm.controls.Email.setValue(this.company.Email);
        this.companyForm.controls.IRD_Password.setValue(this.company.IRD_Password);
        this.companyForm.controls.IRD_UserName.setValue(this.company.IRD_UserName);
        this.companyForm.controls.NameEnglish.setValue(this.company.NameEnglish);
        this.companyForm.controls.NameNepali.setValue(this.company.NameNepali);
        this.companyForm.controls.Pan_Vat.setValue(this.company.Pan_Vat);
        this.companyForm.controls.Phone.setValue(this.company.Phone);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    CompanyComponent.prototype.validateAllFields = function (formGroup) {
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
    /**
     *
     * @param formData
     * @param fileUpload
     */
    CompanyComponent.prototype.onSubmit = function (formData, fileUpload) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var company;
            return __generator(this, function (_a) {
                this.msg = "";
                this.formSubmitAttempt = true;
                company = this.companyForm;
                if (company.valid) {
                    switch (this.dbops) {
                        case enum_1.DBOperation.create:
                            this._reservationService.post(global_1.Global.BASE_COMPANY_ENDPOINT, company.value).subscribe(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(data > 0)) return [3 /*break*/, 2];
                                            // file upload stuff goes here
                                            return [4 /*yield*/, fileUpload.handleFileUpload({
                                                    'moduleName': 'Company',
                                                    'id': data
                                                })];
                                        case 1:
                                            // file upload stuff goes here
                                            _a.sent();
                                            alert("Data successfully added.");
                                            this.loadCompanies();
                                            this.modalRef.hide();
                                            this.formSubmitAttempt = false;
                                            return [3 /*break*/, 3];
                                        case 2:
                                            alert("There is some issue in saving records, please contact to system administrator!");
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, function (error) {
                                _this.msg = error;
                            });
                            break;
                        case enum_1.DBOperation.update:
                            this._reservationService.put(global_1.Global.BASE_COMPANY_ENDPOINT,  formData.value.Id, company.value).subscribe(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                             ;
                                            if (!(data == 1)) return [3 /*break*/, 2];
                                            // file upload stuff goes here
                                            return [4 /*yield*/, fileUpload.handleFileUpload({
                                                    'moduleName': 'Company',
                                                    'id': data
                                                })];
                                        case 1:
                                            // file upload stuff goes here
                                            _a.sent();
                                            alert("Data successfully updated.");
                                            this.modalRef.hide();
                                            this.loadCompanies();
                                            this.formSubmitAttempt = false;
                                            return [3 /*break*/, 3];
                                        case 2:
                                            alert("There is some issue in saving records, please contact to system administrator!");
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }, function (error) {
                                _this.msg = error;
                            });
                            break;
                        case enum_1.DBOperation.delete:
                            this._reservationService.delete(global_1.Global.BASE_COMPANY_ENDPOINT,  formData.value.Id).subscribe(function (data) {
                                if (data == 1) {
                                    alert("Company successfully deleted.");
                                    _this.modalRef.hide();
                                    _this.loadCompanies();
                                    _this.formSubmitAttempt = false;
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
                    this.validateAllFields(company);
                }
                return [2 /*return*/];
            });
        });
    };
    CompanyComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.companyForm.enable() : this.companyForm.disable();
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], CompanyComponent.prototype, "fileInput", void 0);
    CompanyComponent = __decorate([
        core_1.Component({
            templateUrl: './company.component.html',
            styleUrls: ['./company.component.scss']
        })
    ], CompanyComponent);
    return CompanyComponent;
}());
exports.CompanyComponent = CompanyComponent;
