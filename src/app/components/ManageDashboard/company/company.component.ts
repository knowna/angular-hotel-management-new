import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Company } from '../../../Model/company.model';
import { FileService } from '../../../Service/file.service';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';


@Component({
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
    @ViewChild('fileInput',{static:false}) fileInput: ElementRef;

    companies: Company[];
    company: Company;
    msg: string;
    isLoading: boolean = false;
    companyForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    checkOutModalRef: BsModalRef;
    formSubmitAttempt: boolean;
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    fileUrl: string = '';

    constructor(
        private fb: FormBuilder,
        private _reservationService: AccountTransactionTypeService,
        private modalService: BsModalService,
        private fileService: FileService,
        private date: DatePipe
    ) {}

    ngOnInit(): void {        
        this.companyForm = this.fb.group({
            Id: [''],
            BranchCode: [''],
            Address: [''],
            City: [''],
            Street: [''],
            District: [''],
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
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
        }
    }

    clearFile() {
        this.fileInput.nativeElement.value = '';
    }

    /**
     * Delete file for the server
     * @param id 
     */
    deleteFile(id) {
        this._reservationService.delete(Global.BASE_FILE_UPLOAD_ENDPOINT, id)
            .subscribe(
                result => {
                   if (result) {
                       this.company.File = '';
                   }
                },
                error => this.msg = <any>error
            );
    }

    loadCompanies() {
        this._reservationService.get(Global.BASE_COMPANY_ENDPOINT)
            .subscribe(
                companies => {
                    this.companies = companies;
                    this.isLoading = false;
                },
                error => this.msg = <any>error
            );
    }
   
    /**
     * Opens the company form modal
     * @param template 
     */
    openModal(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Company";
        this.modalBtnTitle = "Save & Submit";
        this.companyForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    viewFile(fileUrl, template: TemplateRef<any>) {
        this.fileUrl = fileUrl;
        this.modalTitle = "View Attachment";
        this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-xl' });
    }

    editCompany(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Company";
        this.modalBtnTitle = "Update";
        this.company = this.companies.filter(x => x.Id == id)[0];
        this.companyForm.controls.Id.setValue(this.company.Id);
        this.companyForm.controls.BranchCode.setValue(this.company.BranchCode);
        this.companyForm.controls.Address.setValue(this.company.Address);
        this.companyForm.controls.City.setValue(this.company.City);
        this.companyForm.controls.Street.setValue(this.company.Street);
        this.companyForm.controls.District.setValue(this.company.District);
        this.companyForm.controls.Email.setValue(this.company.Email);
        this.companyForm.controls.IRD_Password.setValue(this.company.IRD_Password);
        this.companyForm.controls.IRD_UserName.setValue(this.company.IRD_UserName);
        this.companyForm.controls.NameEnglish.setValue(this.company.NameEnglish);
        this.companyForm.controls.NameNepali.setValue(this.company.NameNepali);
        this.companyForm.controls.Pan_Vat.setValue(this.company.Pan_Vat);
        this.companyForm.controls.Phone.setValue(this.company.Phone);

        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteCompany(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.company = this.companies.filter(x => x.Id == id)[0];
        this.companyForm.controls.Id.setValue(this.company.Id);
        this.companyForm.controls.BranchCode.setValue(this.company.BranchCode);
        this.companyForm.controls.Address.setValue(this.company.Address);
        this.companyForm.controls.City.setValue(this.company.City);
        this.companyForm.controls.Street.setValue(this.company.Street);
        this.companyForm.controls.District.setValue(this.company.District);
        this.companyForm.controls.Email.setValue(this.company.Email);
        this.companyForm.controls.IRD_Password.setValue(this.company.IRD_Password);
        this.companyForm.controls.IRD_UserName.setValue(this.company.IRD_UserName);
        this.companyForm.controls.NameEnglish.setValue(this.company.NameEnglish);
        this.companyForm.controls.NameNepali.setValue(this.company.NameNepali);
        this.companyForm.controls.Pan_Vat.setValue(this.company.Pan_Vat);
        this.companyForm.controls.Phone.setValue(this.company.Phone);
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

    /**
     * 
     * @param formData 
     * @param fileUpload 
     */
    async onSubmit(formData: any, fileUpload: any) {
        this.msg = "";
        this.formSubmitAttempt = true;
        let company = this.companyForm;

        if (company.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._reservationService.post(Global.BASE_COMPANY_ENDPOINT, company.value).subscribe(
                        async data => {
                            if (data > 0) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'Company',
                                    'id': data
                                });
                                alert("Data successfully added.");
                                this.loadCompanies();
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.update:
                    this._reservationService.put(Global.BASE_COMPANY_ENDPOINT,  formData.value.Id, company.value).subscribe(
                        async (data) => {
                            if (data == 1) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'Company',
                                    'id': data
                                });
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.loadCompanies();
                                this.formSubmitAttempt = false;
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                case DBOperation.delete:
                    this._reservationService.delete(Global.BASE_COMPANY_ENDPOINT,  formData.value.Id).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Company successfully deleted.");
                                this.modalRef.hide();
                                this.loadCompanies();
                                this.formSubmitAttempt = false;
                            } else {
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
            this.validateAllFields(company);
        }
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.companyForm.enable() : this.companyForm.disable();
    }
}
