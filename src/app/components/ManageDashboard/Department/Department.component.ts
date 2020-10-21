import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { IDepartment } from '../../../Model/Department';
import { DepartmentService } from '../../../Service/Department.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';

    

@Component({
    selector: 'my-department-list',
    templateUrl: './Department.component.html'
})

export class DepartmentComponent implements OnInit {
    departments: IDepartment[];
    department: IDepartment;
    msg: string;
    indLoading: boolean = false;
    private formSubmitAttempt: boolean;
    DepartFrm : FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;

    constructor(private fb: FormBuilder, private _departmentService: DepartmentService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.DepartFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.LoadDepartment();
    }

    LoadDepartment(): void {
         
        this.indLoading = true;
        this._departmentService.get(Global.BASE_DEPARTMENT_ENDPOINT)
            .subscribe(departments => { this.departments = departments; this.indLoading = false; },
            error => this.msg = error);
    }

    openModal(template: TemplateRef<any>) {

        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Department";
        this.modalBtnTitle = "Save";
        this.DepartFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editDepartment(id: number, template: TemplateRef<any>) {
         
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit DepartmentName";
        this.modalBtnTitle = "Update";
        this.department = this.departments.filter(x => x.Id == id)[0];
        this.DepartFrm.setValue(this.department);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }
    
    deleteDepartment(id: number, template: TemplateRef<any>) {  
         
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.department = this.departments.filter(x => x.Id == id)[0];
        this.DepartFrm.setValue(this.department);
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
        let departfrm = this.DepartFrm;

        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._departmentService.post(Global.BASE_DEPARTMENT_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadDepartment();
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
                    this._departmentService.put(Global.BASE_DEPARTMENT_ENDPOINT,  formData.value.Id, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadDepartment();
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
                    this._departmentService.delete(Global.BASE_DEPARTMENT_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.LoadDepartment();
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
            }
        }
        else {
            this.validateAllFields(departfrm);
        }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.DepartFrm.enable() : this.DepartFrm.disable();
    }
   
}
