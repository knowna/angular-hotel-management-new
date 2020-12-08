import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AccountTrans } from 'src/app/Model/AccountTransaction/accountTrans';
import { DBOperation } from 'src/app/Shared/enum';
import { Observable } from 'rxjs';
import { EntityMock } from 'src/app/Model/Account/account';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { AccountTransValuesService } from 'src/app/Service/accountTransValues.service';
import { Global } from 'src/app/Shared/global';

@Component({
    templateUrl: './journalVoucher.component.html',
    styleUrls:['./journaVoucher.component.css']
})


export class JournalVouchercomponent implements OnInit {
    @ViewChild("template") TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    journalVoucher: AccountTrans[];
    journalVouchers: AccountTrans;
    formattedDate: any;
    dbops: DBOperation;
    indLoading: boolean = false;
    msg: string;
    modalTitle: string;
    modalBtnTitle: string;
    
    public account: Observable<Account>;
    public journalFrm: FormGroup;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    public entityLists: EntityMock[];
    public fromDate: string;
    public toDate: string;

    public currentYear: any = {};
    public currentUser: any = {};
    public company: any = {};

    constructor(private fb: FormBuilder, private _journalvoucherService: JournalVoucherService, private _accountTransValues:AccountTransValuesService, private date: DatePipe, private modalService: BsModalService) {
        // this.fromDate = '01/01/2018';
        // this.toDate = '12/30/2018';
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = this.currentYear['NepaliStartDate'];
        this.toDate = this.currentYear['NepaliEndDate'];
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' }
        ];
        this._journalvoucherService.getAccounts()
            .subscribe(accountsList => { this.account = accountsList });
    }       

    // Overide init component life-cycle hook
    ngOnInit(): void {
        // Initialize reactive form 
        this.journalFrm = this.fb.group({
            Id: [''],
            Name: ['',],
            AccountTransactionDocumentId: [''],
            Description: [''],
            Amount: [''],
            Date: [''],
            drTotal: [''],
            crTotal: [''],
            AccountTransactionValues: this.fb.array([
                this.initAccountValue()
            ])
        });

        // Load list of journal vouchers
        this.loadJournalVoucherList();
    }

    /**
     * Load list of journal vouchers form the server
     */
    loadJournalVoucherList(): void {
        this.indLoading = true;
        this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionId=' + 5)
            .subscribe(journalVoucher => { 
                this.indLoading = false; 
                return this.journalVoucher = journalVoucher; 
            },
            error => this.msg = <any>error);
    }

    /**
     * Open Add New Journal Voucher Form Modal
     */
    addJournalVoucher() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Journal Voucher";
        this.modalBtnTitle = "Save";
        this.journalFrm.reset();
        this.journalFrm.controls['Name'].setValue("Journal");
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false, 
            class:'modal-lg'
        });
    }

    /**
     * Opens Edit Existing Journal Voucher Form Modal
     * @param Id {String} Voucher Id
     */
    editJournalVoucher(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit";
        this.modalBtnTitle = "Update";
        this.journalVouchers = this.journalVoucher.filter(x => x.Id == Id)[0];
        this.journalFrm.controls['Id'].setValue(this.journalVouchers.Id);
        this.journalFrm.controls['Name'].setValue(this.journalVouchers.Name);
        this.journalFrm.controls['AccountTransactionDocumentId'].setValue(this.journalVouchers.AccountTransactionDocumentId);
        this.journalFrm.controls['Description'].setValue(this.journalVouchers.Description);
        this.journalFrm.controls['Amount'].setValue(this.journalVouchers.Amount);
        this.journalFrm.controls['drTotal'].setValue(this.journalVouchers.drTotal);
        this.journalFrm.controls['crTotal'].setValue(this.journalVouchers.crTotal);
        this.formattedDate = this.date.transform(this.journalVouchers.Date, 'dd-MM-yyyy');
        this.journalFrm.controls['Date'].setValue(this.formattedDate);
        this.journalFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        const control = <FormArray>this.journalFrm.controls['AccountTransactionValues'];

        for (let i = 0; i < this.journalVouchers.AccountTransactionValues.length; i++) {
            let valuesFromServer = this.journalVouchers.AccountTransactionValues[i];
            let instance = this.fb.group(valuesFromServer);

            if (valuesFromServer['entityLists'] === "Dr") {
                instance.controls['Credit'].disable();
            } 
            
            if (valuesFromServer['entityLists'] === "Cr") {
                instance.controls['Debit'].disable();
            }

            control.push(instance);
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    /**
     * Delete Existing Journal Voucher
     */
    deleteJournalVoucher(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.journalVouchers = this.journalVoucher.filter(x => x.Id == id)[0];
        this.journalFrm.controls['Id'].setValue(this.journalVouchers.Id);
        this.journalFrm.controls['Name'].setValue(this.journalVouchers.Name);
        this.journalFrm.controls['AccountTransactionDocumentId'].setValue(this.journalVouchers.AccountTransactionDocumentId);
        this.journalFrm.controls['Date'].setValue(this.journalVouchers.Date);
        this.journalFrm.controls['Description'].setValue(this.journalVouchers.Description);
        this.journalFrm.controls['Amount'].setValue(this.journalVouchers.Amount);
        this.journalFrm.controls['drTotal'].setValue(this.journalVouchers.drTotal);
        this.journalFrm.controls['crTotal'].setValue(this.journalVouchers.crTotal);
        this.formattedDate = this.date.transform(this.journalVouchers.Date, 'dd/MM/yyyy');
        this.journalFrm.controls['Date'].setValue(this.formattedDate);
        this.journalFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        const control = <FormArray>this.journalFrm.controls['AccountTransactionValues'];

        for (let i = 0; i < this.journalVouchers.AccountTransactionValues.length; i++) {
            let valuesFromServer = this.journalVouchers.AccountTransactionValues[i];
            let instance = this.fb.group(valuesFromServer);

            if (valuesFromServer['entityLists'] === "Dr") {
                instance.controls['Credit'].disable();
            } else if (valuesFromServer['entityLists'] === "Cr") {
                instance.controls['Debit'].disable();
            }

            control.push(instance);
        }
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    /**
     * Initializes Account values 
     */
    initAccountValue() {
        //initialize our vouchers
        return this.fb.group({
            entityLists: ['', Validators.required],
            AccountId: ['', Validators.required],
            Debit: [''],
            Credit: [''],
        });
    }

    // Push Account Values in row
    addAccountValues() {
        const control = <FormArray>this.journalFrm.controls['AccountTransactionValues'];
        const addJournalVoucher = this.initAccountValue();
        control.push(addJournalVoucher);
    }

    //remove the rows//
    removeAccount(i: number) {
        let controls = <FormArray>this.journalFrm.controls['AccountTransactionValues'];
        let controlToRemove =  this.journalFrm.controls.AccountTransactionValues['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;
        
        if (selectedControl) {
            this._accountTransValues.delete(Global.BASE_JOURNAL_ENDPOINT, i).subscribe(data => {
                (data == 1) && controls.removeAt(i);
            });          
        } else {
            if (i >= 0) {
                controls.removeAt(i);
            } else {
                alert("Form requires at least one row");
            }
        }
    }


    //calulate the sum of debit columns//
    sumDebit() {

        let controls = this.journalFrm.controls.AccountTransactionValues.value;

        return controls.reduce(function (total: any, accounts: any) {

            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    }

    //calculate the sum of credit columns//
    sumCredit() {

        let controls = this.journalFrm.controls.AccountTransactionValues.value;

        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
        }, 0);
    }

    /**
     * Validate fields
     * @param formGroup 
     */
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
     * Open Modal
     * @param template 
     */
    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    }


    /**
     * Enable or Disable the form fields
     * @param data 
     */
    enableDisable(data: any) {
        if (data.entityLists.value == 'Dr') {
            data.Debit.enable();
            data.Credit.disable();
            data.Credit.reset();

        }
        else if
        (data.entityLists.value == 'Cr') {
            data.Credit.enable();
            data.Debit.disable();
            data.Debit.reset();
        }
        else {
            data.Debit.enable();
            data.Credit.enable();

        }
    }

    /**
     * Performs the form submit action for CRUD Operations
     * @param formData 
     */
    onSubmit(formData: any) {
        this.msg = "";
        let journal = this.journalFrm;
        this.formSubmitAttempt = true;
        if (journal.valid) {

            let totalDebit = this.sumDebit();
            let totalCredit = this.sumCredit();

            if (totalDebit != totalCredit) {
                alert("Debit Credit not equal");
                return;
            }
            switch (this.dbops) {
                case DBOperation.create:
                    this._journalvoucherService.post(Global.BASE_JOURNALVOUCHER_ENDPOINT, journal.value).subscribe(
                        data => {
                            if (data == 1) {

                                this.openModal2(this.TemplateRef2);                          
                                this.loadJournalVoucherList();
                            }

                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                           
                        }
                    );

                    break;
                case DBOperation.update:
                    let journalObj = {
                        Id: this.journalFrm.controls['Id'].value,
                        VoucherDate: this.journalFrm.controls['Date'].value,
                        Name: this.journalFrm.controls['Name'].value,
                        AccountTransactionDocumentId: this.journalFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.journalFrm.controls['Description'].value,
                        Amount: this.journalFrm.controls['Amount'].value,
                        drTotal: this.journalFrm.controls['drTotal'].value,
                        crTotal: this.journalFrm.controls['crTotal'].value,
                        AccountTransactionValues: this.journalFrm.controls['AccountTransactionValues'].value
                    }
                    this._journalvoucherService.put(Global.BASE_JOURNALVOUCHER_ENDPOINT, journal.value.Id, journalObj).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.openModal2(this.TemplateRef2);
                                this.loadJournalVoucherList();

                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },

                    );
                    break;
                case DBOperation.delete: 
                    let journalObjc = {
                        Id: this.journalFrm.controls['Id'].value,
                        VoucherDate: this.journalFrm.controls['Date'].value,
                        Name: this.journalFrm.controls['Name'].value,
                        AccountTransactionDocumentId: this.journalFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.journalFrm.controls['Description'].value,
                        Amount: this.journalFrm.controls['Amount'].value,
                        drTotal: this.journalFrm.controls['drTotal'].value,
                        crTotal: this.journalFrm.controls['crTotal'].value,
                        AccountTransactionValues: this.journalFrm.controls['AccountTransactionValues'].value
                    }               
              
                    this._journalvoucherService.delete(Global.BASE_JOURNALVOUCHER_ENDPOINT, journalObjc).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");                               
                                this.loadJournalVoucherList();
                              
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },
                       
                    );

            }

        }

        else {
            this.validateAllFields(journal);
        }


    }

    /**
     * Hides the confirm modal
     */
    confirm(): void {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    }

    /**
     * Resets the journal form
     */
    reset() {
        let control = this.journalFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.journalFrm.controls['Id'].reset();
            this.journalFrm.controls['Date'].reset();
            this.journalFrm.controls['drTotal'].reset();
            this.journalFrm.controls['crTotal'].reset();
            this.journalFrm.controls['Description'].reset();
            this.journalFrm.controls['AccountTransactionValues'].reset();
        }

    }

    /**
     * Sets control's state
     * @param isEnable 
     */
    SetControlsState(isEnable: boolean) {
        isEnable ? this.journalFrm.enable() : this.journalFrm.disable();
    }

    /**
     *  Get the list of filtered journals by the form and to date
     */
    filterJournalByDate () {
        this.indLoading = true;
        this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 5)
            .subscribe(journalVoucher => { 
                this.indLoading = false; 
                return this.journalVoucher = journalVoucher; 
            },
            error => this.msg = <any>error);
    }
}

