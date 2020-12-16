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
var RoomOccupiedComponent = /** @class */ (function () {
    function RoomOccupiedComponent(fb, _roomOccupiedService, modalService, date) {
        this.fb = fb;
        this._roomOccupiedService = _roomOccupiedService;
        this.modalService = modalService;
        this.date = date;
        this.isLoading = false;
    }
    RoomOccupiedComponent.prototype.ngOnInit = function () {
        this.occupiedRoomForm = this.fb.group({
            Id: [''],
            CustomerId: [''],
            ReservationId: [''],
            listRoomOccupiedDetail: this.fb.array([
                this.initRoomlistRoomOccupiedDetail()
            ])
        });
        this.loadReservations();
        this.loadRooms();
        this.loadCustomers();
        this.loadOccupiedRooms();
    };
    RoomOccupiedComponent.prototype.loadRooms = function () {
        var _this = this;
        this.isLoading = true;
        this._roomOccupiedService.get(global_1.Global.BASE_RESERVATION_ROOM_ENDPOINT)
            .subscribe(function (rooms) { _this.rooms = rooms; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    RoomOccupiedComponent.prototype.initRoomlistRoomOccupiedDetail = function () {
        //initialize our vouchers
        return this.fb.group({
            Id: [''],
            ReservationId: [''],
            RoomId: [''],
            RoomOccupiedId: ['']
        });
    };
    RoomOccupiedComponent.prototype.addRoom = function () {
        var newRoom = this.initRoomlistRoomOccupiedDetail();
        var control = this.occupiedRoomForm.controls['listRoomOccupiedDetail'];
        var instance = newRoom;
        control.push(instance);
    };
    RoomOccupiedComponent.prototype.loadReservations = function () {
        var _this = this;
        this._roomOccupiedService.get(global_1.Global.BASE_RESERVATION_ENDPOINT)
            .subscribe(function (reservations) {
            _this.reservations = reservations;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    RoomOccupiedComponent.prototype.loadCustomers = function () {
        var _this = this;
        this._roomOccupiedService.get(global_1.Global.BASE_RESERVATION_CUSTOMER_ENDPOINT)
            .subscribe(function (customers) {
            _this.customers = customers;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    RoomOccupiedComponent.prototype.loadOccupiedRooms = function () {
        var _this = this;
        this._roomOccupiedService.get(global_1.Global.BASE_ROOM_OCCUPIED_ENDPOINT)
            .subscribe(function (occupiedRooms) {
            debugger;
            _this.occupiedRooms = occupiedRooms;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    RoomOccupiedComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Room Occupancy";
        this.modalBtnTitle = "Save";
        this.occupiedRoomForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomOccupiedComponent.prototype.editOccupiedRoom = function (id, template) {
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Room Occupancy";
        this.modalBtnTitle = "Update";
        this.occupiedRoom = this.occupiedRooms.filter(function (x) { return x.Id == id; })[0];
        this.occupiedRoomForm.controls.Id.setValue(this.occupiedRoom.Id);
        this.occupiedRoomForm.controls.CustomerId.setValue(this.occupiedRoom.CustomerId);
        this.occupiedRoomForm.controls.ReservationId.setValue(this.occupiedRoom.ReservationId);
        this.occupiedRoomForm.controls['listRoomOccupiedDetail'] = this.fb.array([]);
        var control = this.occupiedRoomForm.controls['listRoomOccupiedDetail'];
        control.reset();
        for (var i = 0; i < this.occupiedRoom.listRoomOccupiedDetail.length; i++) {
            var valuesFromServer = this.occupiedRoom.listRoomOccupiedDetail[i];
            var instance = this.fb.group(valuesFromServer);
            control.push(instance);
        }
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomOccupiedComponent.prototype.deleteOccupiedRoom = function (id, template) {
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.occupiedRoom = this.occupiedRooms.filter(function (x) { return x.Id == id; })[0];
        this.occupiedRoomForm.controls.Id.setValue(this.occupiedRoom.Id);
        this.occupiedRoomForm.controls.CustomerId.setValue(this.occupiedRoom.CustomerId);
        this.occupiedRoomForm.controls.ReservationId.setValue(this.occupiedRoom.ReservationId);
        this.occupiedRoomForm.controls['listRoomOccupiedDetail'] = this.fb.array([]);
        var control = this.occupiedRoomForm.controls['listRoomOccupiedDetail'];
        control.reset();
        for (var i = 0; i < this.occupiedRoom.listRoomOccupiedDetail.length; i++) {
            var valuesFromServer = this.occupiedRoom.listRoomOccupiedDetail[i];
            var instance = this.fb.group(valuesFromServer);
            control.push(instance);
        }
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    };
    RoomOccupiedComponent.prototype.validateAllFields = function (formGroup) {
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
    RoomOccupiedComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var roomOccupied = this.occupiedRoomForm;
        if (roomOccupied.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._roomOccupiedService.post(global_1.Global.BASE_ROOM_OCCUPIED_ENDPOINT, formData._value)
                        .subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.loadOccupiedRooms();
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
                    this._roomOccupiedService.put(global_1.Global.BASE_ROOM_OCCUPIED_ENDPOINT, formData._value.Id, formData._value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.loadOccupiedRooms();
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
                    this._roomOccupiedService.delete(global_1.Global.BASE_ROOM_OCCUPIED_ENDPOINT, formData._value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("OccupiedRoom successfully deleted.");
                            _this.modalRef.hide();
                            _this.loadOccupiedRooms();
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
            this.validateAllFields(roomOccupied);
        }
    };
    // Remove Individual Room
    RoomOccupiedComponent.prototype.removeRoom = function (i) {
        var controls = this.occupiedRoomForm.controls['listRoomOccupiedDetail'];
        var controlToRemove = this.occupiedRoomForm.controls.listRoomOccupiedDetail['controls'][i].controls;
        var selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;
        if (selectedControl) {
            this._roomOccupiedService.delete(global_1.Global.BASE_ROOM_OCCUPIED_DETAILS_ENDPOINT, i).subscribe(function (data) {
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
    RoomOccupiedComponent.prototype.getReservation = function (Id) {
        return this.reservations.length && this.reservations.filter(function (r) {
            return r.Id === Id;
        })[0];
    };
    RoomOccupiedComponent.prototype.getCustomer = function (Id) {
        return this.customers.length && this.customers.filter(function (customer) {
            return customer.Id === Id;
        })[0];
    };
    RoomOccupiedComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.occupiedRoomForm.enable() : this.occupiedRoomForm.disable();
    };
    /**
     * Filters reservation fills the form
     * @param event
     */
    RoomOccupiedComponent.prototype.fillForm = function (event) {
        var param = event.target.value;
        var reservationId = param.split(':')[1];
        var reservation = this.reservations.filter(function (reservation) {
            return reservation.Id = reservationId;
        })[0];
        if (reservation) {
            this.occupiedRoomForm.controls.ReservationId.setValue(reservation.Id);
            this.occupiedRoomForm.controls.CustomerId.setValue(reservation.CustomerId);
        }
        return this.occupiedRoomForm;
    };
    RoomOccupiedComponent = __decorate([
        core_1.Component({
            templateUrl: './room-occupied.component.html'
        })
    ], RoomOccupiedComponent);
    return RoomOccupiedComponent;
}());
exports.RoomOccupiedComponent = RoomOccupiedComponent;
