import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { Facility } from 'src/app/Model/reservation/facility.model';
import { FacilityService } from 'src/app/Service/reservation/facility.services';

@Component({
    templateUrl: './facility.component.html'
})

export class FacilityComponent implements OnInit {
    facilities: Facility[];
    facility: Facility;
    msg: string;
    isLoading: boolean = false;
    facilityForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    
    constructor(private fb: FormBuilder, private _facilityService: FacilityService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.facilityForm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadFacilitys();
    }
    
    LoadFacilitys(): void {
        ' '
        this.isLoading = true;
        this._facilityService.get(Global.BASE_RESERVATION_FACILITY_ENDPOINT)
            .subscribe(facilities => { this.facilities = facilities; this.isLoading = false; },
            error => this.msg = <any>error);
    }

    openModal(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Room Type";
        this.modalBtnTitle = "Save";
        this.facilityForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Room Type";
        this.modalBtnTitle = "Update";
        this.facility = this.facilities.filter(x => x.Id == id)[0];
        this.facilityForm.setValue(this.facility);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteDepartment(id: number, template: TemplateRef<any>) {
        ' '
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.facility = this.facilities.filter(x => x.Id == id)[0];
        this.facilityForm.setValue(this.facility);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    validateAllFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFields(control);
            }
        });
    }

    onSubmit(formData: any) {
        this.msg = "";
        this.formSubmitAttempt = true;
        let departfrm = this.facilityForm;

        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._facilityService.post(Global.BASE_RESERVATION_FACILITY_ENDPOINT, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadFacilitys();
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.update:
                    this._facilityService.put(Global.BASE_RESERVATION_FACILITY_ENDPOINT, formData._value.Id, formData._value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadFacilitys();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.delete:
                    this._facilityService.delete(Global.BASE_RESERVATION_FACILITY_ENDPOINT, formData._value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.LoadFacilitys();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            //this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
            }
        }
        else {
            this.validateAllFields(departfrm);
        }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.facilityForm.enable() : this.facilityForm.disable();
    }
}
