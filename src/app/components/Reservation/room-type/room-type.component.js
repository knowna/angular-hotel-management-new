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
var RoomTypeComponent = /** @class */ (function () {
    function RoomTypeComponent(fb, _roomTypeService, modalService) {
        this.fb = fb;
        this._roomTypeService = _roomTypeService;
        this.modalService = modalService;
        this.isLoading = false;
    }
    RoomTypeComponent.prototype.ngOnInit = function () {
        this.roomTypeForm = this.fb.group({
            Id: [''],
            Name: ['', forms_1.Validators.required]
        });
        this.LoadRoomTypes();
    };
    RoomTypeComponent.prototype.LoadRoomTypes = function () {
        var _this = this;
         ;
        this.isLoading = true;
        this._roomTypeService.get(global_1.Global.BASE_ROOM_TYPES_ENDPOINT)
            .subscribe(function (roomTypes) { _this.roomTypes = roomTypes; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    RoomTypeComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Room Type";
        this.modalBtnTitle = "Save";
        this.roomTypeForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomTypeComponent.prototype.editDepartment = function (id, template) {
         ;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Room Type";
        this.modalBtnTitle = "Update";
        this.roomType = this.roomTypes.filter(function (x) { return x.Id == id; })[0];
        this.roomTypeForm.setValue(this.roomType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomTypeComponent.prototype.deleteDepartment = function (id, template) {
         ;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.roomType = this.roomTypes.filter(function (x) { return x.Id == id; })[0];
        this.roomTypeForm.setValue(this.roomType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomTypeComponent.prototype.validateAllFields = function (formGroup) {
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
    RoomTypeComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var departfrm = this.roomTypeForm;
        if (departfrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._roomTypeService.post(global_1.Global.BASE_ROOM_TYPES_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.LoadRoomTypes();
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
                    this._roomTypeService.put(global_1.Global.BASE_ROOM_TYPES_ENDPOINT,  formData.value.Id, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.LoadRoomTypes();
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
                    this._roomTypeService.delete(global_1.Global.BASE_ROOM_TYPES_ENDPOINT,  formData.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Department successfully deleted.");
                            _this.modalRef.hide();
                            _this.LoadRoomTypes();
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
            this.validateAllFields(departfrm);
        }
    };
    RoomTypeComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.roomTypeForm.enable() : this.roomTypeForm.disable();
    };
    RoomTypeComponent = __decorate([
        core_1.Component({
            templateUrl: './room-type.component.html'
        })
    ], RoomTypeComponent);
    return RoomTypeComponent;
}());
exports.RoomTypeComponent = RoomTypeComponent;
