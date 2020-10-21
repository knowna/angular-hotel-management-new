import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable } from 'rxjs/Rx';
import * as XLSX from 'xlsx';

import { Account } from '../../../Model/Account/account';
import { AccountTrans, AccountTransactionValues, EntityMock } from '../../../Model/AccountTransaction/accountTrans';
import { SaleBillingBook } from '../../../Model/SaleBook';
import { TicketReference } from '../../../Model/ticket.model';
import { FileService } from '../../../Service/file.service';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';


type CSV = any[][];

@Component({
    moduleId: module.id,
    templateUrl: 'credit-note.component.html',
    styleUrls: ['./credit-note.component.css']
})

export class CreditNoteComponent implements OnInit {
     @ViewChild("template",{static:false}) TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested',{static:false}) TemplateRef2: TemplateRef<any>;
    @ViewChild('fileInput',{static:false}) fileInput: ElementRef;

    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    creditNote: AccountTrans[];
    public TicketReferences: TicketReference[];
    journalVouchers: AccountTrans;
    formattedDate: any;
    dbops: DBOperation;
    indLoading: boolean = false;
    msg: string;
    modalTitle: string;
    modalBtnTitle: string;
    dropMessage: string = "Upload Reference File";
    toExportData: CSV = [
        ["Credit Note of " + this.date.transform(new Date, "dd-MM-yyyy")],
        ['Date', 'Particular', 'Credit Note', 'Credit Note No.', 'Debit Amount', 'Credit Amount']
    ];
    toExportFileName: string = 'Journal-voucher-' + this.date.transform(new Date, "dd-MM-yyyy") + '.xlsx';
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    fileUrl: string = '';
    file: any[] = [];

    public account: Observable<Account>;
    public customeraccount: Observable<Account>;
    salebillingbook: SaleBillingBook[];

    public cerditNoteFrm: FormGroup;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    public entityLists: EntityMock[];
    public fromDate: any;
    public toDate: any;
    public sfromDate: string;
    public stoDate: string;
    public currentYear: any = {};
    public currentUser: any = {};
    public company: any = {};

    public SourceAccountTypeId: string;
    public currentaccount: Account;
    public vdate: string;
    public currentvdate: string;

    constructor(
        private fb: FormBuilder,
        private _journalvoucherService: AccountTransactionTypeService
,
        private _accountTransValues: AccountTransactionTypeService,
        private _customerService: AccountTransactionTypeService,
        private _reservationService: AccountTransactionTypeService,
        private date: DatePipe,
        private modalService: BsModalService,
        private fileService: FileService
    ) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = this.currentYear['NepaliStartDate'];
        this.toDate = this.currentYear['NepaliEndDate'];
       
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' },
        ];
        this.FillCurrentCustomerInvoice();
    }

    // Override init component life-cycle hook
    ngOnInit(): void {
        // Initialize reactive form 
        this.cerditNoteFrm = this.fb.group({
            Id: [''],
            Name: ['',],
            AccountTransactionDocumentId: [''],
            Description: ['', Validators.required],
            Amount: [''],
            Date: ['', Validators.compose([Validators.required, this.nepaliDateValidator])],
            SourceAccountTypeId: [''],
            ref_invoice_number: ['', Validators.required],
            drTotal: [''],
            crTotal: [''],
            AccountTransactionValues: this.fb.array([this.initAccountValue()]),
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: ['']
        });

        // Load list of journal vouchers
        this.loadCreditNote(this.fromDate, this.toDate);
        this.getSaleBook();
    }

    getSaleBook() {
        
        this.indLoading = true;
        this._reservationService.get(Global.BASE_POSBILLING_API_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 11)
            .subscribe(data => {
                this.indLoading = false;
                this.salebillingbook = data;
            },
            error => this.msg = <any>error);
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
        }
    }

    clearFile() {
        this.fileInput.nativeElement.value = '';
    }

    voucherDateValidator(currentdate: string) {
        
        if (currentdate == "") {
            alert("Please enter the voucher date");
            return false;
        }
        let today = new Date;
        this._journalvoucherService.get(Global.BASE_NEPALIMONTH_ENDPOINT + '?NDate=' + currentdate)
            .subscribe(SB => {
                this.vdate = SB;
            },
                error => this.msg = <any>error);
        if (this.vdate === "undefined") {
            alert("Please enter the voucher valid date");
            return false;
        }
        let voucherDate = new Date(this.vdate);

        let tomorrow = new Date(today.setDate(today.getDate() + 1));

        let currentYearStartDate = new Date(this.currentYear.StartDate);
        let currentYearEndDate = new Date(this.currentYear.EndDate);

        if ((voucherDate < currentYearStartDate) || (voucherDate > currentYearEndDate) || voucherDate >= tomorrow) {
            alert("Date should be within current financial year's start date and end date inclusive");
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * View File
     * @param Id 
     */
    viewFile(fileUrl, template: TemplateRef<any>) {
        
        this.fileUrl = fileUrl;
        this.modalTitle = "View Attachment";
        this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-lg' });
    }
    /**
     * Gets Englishdate
     * @param Id 
     */
    getVoucherDate(currentdate: string) {
        this.indLoading = true;
        return this._journalvoucherService.get(Global.BASE_NEPALIMONTH_ENDPOINT + '?NDate=' + currentdate)
            .subscribe(SB => {
                this.vdate = SB; this.indLoading = false;
            },
                error => this.msg = <any>error);
    }
    /**
     * Load list of journal vouchers form the server
     */
    loadCreditNote(sfromdate: string, stodate: string) {
        
        this.indLoading = true;

        if (sfromdate == "undefined" || sfromdate == null) {
            alert("Enter Start Date");
            return false;
        }
        if (stodate == "undefined" || stodate == null) {
            alert("Enter End Date");
            return false;
        }
        if (this.nepaliDateStringValidator(stodate) === false) {
            alert("Enter Valid End Date");
            return false;
        }
        if (this.nepaliDateStringValidator(sfromdate) === false) {
            alert("Enter Valid Start Date");
            return false;
        }

        this.fromDate = sfromdate;
        this.toDate = stodate;
        this.sfromDate = sfromdate;
        this.stoDate = stodate;

        this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT&AccountGeneral=AG&CustomerId=C&CustomerType=CT')
            .subscribe(at => {
                this.account = at;
            },
            error => this.msg = <any>error);
        this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT&AccountGeneral=AG&CustomerId=C')
            .subscribe(at => {
                this.customeraccount = at;
            },
                error => this.msg = <any>error);
        this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 11)
            .subscribe(
            creditNote => {
                this.indLoading = false;
                creditNote.map((voucher) => voucher['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + voucher.Id + '&ApplicationModule=JournalVoucher');
                
                return this.creditNote = creditNote;
            },
            error => this.msg = <any>error
            );
    }

    /**
     * Exports the journal voucher data in CSV/ Excel format
     */
    exportCreditNote(): void {
        if (this.creditNote.length) {
            // Remove existing journal data
            this.toExportData.splice(2, this.toExportData.length - 2);
            // Prepare CSV Data
            this.creditNote.forEach((voucher: AccountTrans) => {
                let row: any = [voucher.VDate, voucher.Name, voucher.VType, voucher.VoucherNo, '', ''];
                this.toExportData.push(row);

                voucher.AccountTransactionValues.forEach((accountTrans: any) => {
                    let row = ['',
                        accountTrans.Name, '', '',
                        accountTrans.DebitAmount !== 0 ? accountTrans.DebitAmount.toFixed(2) : '',
                        accountTrans.CreditAmount !== 0 ? accountTrans.CreditAmount.toFixed(2) : '',
                        '', ''
                    ];
                    this.toExportData.push(row);
                })
            });
            /* generate worksheet */
            const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.toExportData);

            /* generate workbook and add the worksheet */
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            /* save to file */
            XLSX.writeFile(wb, this.toExportFileName);
        }
    }

    /**
     * Open Add New Credit Note Voucher Form Modal
     */
    addCreditNote() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Credit Note";
        this.modalBtnTitle = "Save";
        this.reset();
        this.cerditNoteFrm.controls['Name'].setValue("Credit Note");
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    /**
     * Gets individual journal voucher
     * @param Id 
     */
    getCreditNote(Id: number) {
        
        this.indLoading = false;
        return this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?TransactionId=' + Id);
    }

    /**
     * Opens Edit Existing Credit Note Voucher Form Modal
     * @param Id {String} Voucher Id
     */
    editCreditNote(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Credit Note";
        this.modalBtnTitle = "Update";
        this.getCreditNote(Id)
            .subscribe((creditNote: AccountTrans) => {
                
                //this.FillCurrentCustomerInvoice(creditNote.SourceAccountTypeId);
                this.indLoading = false;
                this.cerditNoteFrm.controls['Id'].setValue(creditNote.Id);
                this.cerditNoteFrm.controls['Name'].setValue(creditNote.Name);
                this.cerditNoteFrm.controls['AccountTransactionDocumentId'].setValue(creditNote.AccountTransactionDocumentId);
                this.cerditNoteFrm.controls['Date'].setValue(creditNote.AccountTransactionValues[0]['NVDate']);
                this.currentaccount = this.customeraccount.filter(x => x.Id === creditNote.SourceAccountTypeId)[0];
                if (this.currentaccount !== undefined) {
                    this.cerditNoteFrm.controls['SourceAccountTypeId'].setValue(this.currentaccount.Name);
                }
                this.cerditNoteFrm.controls['ref_invoice_number'].setValue(creditNote.ref_invoice_number);
                this.cerditNoteFrm.controls['Description'].setValue(creditNote.Description);
                this.cerditNoteFrm.controls['Amount'].setValue(creditNote.Amount);
                this.cerditNoteFrm.controls['drTotal'].setValue(creditNote.drTotal);
                this.cerditNoteFrm.controls['crTotal'].setValue(creditNote.crTotal);
                this.cerditNoteFrm.controls['AccountTransactionValues'] = this.fb.array([]);
                const control = <FormArray>this.cerditNoteFrm.controls['AccountTransactionValues'];

                for (let i = 0; i < creditNote.AccountTransactionValues.length; i++) {
                    let valuesFromServer = creditNote.AccountTransactionValues[i];
                    let instance = this.fb.group(valuesFromServer);

                    if (valuesFromServer['entityLists'] === "Dr") {
                        instance.controls['Credit'].disable();
                    }

                    if (valuesFromServer['entityLists'] === "Cr") {
                        instance.controls['Debit'].disable();
                    }
                    this.currentaccount = this.account.filter(x => x.Id === creditNote.AccountTransactionValues[i]["AccountId"])[0];
                    if (this.currentaccount !== undefined) {
                        instance.controls["AccountId"].setValue(this.currentaccount.Name);
                    }
                    control.push(instance);
                }
                this.modalRef = this.modalService.show(this.TemplateRef, {
                    backdrop: 'static',
                    keyboard: false,
                    class: 'modal-lg'
                });
            },
            error => this.msg = <any>error);
    }

    /**
     * Delete Existing Credit Note Voucher
     * @param id 
     */
    deleteCreditNote(id: number) {
        
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Credit Note?";
        this.modalBtnTitle = "Delete";
        this.getCreditNote(id)
            .subscribe((creditNote: AccountTrans) => {
                
                this.indLoading = false;
                this.cerditNoteFrm.controls['Id'].setValue(creditNote.Id);
                this.cerditNoteFrm.controls['Name'].setValue(creditNote.Name);
                this.cerditNoteFrm.controls['AccountTransactionDocumentId'].setValue(creditNote.AccountTransactionDocumentId);
                this.currentaccount = this.customeraccount.filter(x => x.Id === creditNote.SourceAccountTypeId)[0];
                if (this.currentaccount !== undefined) {
                    this.cerditNoteFrm.controls['SourceAccountTypeId'].setValue(this.currentaccount.Name);
                }
                this.cerditNoteFrm.controls['Description'].setValue(creditNote.Description);
                this.cerditNoteFrm.controls['Amount'].setValue(creditNote.Amount);
                this.cerditNoteFrm.controls['drTotal'].setValue(creditNote.drTotal);
                this.cerditNoteFrm.controls['crTotal'].setValue(creditNote.crTotal);
                this.cerditNoteFrm.controls['Date'].setValue(new Date(creditNote.AccountTransactionValues[0]['Date']));
                this.cerditNoteFrm.controls['AccountTransactionValues'] = this.fb.array([]);
                const control = <FormArray>this.cerditNoteFrm.controls['AccountTransactionValues'];

                for (let i = 0; i < creditNote.AccountTransactionValues.length; i++) {
                    let valuesFromServer = creditNote.AccountTransactionValues[i];
                    let instance = this.fb.group(valuesFromServer);

                    if (valuesFromServer['entityLists'] === "Dr") {
                        instance.controls['Credit'].disable();
                    }

                    if (valuesFromServer['entityLists'] === "Cr") {
                        instance.controls['Debit'].disable();
                    }
                    this.currentaccount = this.account.filter(x => x.Id === creditNote.AccountTransactionValues[i]["AccountId"])[0];
                    if (this.currentaccount !== undefined) {
                        instance.controls["AccountId"].setValue(this.currentaccount.Name);
                    }
                    control.push(instance);
                }
                this.modalRef = this.modalService.show(this.TemplateRef, {
                    backdrop: 'static',
                    keyboard: false,
                    class: 'modal-lg'
                });
            });
    }

    /**
     * Initializes Account values 
     */
    initAccountValue() {
        //initialize our vouchers
        return this.fb.group({
            entityLists: [''],
            AccountId: ['', Validators.required],
            Debit: ['', Validators.required],
            Credit: [''],
            Description: ['']
        });
    }

    // Push Account Values in row
    addAccountValues() {
        const control = <FormArray>this.cerditNoteFrm.controls['AccountTransactionValues'];
        const addJournalVoucher = this.initAccountValue();
        control.push(addJournalVoucher);
    }

    //remove the rows//
    removeAccount(i: number) {
        
        let controls = <FormArray>this.cerditNoteFrm.controls['AccountTransactionValues'];
        let controlToRemove = this.cerditNoteFrm.controls.AccountTransactionValues['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        let currentaccountid = controlToRemove.Id.value;

        if (currentaccountid != "0") {
            this._accountTransValues.delete(Global.BASE_JOURNAL_ENDPOINT, currentaccountid).subscribe(data => {
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
        let controls = this.cerditNoteFrm.controls.AccountTransactionValues.value;

        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    }

    //calculate the sum of credit columns//
    sumCredit() {
        let controls = this.cerditNoteFrm.controls.AccountTransactionValues.value;

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
        } else if (data.entityLists.value == 'Cr') {
            data.Credit.enable();
            data.Debit.disable();
            data.Debit.reset();
        } else {
            data.Debit.enable();
            data.Credit.enable();
        }
    }

    /**
     * Performs the form submit action for CRUD Operations
     * @param formData 
     */
    onSubmit(formData: any, fileUpload: any) {
        
        this.msg = "";
        let journal = this.cerditNoteFrm;

        this.formSubmitAttempt = true;

        if (!this.voucherDateValidator(journal.get('Date').value)) {
            return false;
        }

        journal.get('FinancialYear').setValue(this.currentYear['Name'] || '');
        journal.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
        journal.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');

        if (journal.valid) {
            
            const control = <FormArray>this.cerditNoteFrm.controls['AccountTransactionValues'].value;
            const controls = <FormArray>this.cerditNoteFrm.controls['AccountTransactionValues'];
            for (var i = 0; i < control.length; i++) {
                let Id = control[i]['Id'];
                if (Id > 0) {
                    let CurrentAccount = control[i]['AccountId'];
                    this.currentaccount = this.account.filter(x => x.Name === CurrentAccount)[0];
                    let CurrentAccountId = this.currentaccount.Id;
                    let currentaccountvoucher = control[i];
                    let instance = this.fb.group(currentaccountvoucher);
                    instance.controls["AccountId"].setValue(CurrentAccountId);
                    controls.push(instance);
                }
                else {
                    let xcurrentaccountvoucher = control[i]['AccountId'];
                    let currentaccountvoucher = control[i];
                    let instance = this.fb.group(currentaccountvoucher);
                    this.currentaccount = this.account.filter(x => x.Name === xcurrentaccountvoucher.Name)[0];
                    instance.controls["AccountId"].setValue(this.currentaccount.Id.toString());
                    controls.push(instance);
                }
            }

            let Id = journal.get('Id').value;
            if (Id > 0) {
                let CurrentAccount = journal.get('SourceAccountTypeId').value;
                this.currentaccount = this.customeraccount.filter(x => x.Name === CurrentAccount)[0];
                this.SourceAccountTypeId = this.currentaccount.Id.toString();
                journal.get('SourceAccountTypeId').setValue(this.SourceAccountTypeId);
            }
            else {
                let CurrentAccount = journal.get('SourceAccountTypeId').value;
                this.SourceAccountTypeId = CurrentAccount.Id;
                journal.get('SourceAccountTypeId').setValue(this.SourceAccountTypeId);
            }
            let journalObj = {
                Id: this.cerditNoteFrm.controls['Id'].value,
                Date: this.cerditNoteFrm.controls['Date'].value,
                Name: this.cerditNoteFrm.controls['Name'].value,
                AccountTransactionDocumentId: this.cerditNoteFrm.controls['AccountTransactionDocumentId'].value,
                SourceAccountTypeId: this.cerditNoteFrm.controls['SourceAccountTypeId'].value,
                ref_invoice_number: this.cerditNoteFrm.controls['ref_invoice_number'].value,
                Description: this.cerditNoteFrm.controls['Description'].value,
                Amount: this.cerditNoteFrm.controls['Amount'].value,
                drTotal: this.cerditNoteFrm.controls['drTotal'].value,
                crTotal: this.cerditNoteFrm.controls['crTotal'].value,
                FinancialYear: this.cerditNoteFrm.controls['FinancialYear'].value,
                UserName: this.cerditNoteFrm.controls['UserName'].value,
                CompanyCode: this.cerditNoteFrm.controls['CompanyCode'].value,
                AccountTransactionValues: this.cerditNoteFrm.controls['AccountTransactionValues'].value
            }

            switch (this.dbops) {
                case DBOperation.create:
                    this._journalvoucherService.post(Global.BASE_JOURNALVOUCHER_ENDPOINT, journalObj)
                        .subscribe(
                        async (data) => {
                            
                            if (data > 0) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });
                                this.loadCreditNote(this.fromDate, this.toDate);
                            }
                            else
                            {
                                alert("There is some issue in creating records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                            this.reset();
                        });
                    break;
                case DBOperation.update:
                    this._journalvoucherService.put(Global.BASE_JOURNALVOUCHER_ENDPOINT, journal.value.Id, journalObj).subscribe(
                        async (data) => {
                            if (data > 0) {
                                
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });
                                this.modalRef.hide();
                                this.loadCreditNote(this.fromDate, this.toDate);
                            } else {
                                alert("There is some issue in updating records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                            this.reset();
                        },
                    );
                    break;
                case DBOperation.delete:
                    this._journalvoucherService.delete(Global.BASE_JOURNALVOUCHER_ENDPOINT, journalObj.Id).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully deleted.");
                                this.loadCreditNote(this.fromDate, this.toDate);
                            } else {
                                alert("There is some issue in deleting records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                            this.reset();
                        },
                    );
            }
        } else {
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
        this.cerditNoteFrm.controls['Id'].reset();
        this.cerditNoteFrm.controls['Date'].reset();
        this.cerditNoteFrm.controls['drTotal'].reset();
        this.cerditNoteFrm.controls['crTotal'].reset();
        this.cerditNoteFrm.controls['Description'].reset();
        this.cerditNoteFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        this.addAccountValues();
    }

    /**
     * Sets control's state
     * @param isEnable 
     */
    SetControlsState(isEnable: boolean) {
        isEnable ? this.cerditNoteFrm.enable() : this.cerditNoteFrm.disable();
    }

    onFilterDateSelect(selectedDate) {
        
        let currentYearStartDate = new Date(this.currentYear.StartDate);
        let currentYearEndDate = new Date(this.currentYear.EndDate);

        if (selectedDate < currentYearStartDate) {
            this.fromDate = currentYearStartDate;
            alert("Date should not be less than current financial year's start date");
        }

        if (selectedDate > currentYearEndDate) {
            this.toDate = currentYearEndDate;
            alert("Date should not be greater than current financial year's end date");
        }
    }
    fillCustomerInvoice(event) {
        
        //let param = event.Id;
        let CustomerId = event.value.Id;
        this._journalvoucherService.get(Global.BASE_CREDITNOTEINVOICE_ENDPOINT + '?CustomerId=' + CustomerId)
            .subscribe(refcreditNote => {
                this.indLoading = false;
                return this.TicketReferences = refcreditNote;
            },
                error => this.msg = <any>error);
    }
    FillCurrentCustomerInvoice() {
        this._journalvoucherService.get(Global.BASE_CREDITNOTEINVOICE_ENDPOINT)
            .subscribe(refcreditNote => {
                this.indLoading = false;
                return this.TicketReferences = refcreditNote;
            },
                error => this.msg = <any>error);
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
    nepaliDateStringValidator(control: string) {
        let pattern = new RegExp(/(^[0-9]{4})\.([0-9]{2})\.([0-9]{2})/g);
        let isValid = pattern.test(control);
        if (!isValid) {
            return false;
        }
        else {
            return true;
        }
    }
    searchChange($event) {
        console.log($event);
    }
    searchChangeAccountId($event) {
        console.log($event);
    }
    config = {
        displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000
    };
    configAccount = {
        displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000
    };
}