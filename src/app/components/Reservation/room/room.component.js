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
var RoomComponent = /** @class */ (function () {
    function RoomComponent(fb, _roomService, modalService) {
        this.fb = fb;
        this._roomService = _roomService;
        this.modalService = modalService;
        this.isLoading = false;
    }
    RoomComponent.prototype.ngOnInit = function () {
        this.roomForm = this.fb.group({
            Id: [''],
            MaxCapacity: [''],
            RoomNumber: [''],
            RoomPrice: [''],
            RoomTypeId: ['']
        });
        this.LoadRoomTypes();
        this.LoadRooms();
    };
    RoomComponent.prototype.LoadRoomTypes = function () {
        var _this = this;
        this.isLoading = true;
        this._roomService.get(global_1.Global.BASE_ROOM_TYPES_ENDPOINT)
            .subscribe(function (roomTypes) { _this.roomTypes = roomTypes; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    RoomComponent.prototype.LoadRooms = function () {
        var _this = this;
        this.isLoading = true;
        this._roomService.get(global_1.Global.BASE_RESERVATION_ROOM_ENDPOINT)
            .subscribe(function (rooms) { _this.rooms = rooms; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    RoomComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Room";
        this.modalBtnTitle = "Save";
        this.roomForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomComponent.prototype.editRoom = function (id, template) {
         
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Room";
        this.modalBtnTitle = "Update";
        this.room = this.rooms.filter(function (x) { return x.Id == id; })[0];
        this.roomForm.setValue(this.room);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomComponent.prototype.deleteRoom = function (id, template) {
         
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.room = this.rooms.filter(function (x) { return x.Id == id; })[0];
        this.roomForm.setValue(this.room);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomComponent.prototype.validateAllFields = function (formGroup) {
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
    RoomComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var departfrm = this.roomForm;
        if (departfrm.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._roomService.post(global_1.Global.BASE_RESERVATION_ROOM_ENDPOINT, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.LoadRooms();
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
                    this._roomService.put(global_1.Global.BASE_RESERVATION_ROOM_ENDPOINT, formData.value.Id, formData.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.LoadRooms();
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
                    this._roomService.delete(global_1.Global.BASE_RESERVATION_ROOM_ENDPOINT, formData.value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Room successfully deleted.");
                            _this.modalRef.hide();
                            _this.LoadRooms();
                            _this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        //this.modal.dismiss();
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
    RoomComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.roomForm.enable() : this.roomForm.disable();
    };
    RoomComponent.prototype.getRoomType = function (Id) {
        return this.roomTypes.length && this.roomTypes.filter(function (rType) {
            return rType.Id === Id;
        })[0];
    };
    RoomComponent = __decorate([
        core_1.Component({
            templateUrl: './room.component.html'
        })
    ], RoomComponent);
    return RoomComponent;
}());
exports.RoomComponent = RoomComponent;
