import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Rx';
import * as XLSX from 'xlsx';



import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AccountTrans } from 'src/app/Model/AccountTransaction/accountTrans';
import { DBOperation } from 'src/app/Shared/enum';
import { Global } from 'src/app/Shared/global';
import { EntityMock, Account } from 'src/app/Model/Account/account';
import { AccountTransValuesService } from 'src/app/Service/accountTransValues.service';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { FileService } from 'src/app/Service/file.service';

type CSV = any[][];
@Component({
    moduleId: module.id,
    templateUrl: 'debit-note.component.html',
    styleUrls: ['./debit-note.component.css']
})

export class DebitNoteComponent implements OnInit {
    @ViewChild("template") TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    @ViewChild('fileInput') fileInput: ElementRef;

    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    debitNote: AccountTrans[];
    journalVouchers: AccountTrans;
    formattedDate: any;
    dbops: DBOperation;
    indLoading: boolean = false;
    msg: string;
    modalTitle: string;
    modalBtnTitle: string;
    dropMessage: string = "Upload Reference File";
    toExportData: CSV = [
        ["Debit Note of " + this.date.transform(new Date, "dd-MM-yyyy")],
        ['Date', 'Particular', 'Debit Note', 'Credit Note No.', 'Debit Amount', 'Credit Amount']
    ];
    toExportFileName: string = 'Journal-voucher-' + this.date.transform(new Date, "dd-MM-yyyy") + '.xlsx';
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    fileUrl: string = '';
    file: any[] = [];

    public account: Observable<Account>;
    public debitNoteFrm: FormGroup;
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

    public currentaccount: Account;
    public vdate: string;

    constructor(
        private fb: FormBuilder, private _journalvoucherService: JournalVoucherService,
        private _accountTransValues: AccountTransValuesService, private date: DatePipe,
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
        this._journalvoucherService.getAccounts()
            .subscribe(accountsList => { this.account = accountsList });
    }

    // Override init component life-cycle hook
    ngOnInit(): void {
        // Initialize reactive form 
        this.debitNoteFrm = this.fb.group({
            Id: [''],
            Name: ['',],
            AccountTransactionDocumentId: [''],
            Description: [''],
            Amount: [''],
            Date: ['', Validators.compose([Validators.required, this.nepaliDateValidator])],
            SourceAccountTypeId: [''],
            TargetAccountTypeId: [''],
            drTotal: [''],
            crTotal: [''],
            AccountTransactionValues: this.fb.array([this.initAccountValue()]),
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: ['']
        });

        // Load list of Debit Note
        this.loadDebitNoteList(this.fromDate, this.toDate);
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
     * Display file in modal
     * @param fileUrl 
     * @param template 
     */
    viewFile(fileUrl, template: TemplateRef<any>) {
        this.fileUrl = fileUrl;
        this.modalTitle = "View Attachment";
        this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-lg' });
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
    loadDebitNoteList(sfromdate: string, stodate: string) {
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

        this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 12)
            .subscribe(
            debitNote => {
                this.indLoading = false;
                debitNote.map((voucher) => voucher['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + voucher.Id + '&ApplicationModule=JournalVoucher');
                return this.debitNote = debitNote;
            },
            error => this.msg = <any>error);
    }

    /**
     * Exports the journal voucher data in CSV/ Excel format
     */
    exportDebitNote(): void {
        if (this.debitNote.length) {
            // Remove existing journal data
            this.toExportData.splice(2, this.toExportData.length - 2);
            // Prepare CSV Data
            this.debitNote.forEach((voucher: AccountTrans) => {
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
    addDebitNote() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Debit Note";
        this.modalBtnTitle = "Save";
        this.reset();
        this.debitNoteFrm.controls['Name'].setValue("Debit Note");
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
    getDebitNote(Id: number) {
        this.indLoading = false;
        return this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?TransactionId=' + Id);
    }

    /**
     * Opens Edit Existing Credit Note Voucher Form Modal
     * @param Id {String} Voucher Id
     */
    editDebitNote(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Debit Note";
        this.modalBtnTitle = "Save";
        this.getDebitNote(Id)
            .subscribe((debitNote: AccountTrans) => {
                this.indLoading = false;
                this.debitNoteFrm.controls['Id'].setValue(debitNote.Id);
                this.debitNoteFrm.controls['Name'].setValue(debitNote.Name);
                this.debitNoteFrm.controls['Date'].setValue(debitNote.AccountTransactionValues[0]['NVDate']);
                this.debitNoteFrm.controls['AccountTransactionDocumentId'].setValue(debitNote.AccountTransactionDocumentId);
                this.debitNoteFrm.controls['Description'].setValue(debitNote.Description);
                this.debitNoteFrm.controls['Amount'].setValue(debitNote.Amount);
                this.debitNoteFrm.controls['drTotal'].setValue(debitNote.drTotal);
                this.debitNoteFrm.controls['crTotal'].setValue(debitNote.crTotal);
                this.debitNoteFrm.controls['AccountTransactionValues'] = this.fb.array([]);
                const control = <FormArray>this.debitNoteFrm.controls['AccountTransactionValues'];

                for (let i = 0; i < debitNote.AccountTransactionValues.length; i++) {
                    this.currentaccount = this.account.filter(x => x.Id === debitNote.AccountTransactionValues[i]["AccountId"])[0];
                    let valuesFromServer = debitNote.AccountTransactionValues[i];
                    let instance = this.fb.group(valuesFromServer);
                    if (this.currentaccount !== undefined) {
                        instance.controls["AccountId"].setValue(this.currentaccount.Name);
                    }

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
            },
            error => this.msg = <any>error);
    }

    /**
     * Delete Existing Credit Note Voucher
     * @param id 
     */
    deleteDebitNote(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Debit Note?";
        this.modalBtnTitle = "Delete";
        this.getDebitNote(id)
            .subscribe((debitNote: AccountTrans) => {
                this.indLoading = false;
                this.debitNoteFrm.controls['Id'].setValue(debitNote.Id);
                this.debitNoteFrm.controls['Name'].setValue(debitNote.Name);
                this.debitNoteFrm.controls['AccountTransactionDocumentId'].setValue(debitNote.AccountTransactionDocumentId);
                this.debitNoteFrm.controls['Description'].setValue(debitNote.Description);
                this.debitNoteFrm.controls['Amount'].setValue(debitNote.Amount);
                this.debitNoteFrm.controls['drTotal'].setValue(debitNote.drTotal);
                this.debitNoteFrm.controls['crTotal'].setValue(debitNote.crTotal);
                this.debitNoteFrm.controls['Date'].setValue(debitNote.AccountTransactionValues[0]['NVDate']);
                this.debitNoteFrm.controls['AccountTransactionValues'] = this.fb.array([]);
                const control = <FormArray>this.debitNoteFrm.controls['AccountTransactionValues'];

                for (let i = 0; i < debitNote.AccountTransactionValues.length; i++) {
                    this.currentaccount = this.account.filter(x => x.Id === debitNote.AccountTransactionValues[i]["AccountId"])[0];
                    let valuesFromServer = debitNote.AccountTransactionValues[i];
                    let instance = this.fb.group(valuesFromServer);
                    if (this.currentaccount !== undefined) {
                        instance.controls["AccountId"].setValue(this.currentaccount.Name);
                    }

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
            });
    }

    /**
     * Initializes Account values 
     */
    initAccountValue() {
        //initialize our vouchers
        return this.fb.group({
            AccountId: ['', Validators.required],
            entityLists: ['', Validators.required],
            Debit: ['', Validators.required],
            Credit: ['', Validators.required],
            Description: ['']
        });
    }

    // Push Account Values in row
    addAccountValues() {
        const control = <FormArray>this.debitNoteFrm.controls['AccountTransactionValues'];
        const addJournalVoucher = this.initAccountValue();
        control.push(addJournalVoucher);
    }

    //remove the rows//
    removeAccount(i: number) {
        let controls = <FormArray>this.debitNoteFrm.controls['AccountTransactionValues'];
        let controlToRemove = this.debitNoteFrm.controls.AccountTransactionValues['controls'][i].controls;
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
        let controls = this.debitNoteFrm.controls.AccountTransactionValues.value;

        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    }

    //calculate the sum of credit columns//
    sumCredit() {
        let controls = this.debitNoteFrm.controls.AccountTransactionValues.value;

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
        let journal = this.debitNoteFrm;

        this.formSubmitAttempt = true;
        if (!this.voucherDateValidator(journal.get('Date').value)) {
            return false;
        }

        journal.get('FinancialYear').setValue(this.currentYear['Name'] || '');
        journal.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
        journal.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');

        if (journal.valid) {
            let totalDebit = this.sumDebit();
            let totalCredit = this.sumCredit();

            if (totalDebit != totalCredit || totalDebit == 0 || totalCredit == 0) {
                alert("Debit and Credit are not Equal | Value must be greater than Amount Zero.");
                return;
            }
            const control = <FormArray>this.debitNoteFrm.controls['AccountTransactionValues'].value;
            const controls = <FormArray>this.debitNoteFrm.controls['AccountTransactionValues'];
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
            let journalObj = {
                Id: this.debitNoteFrm.controls['Id'].value,
                Date: this.debitNoteFrm.controls['Date'].value,
                Name: this.debitNoteFrm.controls['Name'].value,
                AccountTransactionDocumentId: this.debitNoteFrm.controls['AccountTransactionDocumentId'].value,
                Description: this.debitNoteFrm.controls['Description'].value,
                Amount: this.debitNoteFrm.controls['Amount'].value,
                drTotal: this.debitNoteFrm.controls['drTotal'].value,
                crTotal: this.debitNoteFrm.controls['crTotal'].value,
                FinancialYear: this.debitNoteFrm.controls['FinancialYear'].value,
                UserName: this.debitNoteFrm.controls['UserName'].value,
                CompanyCode: this.debitNoteFrm.controls['CompanyCode'].value,
                AccountTransactionValues: this.debitNoteFrm.controls['AccountTransactionValues'].value
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
                                // this.openModal2(this.TemplateRef2);
                                this.loadDebitNoteList(this.fromDate, this.toDate);
                            } else {
                                console.log(this.debitNoteFrm.value);
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
                                // this.openModal2(this.TemplateRef2);
                                this.loadDebitNoteList(this.fromDate, this.toDate);
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
                    this._journalvoucherService.delete(Global.BASE_JOURNALVOUCHER_ENDPOINT, journalObj).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully deleted.");
                                this.loadDebitNoteList(this.fromDate, this.toDate);
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
        this.debitNoteFrm.controls['Id'].reset();
        this.debitNoteFrm.controls['Date'].reset();
        this.debitNoteFrm.controls['drTotal'].reset();
        this.debitNoteFrm.controls['crTotal'].reset();
        this.debitNoteFrm.controls['Description'].reset();
        this.debitNoteFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        this.addAccountValues();
    }

    /**
     * Sets control's state
     * @param isEnable 
     */
    SetControlsState(isEnable: boolean) {
        isEnable ? this.debitNoteFrm.enable() : this.debitNoteFrm.disable();
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
    config = {
        displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000
    };
}