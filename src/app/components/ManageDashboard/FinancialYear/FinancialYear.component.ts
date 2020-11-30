import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateFormatter } from 'angular-nepali-datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { IFinancialYear } from '../../../Model/FinancialYear';
import { DepartmentService } from '../../../Service/Department.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';


@Component({
    selector: 'my-FinancialYear-list',
    templateUrl: './FinancialYear.component.html'
})

export class FinancialYearComponent implements OnInit {
    FinancialYears: IFinancialYear[];
    financialyear: IFinancialYear;
    msg: string;
    indLoading: boolean = false;
    public formSubmitAttempt: boolean;
    FYearFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    searchKeyword='';

    startFormatter: DateFormatter = (sfromDate) => {
        return `${ sfromDate.year }.${ (sfromDate.month*1 + 1) }.${ sfromDate.day }`;
    }

    endFormatter: DateFormatter = (stoDate) => {
        return `${ stoDate.year }.${ (stoDate.month*1 + 1) }.${ stoDate.day }`;
    }

    constructor(private fb: FormBuilder, private _departmentService: DepartmentService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.FYearFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.compose([Validators.required, this.financialYearValidator])],
            NepaliEndDate: ['', Validators.compose([Validators.required, this.nepaliDateValidator])],
            NepaliStartDate: ['', Validators.compose([Validators.required, this.nepaliDateValidator])],
            StartDate: [new Date, Validators.required],
            EndDate: [new Date, Validators.required]
        });
        this.LoadFinancialYear();
    }

    LoadFinancialYear(): void {
        this.indLoading = true;
        this._departmentService.get(Global.BASE_FINANCIAL_YEAR_ENDPOINT)
            .subscribe(financials => { this.FinancialYears = financials; this.indLoading = false; },
                error => this.msg = <any>error);
    }

    openModal(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Financial Year";
        this.modalBtnTitle = "Save";
        this.FYearFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editFinancialYear(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Financial Year";
        this.modalBtnTitle = "Save";
        this.financialyear = this.FinancialYears.filter(x => x.Id == id)[0];
        this.FYearFrm.controls.Id.setValue(this.financialyear.Id);        
        this.FYearFrm.controls.Name.setValue(this.financialyear.Name);
        this.FYearFrm.controls.NepaliStartDate.setValue(this.financialyear.NepaliStartDate);
        this.FYearFrm.controls.NepaliEndDate.setValue(this.financialyear.NepaliEndDate);
        this.FYearFrm.controls.StartDate.setValue(new Date(this.financialyear.StartDate));
        this.FYearFrm.controls.EndDate.setValue(new Date(this.financialyear.EndDate));
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteFinancialYear(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.financialyear = this.FinancialYears.filter(x => x.Id == id)[0];
        this.FYearFrm.controls.Id.setValue(this.financialyear.Id);        
        this.FYearFrm.controls.Name.setValue(this.financialyear.Name);
        this.FYearFrm.controls.NepaliStartDate.setValue(this.financialyear.NepaliStartDate);
        this.FYearFrm.controls.NepaliEndDate.setValue(this.financialyear.NepaliEndDate);
        this.FYearFrm.controls.StartDate.setValue(new Date(this.financialyear.StartDate));
        this.FYearFrm.controls.EndDate.setValue(new Date(this.financialyear.EndDate));
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    nepaliDateValidator(control: FormControl) {
        let nepaliDate = control.value;
        let pattern = new RegExp(/(^[0-9]{4})\.([0-9]{2})\.([0-9]{2})/g);
        let isValid = pattern.test(nepaliDate);
        if (!isValid) {
            return {
                InvaliDate: 'The date is not valid'
            }
        }
        return null;
    }

    financialYearValidator(control: FormControl) {
        let year = control.value;

        if (!year) {
            return { InvalidYear: 'The date is not valid' }
        }

        let separatedName = year.split('.');
        let preYear = separatedName[0].slice(1,4);
        let postYear = separatedName[1];
        let pattern = new RegExp(/(^[0-9]{4})\.([0][0-9]{2})/g);
        let isValid = pattern.test(year);
        if (!isValid || (postYear < preYear) || (postYear - preYear) !== 1) {
            return { InvalidYear: 'The financial year is not valid' }
        } 

        return null;
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
        let fyearfrm = this.FYearFrm;
        fyearfrm.get('StartDate').setValue(new Date(fyearfrm.get('StartDate').value));
        fyearfrm.get('EndDate').setValue(new Date(fyearfrm.get('EndDate').value));

        if (fyearfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    console.log(formData.value);
                    
                    this._departmentService.post(Global.BASE_FINANCIAL_YEAR_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadFinancialYear();
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
                    this._departmentService.put(Global.BASE_FINANCIAL_YEAR_ENDPOINT,  formData.value.Id, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadFinancialYear();
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
                    this._departmentService.delete(Global.BASE_FINANCIAL_YEAR_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Financial Year successfully deleted.");
                                this.modalRef.hide();
                                this.LoadFinancialYear();
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
            this.validateAllFields(fyearfrm);
        }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.FYearFrm.enable() : this.FYearFrm.disable();
    }

    addFiscalyear(){

    }

    searchItem(){}
}
