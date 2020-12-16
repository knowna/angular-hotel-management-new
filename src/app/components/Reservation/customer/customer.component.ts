import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { Customer, CustomerType } from 'src/app/Model/customer.model';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';

@Component({
    templateUrl: './customer.component.html'
})

export class ReservationCustomerComponent implements OnInit {
    customers: Customer[];
    customerTypes: CustomerType[];
    customer: Customer;
    msg: string;
    isLoading: boolean = false;
    customerForm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;
    public company: any = {};
    
    constructor(
        private fb: FormBuilder, 
        private _customerService: AccountTransactionTypeService, 
        private modalService: BsModalService, 
        private date: DatePipe
    ) { this.company = JSON.parse(localStorage.getItem('company'));}

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            Id: [''],
            Title: ['', Validators.required],
            FirstName: ['', Validators.required],
            MiddleName: ['',],
            LastName: [''],
            Email: ['', Validators.compose([Validators.required, this.emailValidator])],
            MobileNumber: ['', Validators.required],
            Country: ['', Validators.required],
            CustomerTypeId: ['', Validators.required],
            MemberId: ['1001', Validators.required],
            MemberSince: [new Date(), Validators.required]
        });
        this.LoadCustomers();
    }
    
    LoadCustomers(): void {
        this.isLoading = true;
        this._customerService.get(Global.BASE_CUSTOMER_TYPES_ENDPOINT)
            .subscribe(customerTypes => { this.customerTypes = customerTypes; this.isLoading = false; },
            error => this.msg = <any>error);
        this._customerService.get(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT)
            .subscribe(customers => { 
                this.customers = customers; 
                this.isLoading = false; 
            },
            error => this.msg = <any>error);
    }

    openModal(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Customer";
        this.modalBtnTitle = "Save";
        this.customerForm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-lg'});
    }

    editDepartment(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Customer";
        this.modalBtnTitle = "Save";
        this.customer = this.customers.filter(x => x.Id == id)[0];
        this.customerForm.controls.Id.setValue(this.customer.Id);
        this.customerForm.controls.Title.setValue(this.customer.Title);
        this.customerForm.controls.FirstName.setValue(this.customer.FirstName);
        this.customerForm.controls.MiddleName.setValue(this.customer.MiddleName);
        this.customerForm.controls.LastName.setValue(this.customer.LastName);
        this.customerForm.controls.Email.setValue(this.customer.Email);
        this.customerForm.controls.MobileNumber.setValue(this.customer.MobileNumber);
        this.customerForm.controls.Country.setValue(this.customer.Country);
        this.customerForm.controls.CustomerTypeId.setValue(this.customer.CustomerTypeId);
        this.customerForm.controls.MemberId.setValue(this.customer.MemberId);
        this.customerForm.controls.MemberSince.setValue(new Date(this.customer.MemberSince));
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-lg'});
    }

    deleteDepartment(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Customer";
        this.modalBtnTitle = "Delete";
        this.customer = this.customers.filter(x => x.Id == id)[0];
        this.customerForm.controls.Id.setValue(this.customer.Id);
        this.customerForm.controls.Title.setValue(this.customer.Title);
        this.customerForm.controls.FirstName.setValue(this.customer.FirstName);
        this.customerForm.controls.MiddleName.setValue(this.customer.MiddleName);
        this.customerForm.controls.LastName.setValue(this.customer.LastName);
        this.customerForm.controls.Email.setValue(this.customer.Email);
        this.customerForm.controls.MobileNumber.setValue(this.customer.MobileNumber);
        this.customerForm.controls.Country.setValue(this.customer.Country);
        this.customerForm.controls.CustomerTypeId.setValue(this.customer.CustomerTypeId);
        this.customerForm.controls.MemberId.setValue(this.customer.MemberId);
        this.customerForm.controls.MemberSince.setValue(new Date(this.customer.MemberSince));        
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class: 'modal-lg'});
    }

    emailValidator(control: FormControl) {
        let email = control.value;
        let pattern = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g);
        let isValid = pattern.test(email);
        if (!isValid) {
            return {
                Invalidemail: 'The email is not valid'
            }
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
        let departfrm = this.customerForm;
        console.log(departfrm.value);
        ' '
        if (departfrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._customerService.post(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.LoadCustomers();
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
                    this._customerService.put(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT, formData.value.Id, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.LoadCustomers();
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
                    this._customerService.delete(Global.BASE_RESERVATION_CUSTOMER_ENDPOINT, formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");
                                this.modalRef.hide();
                                this.LoadCustomers();
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
        isEnable ? this.customerForm.enable() : this.customerForm.disable();
    }
    /**
     * Export formatter table in excel
     * @param tableID 
     * @param filename 
     */
    exportTableToExcel(tableID, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var clonedtable = $('#' + tableID);
        var clonedHtml = clonedtable.clone();
        $(clonedtable).find('.export-no-display').remove();
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        $('#' + tableID).html(clonedHtml.html());

        // Specify file name
        filename = filename ? filename + '.xls' : 'Reservation Customer of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }

}
