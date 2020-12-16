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
import { Account, EntityMock } from 'src/app/Model/Account/account';
import { AccountTransValuesService } from 'src/app/Service/accountTransValues.service';
import { FileService } from 'src/app/Service/file.service';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { ToastrService } from 'ngx-toastr';

// Accessing global variable
type CSV = any[][];
declare var $: any;

@Component({
    templateUrl: './journalVoucher.component.html',
    styleUrls: ['./journaVoucher.component.css']
})

export class JournalVouchercomponent implements OnInit {
    @ViewChild("template") TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    @ViewChild('fileInput') fileInput: ElementRef;

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
    dropMessage: string = "Upload Reference File";
    toExportData: CSV = [
        ["Journal Voucher of " + this.date.transform(new Date, "dd-MM-yyyy")],
        ['Date', 'Particular', 'Voucher Type', 'Voucher No.', 'Debit Amount', 'Credit Amount']
    ];
    toExportFileName: string = 'Journal-voucher-' + this.date.transform(new Date, "dd-MM-yyyy") + '.xlsx';
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    fileUrl: string = '';
    settings = {
        bigBanner: false,
        timePicker: false,
        format: 'dd/MM/yyyy',
        defaultOpen: false
    };

    public account: Observable<Account>;
    public journalFrm: FormGroup;
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

    constructor(
        private fb: FormBuilder, private _journalvoucherService: JournalVoucherService,
        private _accountTransValues: AccountTransValuesService, private date: DatePipe,
        private modalService: BsModalService,
        private fileService: FileService,
        private toastrService: ToastrService
    ) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = this.currentYear['NepaliStartDate'];
        this.toDate = this.currentYear['NepaliEndDate'];
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' }
        ];
    }

    ngOnInit(): void {
        // Initialize reactive form 
        this.journalFrm = this.fb.group({
            Id: [''],
            Name: ['',],
            AccountTransactionDocumentId: [''],
            Description: [''],
            Amount: [''],
            Date: ['', Validators.compose([Validators.required, this.nepaliDateValidator])],
            drTotal: [''],
            crTotal: [''],
            AccountTransactionValues: this.fb.array([this.initAccountValue()]),
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: ['']
        });

        // Load list of journal vouchers
        this.loadJournalVoucherList(this.fromDate, this.toDate);
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
        filename = filename ? filename + '.xls' : 'Journal Voucher of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
    loadJournalVoucherList(sfromdate: string, stodate: string) {
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

        this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT&AccountGeneral=AG')
            .subscribe(at => {
                this.account = at;
            },
                error => this.msg = <any>error);

        this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 5)
            .subscribe(
                journalVoucher => {
                    this.indLoading = false;
                    journalVoucher.map((voucher) => voucher['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + voucher.Id + '&ApplicationModule=JournalVoucher');

                    console.log('the journals are', journalVoucher)
                    return this.journalVoucher = journalVoucher;
                },
                error => this.msg = <any>error
            );
    }

    /**
     * Open Add New Journal Voucher Form Modal
     */
    addJournalVoucher() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Journal";
        this.modalBtnTitle = "Save";
        this.reset();
        this.journalFrm.controls['Name'].setValue("Journal");
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    /**
     * Gets individual journal voucher
     * @param Id 
     */
    getJournalVoucher(Id: number) {
        this.indLoading = true;
        return this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?TransactionId=' + Id);
    }

    /**
     * Opens Edit Existing Journal Voucher Form Modal
     * @param Id {String} Voucher Id
     */
    editJournalVoucher(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Journal";
        this.modalBtnTitle = "Save";
        this.reset();
        this.getJournalVoucher(Id)
            .subscribe((journalVoucher: AccountTrans) => {
                console.log('the journal voucher is', journalVoucher)
                this.indLoading = false;
                this.journalFrm.controls['Id'].setValue(journalVoucher.Id);
                // this.journalFrm.controls['Name'].setValue(journalVoucher.Name);
                this.journalFrm.controls['Name'].setValue(journalVoucher.Name);

                this.journalFrm.controls['Date'].setValue(journalVoucher.AccountTransactionValues[0]['NVDate']);
                this.journalFrm.controls['AccountTransactionDocumentId'].setValue(journalVoucher.AccountTransactionDocumentId);
                this.journalFrm.controls['Description'].setValue(journalVoucher.Description);
                this.journalFrm.controls['Amount'].setValue(journalVoucher.Amount);
                this.journalFrm.controls['drTotal'].setValue(journalVoucher.drTotal);
                this.journalFrm.controls['crTotal'].setValue(journalVoucher.crTotal);
                this.journalFrm.controls['AccountTransactionValues'] = this.fb.array([]);
                const control = <FormArray>this.journalFrm.controls['AccountTransactionValues'];

                for (let i = 0; i < journalVoucher.AccountTransactionValues.length; i++) {
                    // this.currentaccount = this.account.filter(x => x.Id === journalVoucher.AccountTransactionValues[i]["AccountId"])[0];
                    const account = this.account.find(x => x.Id === journalVoucher.AccountTransactionValues[i].AccountId);
                    let valuesFromServer = journalVoucher.AccountTransactionValues[i];
                    let instance = this.fb.group(valuesFromServer);
                    console.log('accountis', account);
                    // if (this.currentaccount !== undefined) {
                        // instance.controls["AccountId"].setValue(this.currentaccount.Name);
                        instance.controls["AccountId"].setValue(account);
                    // }

                    if (valuesFromServer['entityLists'] === "Dr") {
                        instance.controls['Credit'].disable();
                    }

                    if (valuesFromServer['entityLists'] === "Cr") {
                        instance.controls['Debit'].disable();
                    }

                    instance.controls["Debit"].setValue(journalVoucher.AccountTransactionValues[i].Debit);
                    instance.controls["Credit"].setValue(journalVoucher.AccountTransactionValues[i].Credit);
                    instance.controls["Description"].setValue(journalVoucher.AccountTransactionValues[i].Description);

                    control.push(instance);
                }

                console.log('the control after push is', control);
                this.modalRef = this.modalService.show(this.TemplateRef, {
                    backdrop: 'static',
                    keyboard: false,
                    class: 'modal-xl'
                });
            },
                error => this.msg = <any>error);
    }

    /**
     * Delete Existing Journal Voucher
     * @param id 
     */
    deleteJournalVoucher(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Journal";
        this.modalBtnTitle = "Delete";
        this.getJournalVoucher(id)
            .subscribe((journalVoucher: AccountTrans) => {
                this.indLoading = false;
                this.journalFrm.controls['Id'].setValue(journalVoucher.Id);
                this.journalFrm.controls['Name'].setValue(journalVoucher.Name);
                // this.journalFrm.controls['Name'].setValue(journalVoucher.AccountTransactionType);

                this.journalFrm.controls['AccountTransactionDocumentId'].setValue(journalVoucher.AccountTransactionDocumentId);
                this.journalFrm.controls['Description'].setValue(journalVoucher.Description);
                this.journalFrm.controls['Amount'].setValue(journalVoucher.Amount);
                this.journalFrm.controls['drTotal'].setValue(journalVoucher.drTotal);
                this.journalFrm.controls['crTotal'].setValue(journalVoucher.crTotal);
                // this.journalFrm.controls['Date'].setValue(new Date(journalVoucher.AccountTransactionValues[0]['Date']));
                this.journalFrm.controls['Date'].setValue(journalVoucher.AccountTransactionValues[0]['NVDate']);

                this.journalFrm.controls['AccountTransactionValues'] = this.fb.array([]);
                const control = <FormArray>this.journalFrm.controls['AccountTransactionValues'];

                for (let i = 0; i < journalVoucher.AccountTransactionValues.length; i++) {
                    // this.currentaccount = this.account.filter(x => x.Id === journalVoucher.AccountTransactionValues[i]["AccountId"])[0];
                    const account = this.account.find(x => x.Id === journalVoucher.AccountTransactionValues[i].AccountId);

                    let valuesFromServer = journalVoucher.AccountTransactionValues[i];
                    let instance = this.fb.group(valuesFromServer);

                    if (valuesFromServer['entityLists'] === "Dr") {
                        instance.controls['Credit'].disable();
                    } else if (valuesFromServer['entityLists'] === "Cr") {
                        instance.controls['Debit'].disable();
                    }
                    // if (this.currentaccount !== undefined) {
                        // instance.controls["AccountId"].setValue(this.currentaccount.Name);
                        instance.controls["AccountId"].setValue(account);
                    // }

                    instance.controls["Debit"].setValue(journalVoucher.AccountTransactionValues[i].Debit);
                    instance.controls["Credit"].setValue(journalVoucher.AccountTransactionValues[i].Credit);
                    instance.controls["Description"].setValue(journalVoucher.AccountTransactionValues[i].Description);
                    control.push(instance);
                }
                this.modalRef = this.modalService.show(this.TemplateRef, {
                    backdrop: 'static',
                    keyboard: false,
                    class: 'modal-xl'
                });
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
            Debit: ['', Validators.required],
            Credit: ['', Validators.required],
            Description: ['']
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
        // updated one
        // let controls = <FormArray>this.journalFrm.controls['AccountTransactionValues'];
        // controls.removeAt(i);


        let controls = <FormArray>this.journalFrm.controls['AccountTransactionValues'];
        let controlToRemove = this.journalFrm.controls.AccountTransactionValues['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        let currentaccountid = controlToRemove.Id.value;

        if (currentaccountid != "0") {
            this._accountTransValues.delete(Global.BASE_JOURNAL_ENDPOINT, currentaccountid)
                .subscribe(
                    data => {   
                        (data == 1) && controls.removeAt(i);
                        this.toastrService.success('Data removed successfully!');
                    }
                );
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
        let journal = this.journalFrm;

        this.formSubmitAttempt = true;

        // if (!this.voucherDateValidator(journal.get('Date').value)) {
        //     return false;
        // }

        journal.get('FinancialYear').setValue(this.currentYear['Name'] || '');
        journal.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
        journal.get('CompanyCode').setValue(this.company && this.company['BranchCode'] || '');

        if (journal.valid) {
            let totalDebit = this.sumDebit();
            let totalCredit = this.sumCredit();

            if (totalDebit != totalCredit || totalDebit == 0 || totalCredit == 0) {
                alert("Debit and Credit are not Equal | Value must be greater than Amount Zero.");
                return;
            }
            const control = this.journalFrm.controls['AccountTransactionValues'].value;
            const controls = <FormArray>this.journalFrm.controls['AccountTransactionValues'];

            let accountList = [];
            control.forEach(account => {
                let Id = account.AccountId.Id;
                account.AccountId  = Id;

                accountList.push(account);
            });


            console.log('the list of the details are', accountList);
            // for (var i = 0; i < control.length; i++) {
            //     let Id = control[i]['Id'];
            //     if (Id > 0) {
            //         let CurrentAccount = control[i]['AccountId'];
            //         this.currentaccount = this.account.filter(x => x.Name === CurrentAccount)[0];
            //         let CurrentAccountId = this.currentaccount.Id;
            //         let currentaccountvoucher = control[i];
            //         let instance = this.fb.group(currentaccountvoucher);
            //         instance.controls["AccountId"].setValue(CurrentAccountId);
            //         controls.push(instance);
            //     }
            //     else {
            //         let xcurrentaccountvoucher = control[i]['AccountId'];
            //         let currentaccountvoucher = control[i];
            //         let instance = this.fb.group(currentaccountvoucher);
            //         this.currentaccount = this.account.filter(x => x.Name === xcurrentaccountvoucher.Name)[0];
            //         instance.controls["AccountId"].setValue(this.currentaccount.Id.toString());
            //         controls.push(instance);
            //     }
            // }
            let JournalObject = {
                Id: this.journalFrm.controls['Id'].value,
                Date: this.journalFrm.controls['Date'].value,
                Name: this.journalFrm.controls['Name'].value,
                AccountTransactionDocumentId: this.journalFrm.controls['AccountTransactionDocumentId'].value,
                Description: this.journalFrm.controls['Description'].value,
                Amount: this.journalFrm.controls['Amount'].value,
                drTotal: this.journalFrm.controls['drTotal'].value,
                crTotal: this.journalFrm.controls['crTotal'].value,
                FinancialYear: this.journalFrm.controls['FinancialYear'].value,
                UserName: this.journalFrm.controls['UserName'].value,
                CompanyCode: this.journalFrm.controls['CompanyCode'].value,
                // AccountTransactionValues: this.journalFrm.controls['AccountTransactionValues'].value
                AccountTransactionValues: accountList
            }
            switch (this.dbops) {
                case DBOperation.create:
                    this._journalvoucherService.post(Global.BASE_JOURNALVOUCHER_ENDPOINT, JournalObject)
                        .subscribe(
                            async (data) => {
                                if (data > 0) {
                                    // file upload stuff goes here
                                    let upload = await fileUpload.handleFileUpload({
                                        'moduleName': 'JournalVoucher',
                                        'id': data
                                    });

                                    if (upload == 'error') {
                                        alert('There is error uploading file!');
                                    }

                                    if (upload == true || upload == false) {
                                        this.modalRef.hide();
                                        this.formSubmitAttempt = false;
                                        this.reset();
                                    }
                                    alert('Data saved successfully!');
                                    this.modalRef.hide();
                                    this.loadJournalVoucherList(this.fromDate, this.toDate);
                                } else {
                                    alert("There is some issue in saving records, please contact to system administrator!");
                                }
                            });
                    break;
                case DBOperation.update:
                    this._journalvoucherService.put(Global.BASE_JOURNALVOUCHER_ENDPOINT, journal.value.Id, JournalObject).subscribe(
                        async (data) => {
                            if (data > 0) {
                                // file upload stuff goes here
                                let upload = await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });

                                if (upload == 'error') {
                                    alert('There is error uploading file!');
                                }

                                if (upload == true || upload == false) {
                                    this.modalRef.hide();
                                    this.formSubmitAttempt = false;
                                    this.reset();
                                }
                                alert('Data updated successfully!');
                                this.modalRef.hide();
                                this.loadJournalVoucherList(this.fromDate, this.toDate);
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                    );
                    break;
                case DBOperation.delete:
                    console.log(JournalObject);
                    
                    this._journalvoucherService.delete(Global.BASE_JOURNALVOUCHER_ENDPOINT, JournalObject).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully deleted.");
                                this.loadJournalVoucherList(this.fromDate, this.toDate);
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                            this.journalFrm.reset();
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
        this.journalFrm.controls['Id'].reset();
        this.journalFrm.controls['Date'].reset();
        this.journalFrm.controls['drTotal'].reset();
        this.journalFrm.controls['crTotal'].reset();
        this.journalFrm.controls['Description'].reset();
        this.journalFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        this.addAccountValues();
    }

    /**
     * Sets control's state
     * @param isEnable 
     */
    SetControlsState(isEnable: boolean) {
        isEnable ? this.journalFrm.enable() : this.journalFrm.disable();
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
        limitTo: 1000,
        height: '200px'
    };
    DropdownChange($event, i: number) {
        var ii = i;
        console.log($event);
        if ($event != null) {
            this.account = $event;
            var s2name = $event.value.Id;
        }
    };
}