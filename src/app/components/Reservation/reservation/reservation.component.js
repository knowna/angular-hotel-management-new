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
var ReservationComponent = /** @class */ (function () {
    function ReservationComponent(fb, _reservationService, modalService, date) {
        this.fb = fb;
        this._reservationService = _reservationService;
        this.modalService = modalService;
        this.date = date;
        this.isLoading = false;
    }
    ReservationComponent.prototype.ngOnInit = function () {
        this.reservationForm = this.fb.group({
            Id: [''],
            Adult: [''],
            Children: [''],
            IsAdvancePaid: [''],
            AmountPaid: [''],
            RDate: [''],
            CustomerId: [''],
            PaymentType: [''],
            RoomTypeId: [''],
            ReservationType: [''],
            ReservationDetails: this.fb.array([]),
            SpecialRequest: [''],
            CheckInDate: [''],
            CheckOutDate: [''],
            NumberOfRoom: [''],
            Status: ['']
        });
        this.loadCustomers();
        this.loadRoomTypes();
        this.loadPaymentTypes();
        this.loadReservationTypes();
        this.loadReservations();
    };
    ReservationComponent.prototype.initReservationDetails = function () {
        //initialize our vouchers
        return this.fb.group({
            Id: [''],
            ChildrenAge: [''],
            ReservationId: ['']
        });
    };
    /**
     * Gets individual journal voucher
     * @param Id
     */
    ReservationComponent.prototype.getReservation = function (Id) {
        this.isLoading = true;
        return this._reservationService.get(global_1.Global.BASE_RESERVATION_ENDPOINT + '?ReservationId=' + Id);
    };
    ReservationComponent.prototype.addChildrenAge = function (childrenCount) {
        var childrenCount = childrenCount.split(":")[0];
        this.reservationForm.controls['ReservationDetails'] = this.fb.array([]);
        var control = this.reservationForm.controls['ReservationDetails'];
        for (var i = 0; i < childrenCount; i++) {
            var reservationDetail = this.initReservationDetails();
            control.push(reservationDetail);
        }
    };
    ReservationComponent.prototype.loadReservationTypes = function () {
        var _this = this;
        this._reservationService.get(global_1.Global.BASE_RESERVATION_TYPES_ENDPOINT)
            .subscribe(function (reservationsTypes) {
            _this.reservationsTypes = reservationsTypes;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    ReservationComponent.prototype.loadReservations = function () {
        var _this = this;
        this._reservationService.get(global_1.Global.BASE_RESERVATION_ENDPOINT)
            .subscribe(function (reservations) {
            _this.reservations = reservations;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    ReservationComponent.prototype.loadCustomers = function () {
        var _this = this;
        this._reservationService.get(global_1.Global.BASE_RESERVATION_CUSTOMER_ENDPOINT)
            .subscribe(function (customers) { _this.customers = customers; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    ReservationComponent.prototype.loadPaymentTypes = function () {
        var _this = this;
        this._reservationService.get(global_1.Global.BASE_PAYMENT_TYPES_ENDPOINT)
            .subscribe(function (paymentTypes) { _this.paymentTypes = paymentTypes; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    ReservationComponent.prototype.loadRoomTypes = function () {
        var _this = this;
        this._reservationService.get(global_1.Global.BASE_ROOM_TYPES_ENDPOINT)
            .subscribe(function (roomTypes) { _this.roomTypes = roomTypes; _this.isLoading = false; }, function (error) { return _this.msg = error; });
    };
    ReservationComponent.prototype.openModal = function (template) {
        this.dbops = enum_1.DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Reservation";
        this.modalBtnTitle = "Save";
        this.reservationForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-lg' });
    };
    ReservationComponent.prototype.editReservation = function (id, template) {
        var _this = this;
        this.dbops = enum_1.DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Reservation";
        this.modalBtnTitle = "Update";
        this.getReservation(id)
            .subscribe(function (reservation) {
            _this.isLoading = false;
            _this.reservation = reservation;
            debugger;
            _this.reservationForm.controls.Id.setValue(_this.reservation.Id);
            _this.reservationForm.controls.IsAdvancePaid.setValue(_this.reservation.IsAdvancePaid);
            _this.reservationForm.controls.Adult.setValue(_this.reservation.Adult);
            _this.reservationForm.controls.Children.setValue(_this.reservation.Children);
            _this.reservationForm.controls.NumberOfRoom.setValue(_this.reservation.NumberOfRoom);
            _this.reservationForm.controls.Status.setValue(_this.reservation.Status);
            _this.reservationForm.controls.AmountPaid.setValue(_this.reservation.AmountPaid);
            _this.reservationForm.controls.RDate.setValue(new Date(_this.reservation.RDate));
            _this.reservationForm.controls.CheckInDate.setValue(new Date(_this.reservation.CheckInDate));
            _this.reservationForm.controls.CheckOutDate.setValue(new Date(_this.reservation.CheckOutDate));
            _this.reservationForm.controls.CustomerId.setValue(_this.reservation.CustomerId);
            _this.reservationForm.controls.PaymentType.setValue(_this.reservation.PaymentType);
            _this.reservationForm.controls.RoomTypeId.setValue(_this.reservation.RoomTypeId);
            _this.reservationForm.controls.ReservationType.setValue(_this.reservation.ReservationType);
            _this.reservationForm.controls.SpecialRequest.setValue(_this.reservation.SpecialRequest);
            _this.reservationForm.controls['ReservationDetails'] = _this.fb.array([]);
            var control = _this.reservationForm.controls['ReservationDetails'];
            control.reset();
            for (var i = 0; i < _this.reservation.ReservationDetails.length; i++) {
                var valuesFromServer = _this.reservation.ReservationDetails[i];
                var instance = _this.fb.group(valuesFromServer);
                control.push(instance);
            }
            _this.modalRef = _this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-lg' });
        });
    };
    ReservationComponent.prototype.deleteReservation = function (id, template) {
        var _this = this;
        this.dbops = enum_1.DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.getReservation(id)
            .subscribe(function (reservation) {
            _this.isLoading = false;
            _this.reservation = reservation;
            _this.reservationForm.controls.Id.setValue(_this.reservation.Id);
            _this.reservationForm.controls.IsAdvancePaid.setValue(_this.reservation.IsAdvancePaid);
            _this.reservationForm.controls.Adult.setValue(_this.reservation.Adult);
            _this.reservationForm.controls.Children.setValue(_this.reservation.Children);
            _this.reservationForm.controls.NumberOfRoom.setValue(_this.reservation.NumberOfRoom);
            _this.reservationForm.controls.Status.setValue(_this.reservation.Status);
            _this.reservationForm.controls.AmountPaid.setValue(_this.reservation.AmountPaid);
            _this.reservationForm.controls.RDate.setValue(new Date(_this.reservation.RDate));
            _this.reservationForm.controls.CheckInDate.setValue(new Date(_this.reservation.CheckInDate));
            _this.reservationForm.controls.CheckOutDate.setValue(new Date(_this.reservation.CheckOutDate));
            _this.reservationForm.controls.CustomerId.setValue(_this.reservation.CustomerId);
            _this.reservationForm.controls.PaymentType.setValue(_this.reservation.PaymentType);
            _this.reservationForm.controls.RoomTypeId.setValue(_this.reservation.RoomTypeId);
            _this.reservationForm.controls.ReservationType.setValue(_this.reservation.ReservationType);
            _this.reservationForm.controls.SpecialRequest.setValue(_this.reservation.SpecialRequest);
            _this.reservationForm.controls['ReservationDetails'] = _this.fb.array([]);
            var control = _this.reservationForm.controls['ReservationDetails'];
            for (var i = 0; i < _this.reservation.ReservationDetails.length; i++) {
                var valuesFromServer = _this.reservation.ReservationDetails[i];
                var instance = _this.fb.group(valuesFromServer);
                control.push(instance);
            }
            _this.modalRef = _this.modalService.show(template, { backdrop: 'static', keyboard: false });
        });
    };
    ReservationComponent.prototype.validateAllFields = function (formGroup) {
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
    ReservationComponent.prototype.onSubmit = function (formData) {
        var _this = this;
        this.msg = "";
        this.formSubmitAttempt = true;
        var reserve = this.reservationForm;
        if (reserve.valid) {
            switch (this.dbops) {
                case enum_1.DBOperation.create:
                    this._reservationService.post(global_1.Global.BASE_RESERVATION_ENDPOINT, formData._value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully added.");
                            _this.loadReservations();
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
                    this._reservationService.put(global_1.Global.BASE_RESERVATION_ENDPOINT, formData._value.Id, reserve.value).subscribe(function (data) {
                        if (data == 1) {
                            alert("Data successfully updated.");
                            _this.modalRef.hide();
                            _this.loadReservations();
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
                    this._reservationService.delete(global_1.Global.BASE_RESERVATION_ENDPOINT, formData._value.Id).subscribe(function (data) {
                        if (data == 1) {
                            alert("Reservation successfully deleted.");
                            _this.modalRef.hide();
                            _this.loadReservations();
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
            this.validateAllFields(reserve);
        }
    };
    ReservationComponent.prototype.getReservationType = function (Id) {
        if (this.reservationsTypes) {
            return this.reservationsTypes.filter(function (rType) {
                return rType.Id === Id;
            })[0];
        }
    };
    ReservationComponent.prototype.getPaymentType = function (Id) {
        return this.paymentTypes.length && this.paymentTypes.filter(function (pType) {
            return pType.Id === Id;
        })[0];
    };
    ReservationComponent.prototype.getRoomType = function (Id) {
        return this.roomTypes.length && this.roomTypes.filter(function (rType) {
            return rType.Id === Id;
        })[0];
    };
    ReservationComponent.prototype.getCustomer = function (Id) {
        return this.customers.length && this.customers.filter(function (customer) {
            return customer.Id === Id;
        })[0];
    };
    // Remove Individual Age
    ReservationComponent.prototype.deleteAge = function (i) {
        var controls = this.reservationForm.controls['ReservationDetails'];
        var controlToRemove = this.reservationForm.controls.ReservationDetails['controls'][i].controls;
        var selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;
        if (selectedControl) {
            this._reservationService.delete(global_1.Global.BASE_RESERVATION_DETAILS_ENDPOINT, selectedControl)
                .subscribe(function (data) {
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
    // Fetch reservations based on given fetch type
    ReservationComponent.prototype.getData = function (fetchType) {
        var _this = this;
        this.isLoading = true;
        this._reservationService.get(global_1.Global.BASE_RESERVATION_ENDPOINT + '?fetchType=' + fetchType)
            .subscribe(function (reservations) {
            _this.reservations = reservations;
            _this.isLoading = false;
        }, function (error) { return _this.msg = error; });
    };
    ReservationComponent.prototype.SetControlsState = function (isEnable) {
        isEnable ? this.reservationForm.enable() : this.reservationForm.disable();
    };
    ReservationComponent = __decorate([
        core_1.Component({
            templateUrl: './reservation.component.html'
        })
    ], ReservationComponent);
    return ReservationComponent;
}());
exports.ReservationComponent = ReservationComponent;
