﻿import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as XLSX from 'xlsx';
import { DBOperation } from 'src/app/Shared/enum';
import { Global } from 'src/app/Shared/global';
import { PurchaseService } from 'src/app/Service/Billing/purchase.service';
import { PurchaseDetailsService } from 'src/app/Service/Billing/PurchaseDetails.service';
import { AccountTransValuesService } from 'src/app/Service/accountTransValues.service';
import { FileService } from 'src/app/Service/file.service';
import { EntityMock, Account } from 'src/app/Model/Account/account';
import { AccountTrans } from 'src/app/Model/AccountTransaction/accountTrans';

type CSV = any[][];

//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { Order } from 'src/app/Model/order.model';
import { TicketService } from 'src/app/Service/Billing/ticket.service';
import { Ticket } from 'src/app/Model/ticket.model';
import { DateFormatter } from 'angular-nepali-datepicker';

@Component({
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
    @ViewChild("template") TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    //@ViewChild('fileInput') fileInput: ElementRef;

    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    public account: Observable<Account>;
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
    public sfromDate: any;
    public stoDate: any;
    public currentYear: any = {};
    public currentUser: any = {};
    public company: any = {};
    dropMessage: string = "Upload Reference File";
    toExportFileName: string = 'Sales Report - ' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Sales Report - ' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    fileUrl: string = '';
    journalDetailsFrm: any
    
    ordersNew : Order[] = [];

    ticket: Ticket;

    startFormatter: DateFormatter = (sfromDate) => {
        return `${ sfromDate.year }.${ (sfromDate.month*1 + 1) }.${ sfromDate.day }`;
    }

    endFormatter: DateFormatter = (stoDate) => {
        return `${ stoDate.year }.${ (stoDate.month*1 + 1) }.${ stoDate.day }`;
    }
    

    /**
     * Constructor
     * 
     * @param fb 
     * @param _purchaseService 
     * @param _purchaseDetailsService 
     * @param _accountTransValues 
     * @param date 
     * @param modalService 
     */
    constructor(
        private fb: FormBuilder, 
        private _purchaseService: PurchaseService, 
        private _purchaseDetailsService: PurchaseDetailsService, 
        private _accountTransValues: AccountTransValuesService, 
        private date: DatePipe, 
        private modalService: BsModalService,
        private fileService: FileService,
        private orderApi: OrderService,  
        private ticketService: TicketService,
    ) {
        this._purchaseService.getAccounts().subscribe(data => { this.account = data });        
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = this.currentYear['NepaliStartDate'];
        this.toDate = this.currentYear['NepaliEndDate'];
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' }
        ];


        let fromDateArray = this.fromDate.split('.');
        this.sfromDate = {
            'day' : fromDateArray[2]*1,
            'month': fromDateArray[1]*1 - 1,
            'year': fromDateArray[0]*1
        }

        let toDateArray = this.toDate.split('.');
        this.stoDate = {
            'day' : toDateArray[2]*1,
            'month': toDateArray[1]*1 - 1,
            'year': toDateArray[0]*1
        }

        this.loadSaleList(this.sfromDate, this.stoDate);

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
        // this.loadSaleList(this.fromDate, this.toDate);
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

    exportRowToPdf(sale) {
        console.log('the detail is', sale)
        this.ticketService.getTicketById(41)
            .subscribe(
                data => {
                    this.ticket = data;
                    if(this.ticket) {
                        this.orderApi.loadOrdersNew(this.ticket.Id.toString())
                        .subscribe(
                            data => {
                                this.ordersNew = data;
                                console.log('the orders after fetch are', this.ordersNew)
                            });
                    }
                });
        
        
    }

    exportTableToPdf() {
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['S.No','Date','Particular','Voucher Type','Voucher No','Debit Amount','Credit Amount']);

        this.sales.forEach(s => {
            var tempSale = [
                sn,
                s.VDate,
                s.Name,
                s.VType,
                s.VoucherNo,
                '',
                ''
            ];
        
            sn = sn * 1 + 1;
            rows.push(tempSale);

            s.AccountTransactionValues.forEach(account => {
                var tempAccount = [
                    '',
                    '',
                    account.Name,
                    '',
                    '',
                    account.DebitAmount > 0 ? account.DebitAmount.toFixed(2) : '',
                    account.CreditAmount> 0 ? account.CreditAmount.toFixed(2) : '',
                ]
                rows.push(tempAccount);
            });

        });

        doc.setFontSize(14);
        doc.text(80,20, `${this.company?.NameEnglish}`);
        doc.text(87,30,'Sales Voucher');
        doc.text(80,40,`${this.sfromDate} - ${this.stoDate}`);
        doc.autoTable({
            margin: {left: 10, right: 10, bottom:20},
            setFontSize: 14,
      
            //for next page 
            startY: doc.pageCount > 1? doc.autoTableEndPosY() + 20 : 50,
            rowPageBreak: 'avoid',
            body: rows,
            bodyStyles: {
              fontSize: 9,
            },
            columnStyles: {
              0: {cellWidth: 15},
              1: {cellWidth: 25},
              2: {cellWidth: 35},
              3: {cellWidth: 35},
              4: {cellWidth: 25},
              5: {cellWidth: 25, halign: 'right',},
              6: {cellWidth: 25, halign: 'right',},
            },
      
            // customize table header and rows format
            theme: 'striped'
        });


        const pages = doc.internal.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.width;  //Optional
        const pageHeight = doc.internal.pageSize.height;  //Optional
        doc.setFontSize(10);  //Optional

        for(let j = 1; j < pages + 1 ; j++) {
            let horizontalPos = pageWidth / 2;  //Can be fixed number
            let verticalPos = pageHeight - 10;  //Can be fixed number
            doc.setPage(j);
            doc.text(`${j} of ${pages}`, horizontalPos, verticalPos, {align: 'center' }); //Optional text styling});
        }
        doc.save(this.toPdfFileName);

    }

    /**
     * Exports the pOrder voucher data in CSV/ Excel format
     */
    exportTableToExcel(tableID, filename = '') {
        // var downloadLink;
        // var dataType = 'application/vnd.ms-excel';
        // var clonedtable = $('#'+ tableID);
        // var clonedHtml = clonedtable.clone();
        // $(clonedtable).find('.export-no-display').remove();
        // var tableSelect = document.getElementById(tableID);
        // var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        // $('#' + tableID).html(clonedHtml.html());

        // // Specify file name
        // filename = filename ? filename + '.xls' : this.toExportFileName;

        // // Create download link element
        // downloadLink = document.createElement("a");

        // document.body.appendChild(downloadLink);

        // if (navigator.msSaveOrOpenBlob) {
        //     var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
        //     navigator.msSaveOrOpenBlob(blob, filename);
        // } else {
        //     // Create a link to the file
        //     downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        //     // Setting the file name
        //     downloadLink.download = filename;

        //     //triggering the function
        //     downloadLink.click();
        // } 
        let element = document.getElementById('salesTable'); 
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
        
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.toExportFileName);
    }

    loadSaleList(sfromdate: any, stodate: any) {
        this.indLoading = true;

        sfromdate = sfromdate.year + '.' + (sfromdate.month*1 + 1) + '.' + sfromdate.day;
        stodate = stodate.year + '.' + (stodate.month*1 + 1) + '.' + stodate.day;

        if (sfromdate == "undefined" || sfromdate == null) {
            alert("Enter Start Date");
            return false;
        }
        if (stodate == "undefined" || stodate == null) {
            alert("Enter End Date");
            return false;
        }
        // if (this.nepaliDateStringValidator(stodate) === false) {
        //     alert("Enter Valid End Date");
        //     return false;
        // }
        // if (this.nepaliDateStringValidator(sfromdate) === false) {
        //     alert("Enter Valid Start Date");
        //     return false;
        // }

        this.fromDate = sfromdate;
        this.toDate = stodate;
        // this.sfromDate = sfromdate;
        // this.stoDate = stodate;
        this._purchaseService.get(Global.BASE_SALES_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 3)
            .subscribe(
            sales => {
                    sales.map((purch) => purch['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + purch.Id + '&ApplicationModule=JournalVoucher');
                    this.sales = sales; 
                    console.log('the sales list', this.sales)
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
         return this._purchaseService.get(Global.BASE_SALES_ENDPOINT + '?TransactionId=' + Id);
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
            this._purchaseDetailsService.delete(Global.BASE_PURCHASEDETAILS_ENDPOINT, currentaccountid).subscribe(data => {
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
                    this._purchaseService.post(Global.BASE_SALES_ENDPOINT, sales.value).subscribe(
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
                    this._purchaseService.put(Global.BASE_SALES_ENDPOINT, sales.value.Id, purchaseObj).subscribe(
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
                    this._purchaseService.delete(Global.BASE_SALES_ENDPOINT, purchaseObjc.Id).subscribe(
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
