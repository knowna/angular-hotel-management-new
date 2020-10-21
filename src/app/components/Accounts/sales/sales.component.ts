import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AccountTrans, AccountTransactionValues, EntityMock } from '../../../Model/AccountTransaction/accountTrans';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';

// import * as XLSX from 'xlsx';import { FileService } from '../../../Service/file.service';

type CSV = any[][];

@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
    @ViewChild("template",{static:false}) TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested',{static:false}) TemplateRef2: TemplateRef<any>;
    //@ViewChild('fileInput',{static:false}) fileInput: ElementRef;

    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    public account;
    public salesForm: FormGroup;
    //purchases: AccountTrans;
    sales: AccountTrans[];
    dbops: DBOperation;
    msg: string;
    modalTitle: string;
    modalBtnTitle: string;
    indLoading: boolean = false;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    formattedDate: any;
    public entityLists: EntityMock[];
    public fromDate: any;
    public toDate: any;
    public sfromDate: string;
    public stoDate: string;
    public currentYear: any = {};
    public currentUser: any = {};
    public company: any = {};
    dropMessage: string = "Upload Reference File";
    toExportFileName: string = 'Sales Voucher of ' + this.date.transform(new Date, "dd-MM-yyyy") + '.xls';
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    fileUrl: string = '';
    journalDetailsFrm: any

    /**
     * Constructor
     * 
     * @param fb 
     * @param service 
     * @param date 
     * @param modalService 
     */
    constructor(
        private fb: FormBuilder, 
        private service: AccountTransactionTypeService, 
         
        private date: DatePipe, 
        private modalService: BsModalService,
        // private fileService: FileService
    ) {
        this.service.getAccounts().subscribe(data => { this.account = data });        
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
        this.salesForm = this.fb.group({
            Id: [''],
            Name: [''],
            AccountTransactionDocumentId: [''],
            Date: ['', Validators.required],
            Description: ['', Validators.required],
            Amount: [''],
            SalesOrderDetails: this.fb.array([this.initSalesOrderDetails()]),
            AccountTransactionValues: this.fb.array([this.initJournalDetail()]),
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: ['']
        });
        this.loadSaleList(this.fromDate, this.toDate);
    }

    voucherDateValidator(control: any) {
        let today = new Date;
        let tomorrow = new Date(today.setDate(today.getDate() + 1));

        if (!control.value) {
            alert("Please select the Voucher Date");
            return false;
        }

        let voucherDate = new Date(control.value);
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
    
    viewFile(fileUrl, template: TemplateRef<any>) {
        this.fileUrl = fileUrl;
        this.modalTitle = "View Attachment";
        this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-lg' });
    }

    /**
     * Exports the pOrder voucher data in CSV/ Excel format
     */
    exportTableToExcel(tableID, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var clonedtable = $('#'+ tableID);
        var clonedHtml = clonedtable.clone();
        $(clonedtable).find('.export-no-display').remove();
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        $('#' + tableID).html(clonedHtml.html());

        // Specify file name
        filename = filename ? filename + '.xls' : this.toExportFileName;

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

    loadSaleList(sfromdate: string, stodate: string) {
         
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
        this.service.get(Global.BASE_SALES_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 3)
            .subscribe(
            sales => {
                    sales.map((purch) => purch['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + purch.Id + '&ApplicationModule=JournalVoucher');
                    this.sales = sales; 
                    this.indLoading = false; 
                },
                error => this.msg = <any>error
            );
    }

    addSales() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Sales";
        this.modalBtnTitle = "Save";
        this.reset();
        this.salesForm.controls['Name'].setValue('Sales');
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    getSalesDetails(Id: number) {
         
        this.indLoading = true;
         return this.service.get(Global.BASE_SALES_ENDPOINT + '?TransactionId=' + Id);
    }

    /**
     * Opens Edit Existing Journal Voucher Form Modal
     * @param Id 
     */
    editPurchase(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Sales";
        this.modalBtnTitle = "Update";
        this.reset();
        this.getSalesDetails(Id)
            .subscribe((sales: AccountTrans) => {
                this.indLoading = false;
                this.salesForm.controls['Id'].setValue(sales.Id);
                this.salesForm.controls['Name'].setValue(sales.Name);
                this.salesForm.controls['AccountTransactionDocumentId'].setValue(sales.AccountTransactionDocumentId);
                this.salesForm.controls['Description'].setValue(sales.Description);
                this.formattedDate = new Date(sales.AccountTransactionValues[0]['Date']);
                this.salesForm.controls['Date'].setValue(this.formattedDate);

                this.salesForm.controls['SalesOrderDetails'] = this.fb.array([]);
                const control = <FormArray>this.salesForm.controls['SalesOrderDetails'];

                for (let i = 0; i < sales.SalesOrderDetails.length; i++) {
                    control.push(this.fb.group(sales.SalesOrderDetails[i]));
               }

                this.salesForm.controls['AccountTransactionValues'] = this.fb.array([]);
                const controlAc = <FormArray>this.salesForm.controls['AccountTransactionValues'];
                controlAc.controls = [];

                    for (let i = 0; i < sales.AccountTransactionValues.length; i++) {
                        let valuesFromServer = sales.AccountTransactionValues[i];
                        let instance = this.fb.group(valuesFromServer);

                        if (valuesFromServer['entityLists'] === "Dr") {
                            instance.controls['Credit'].disable();

                        } else if (valuesFromServer['entityLists'] === "Cr") {
                            instance.controls['Debit'].disable();
                        }
                        controlAc.push(instance);
                    }

                this.modalRef = this.modalService.show(this.TemplateRef, {
                    backdrop: 'static',
                    keyboard: false,
                    class: 'modal-lg'
                });
            });
    }

    deletePurchase(Id: number) {
         
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Sales?";
        this.modalBtnTitle = "Delete";
        this.reset();
        this.getSalesDetails(Id)
            .subscribe((sales: AccountTrans) => {
                 
                this.indLoading = false;
                this.salesForm.controls['Id'].setValue(sales.Id);
                this.salesForm.controls['Name'].setValue(sales.Name);
                this.salesForm.controls['AccountTransactionDocumentId'].setValue(sales.AccountTransactionDocumentId);
                this.salesForm.controls['Description'].setValue(sales.Description);
                this.formattedDate = new Date(sales.AccountTransactionValues[0]['Date']);
                this.salesForm.controls['Date'].setValue(this.formattedDate);

                this.salesForm.controls['SalesOrderDetails'] = this.fb.array([]);
                const control = <FormArray>this.salesForm.controls['SalesOrderDetails'];
                
                for (let i = 0; i < sales.SalesOrderDetails.length; i++) {
                    control.push(this.fb.group(sales.SalesOrderDetails[i]));
                }

                this.salesForm.controls['AccountTransactionValues'] = this.fb.array([]);
                const controlAc = <FormArray>this.salesForm.controls['AccountTransactionValues'];
                controlAc.controls = [];

                for (let i = 0; i < sales.AccountTransactionValues.length; i++) {
                    let valuesFromServer = sales.AccountTransactionValues[i];
                    let instance = this.fb.group(valuesFromServer);

                    if (valuesFromServer['entityLists'] === "Dr") {
                        instance.controls['Credit'].disable();

                    } else if (valuesFromServer['entityLists'] === "Cr") {
                        instance.controls['Debit'].disable();
                    }
                    controlAc.push(instance);
                }

                this.modalRef = this.modalService.show(this.TemplateRef, {
                    backdrop: 'static',
                    keyboard: false,
                    class: 'modal-lg'
                });
            });
    }

    // Initialize the formb uilder arrays
    initSalesOrderDetails() {
        return this.fb.group({
            Id: [''],
            IsSelected: [''],
            IsVoid: [''],
            ItemId: ['', Validators.required],
            OrderId: [''],
            OrderNumber: [''],
            Qty: ['', Validators.required],
            Tags: [''],
            UnitPrice: ['', Validators.required],
            TotalAmount: [''],
        });
    }

    initJournalDetail() {
        return this.fb.group({
            entityLists: ['', Validators.required],
            AccountId: ['', Validators.required],
            Debit: ['', Validators.required],
            Credit: ['', Validators.required],
            Description: [''],
        });
    }

    // Push the values of purchasdetails
    addPurchaseitems() {
        const control = <FormArray>this.salesForm.controls['SalesOrderDetails'];
        const addPurchaseValues = this.initSalesOrderDetails();
        control.push(addPurchaseValues);
    }

    //remove the rows//
    removePurchaseitems(i: number) {
         
        let controls = <FormArray>this.salesForm.controls['SalesOrderDetails'];
        let controlToRemove = this.salesForm.controls.SalesOrderDetails['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        let currentaccountid = controlToRemove.Id.value;

        if (currentaccountid != "0") {
            this.service.delete(Global.BASE_PURCHASEDETAILS_ENDPOINT, currentaccountid).subscribe(data => {
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

    addJournalitems() {
        const control = <FormArray>this.salesForm.controls['AccountTransactionValues'];
        const addPurchaseValues = this.initJournalDetail();
        control.push(addPurchaseValues);
    }

    removeJournal(i: number) {
         
        let controls = <FormArray>this.salesForm.controls['AccountTransactionValues'];
        let controlToRemove = this.salesForm.controls.AccountTransactionValues['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        let currentaccountid = controlToRemove.Id.value;

        if (selectedControl) {
            this.service.delete(Global.BASE_JOURNAL_ENDPOINT, currentaccountid).subscribe(data => {
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

    //Calulate total amount of all columns //
    calculateAmount() {
        let controls = this.salesForm.controls['SalesOrderDetails'].value;
        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.TotalAmount) ? (total + Math.round(accounts.TotalAmount)) : total;
        }, 0);
    }

    sumDebit(journalDetailsFrm: any) {
        let controls = this.salesForm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    }

    //calculate the sum of credit columns//
    sumCredit(journalDetailsFrm: any) {
        let controls = this.salesForm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
        }, 0);
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

    //enable disable the debit and credit on change entitylists//
    enableDisable(data: any) {
         ;
        if (data.entityLists.value == 'Dr') {
            data.Debit.enable();
            data.Credit.disable();
            data.Credit.reset();
        } else if
        (data.entityLists.value == 'Cr') {
            data.Credit.enable();
            data.Debit.disable();
            data.Debit.reset();
        } else {
            data.Debit.enable();
            data.Credit.enable();   
        }
    }

    //Opens confirm window modal//
    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    }

    onSubmit(fileUpload) {
         ;
        this.msg = "";
        let sales = this.salesForm;
        let newdate = new Date();
        let voucherDate = new Date(sales.get('Date').value);
        voucherDate.setTime(voucherDate.getTime() - (newdate.getTimezoneOffset() * 60000));
        sales.get('Date').setValue(voucherDate);

        this.formSubmitAttempt = true;

        if (!this.voucherDateValidator(sales.get('Date'))) {
            return false;
        }

        sales.get('FinancialYear').setValue(this.currentYear['Name'] || '');
        sales.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
        sales.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');
        //let salesForm = JSON.parse(JSON.stringify(sales.value));
        //salesForm.Date = this.date.transform(salesForm.Date, 'dd/MM/yyyy');


        if (sales.valid) {

            let totalDebit = this.sumDebit(this.journalDetailsFrm);
            let totalCredit = this.sumCredit(this.journalDetailsFrm);

            if (totalDebit != totalCredit || totalDebit == 0 || totalCredit == 0) {
                alert("Debit and Credit are not Equal | Value must be greater than Amount Zero.");
                return;
            }

            switch (this.dbops) {
                case DBOperation.create:
                    this.service.post(Global.BASE_SALES_ENDPOINT, sales.value).subscribe(
                        async (data) => {
                             ;
                            if (data > 0) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });
                                this.modalRef.hide();
                                this.loadSaleList(this.fromDate, this.toDate);
                            } else {
                                alert("There is some issue in creating records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                            this.reset();
                        }
                    );
                    break;
                case DBOperation.update:
                    let purchaseObj = {
                        Id: this.salesForm.controls['Id'].value,
                        Date:  this.date.transform(this.salesForm.controls['Date'].value, 'dd/MM/yyyy'),
                        Name: this.salesForm.controls['Name'].value,
                        AccountTransactionDocumentId: this.salesForm.controls['AccountTransactionDocumentId'].value,
                        Description: this.salesForm.controls['Description'].value,
                        FinancialYear: this.salesForm.controls['FinancialYear'].value,
                        UserName: this.salesForm.controls['UserName'].value,
                        CompanyCode: this.salesForm.controls['CompanyCode'].value,
                        SalesOrderDetails: this.salesForm.controls['SalesOrderDetails'].value,
                        AccountTransactionValues: this.salesForm.controls['AccountTransactionValues'].value
                    }
                    this.service.put(Global.BASE_SALES_ENDPOINT, sales.value.Id, purchaseObj).subscribe(
                        async (data) => {
                            if (data > 0) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });
                                this.modalRef.hide();
                                this.loadSaleList(this.fromDate, this.toDate);
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
                    let purchaseObjc = {
                        Id: this.salesForm.controls['Id'].value,
                        Date:  this.date.transform(this.salesForm.controls['Date'].value, 'dd/MM/yyyy'),
                        Name: this.salesForm.controls['Name'].value,
                        AccountTransactionDocumentId: this.salesForm.controls['AccountTransactionDocumentId'].value,
                        Description: this.salesForm.controls['Description'].value,
                        FinancialYear: this.salesForm.controls['FinancialYear'].value,
                        UserName: this.salesForm.controls['UserName'].value,
                        CompanyCode: this.salesForm.controls['CompanyCode'].value,
                        SalesOrderDetails: this.salesForm.controls['SalesOrderDetails'].value,
                        AccountTransactionValues: this.salesForm.controls['AccountTransactionValues'].value
                    }
                    this.service.delete(Global.BASE_SALES_ENDPOINT, purchaseObj.Id).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully deleted.");
                                this.loadSaleList(this.fromDate, this.toDate);
                            } else {
                                alert("There is some issue in deleting records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                            this.reset();
                        }
                    );
            }
        }
        else {
            this.validateAllFields(sales);
        }
    }

    confirm(): void {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    }

    reset() {
        this.salesForm.controls['AccountTransactionDocumentId'].reset();
        this.salesForm.controls['Date'].reset();
        this.salesForm.controls['Description'].reset();
        this.salesForm.controls['SalesOrderDetails'] = this.fb.array([]);
        this.salesForm.controls['AccountTransactionValues'] = this.fb.array([]);
        this.addJournalitems();
        this.addPurchaseitems();
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.salesForm.enable() : this.salesForm.disable();
    }
   
    onFilterDateSelect (selectedDate) {
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
}
