﻿import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common'
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { DBOperation } from 'src/app/Shared/enum';
import { Global } from 'src/app/Shared/global';
import { InventoryItem } from 'src/app/Model/Inventory/inventoryItem';
import { PurchaseService } from 'src/app/Service/Billing/purchase.service';
import { PurchaseDetailsService } from 'src/app/Service/Billing/PurchaseDetails.service';
import { AccountTransValuesService } from 'src/app/Service/accountTransValues.service';
import { Account, EntityMock } from 'src/app/Model/Account/account';
import { AccountTrans } from 'src/app/Model/AccountTransaction/accountTrans';
import { ToastrService } from 'ngx-toastr';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';
import { ActivatedRoute, Router } from '@angular/router';
import { DateFormatter } from 'angular-nepali-datepicker';

type CSV = any[][];

@Component({
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.css']
})

export class PurchaseComponent implements OnInit {
    @ViewChild("template") TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    purchase: AccountTrans[];
    dbops: DBOperation;
    msg: string;
    modalTitle: string;
    modalBtnTitle: string;
    indLoading: boolean = false;
    formattedDate: any;
    dropMessage: string = "Upload Reference File";
    fileUrl: string = '';
    settings = {
		bigBanner: false,
		timePicker: false,
		format: 'dd/MM/yyyy',
		defaultOpen: false
    };

    public account: Account[] = [];
    public purchaseFrm: FormGroup;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    public entityLists: EntityMock[];
    public Name: EntityMock[];
    public fromDate: any;
    public toDate: any;
    public sfromDate: any;
    public stoDate: any;
    public currentYear: any = {};
    public currentUser: any = {};
    public company: any = {};
    journalDetailsFrm: any;

    //File Upload URL
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;

    public SourceAccountTypeId: string;
    public currentaccount: Account;
    public vdate: string;
    public inventoryItem: Observable<InventoryItem>;
    public inventoryItemList: any = [];
    public inventoryItemName: InventoryItem;
    public currentItem: string;

    toExportFileName: string = 'Purchase Report -' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Purchase Report -' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

    startFormatter: DateFormatter = (sfromDate) => {
        return `${ sfromDate.year }.${ (sfromDate.month*1 + 1) }.${ sfromDate.day }`;
    }

    endFormatter: DateFormatter = (stoDate) => {
        return `${ stoDate.year }.${ (stoDate.month*1 + 1) }.${ stoDate.day }`;
    }
    
    constructor(
        private fb: FormBuilder, 
        private _purchaseService: PurchaseService, 
        private _purchaseDetailsService: PurchaseDetailsService, 
        private _accountTransValues: AccountTransValuesService, 
        private date: DatePipe, 
        private modalService: BsModalService,
        private toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute) {

        this._purchaseService.getAccounts().subscribe(data => { this.account = data });
        this._purchaseService.getInventoryItems().subscribe(data => { this.inventoryItem = data });
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = this.currentYear['NepaliStartDate'];
        this.toDate = this.currentYear['NepaliEndDate'];
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' }
        ];
        this.Name = [
            { id: 0, name: 'Purchase Non Vat' },
            { id: 1, name: 'Purchase Vat' }
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

        this.loadPurchaseList(this.sfromDate, this.stoDate);


    }

    // Overide init component life-cycle hook    
    ngOnInit(): void {
        this.purchaseFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            AccountTransactionDocumentId: [''],
            Date: ['', Validators.compose([Validators.required, this.nepaliDateValidator])],
            Description: ['', Validators.required],
            Amount: [''],
            PurchaseDetails: this.fb.array([ this.initPurchase()]),
            AccountTransactionValues: this.fb.array([this.initJournalDetail()]),
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: ['']
        });
        // Load purchases list
        // this.loadPurchaseList(this.fromDate, this.toDate);

        this._purchaseService.getInventoryItems().subscribe(data => {
            this.inventoryItemList = data ;
            console.log('inventoryItemList', this.inventoryItemList)
        });
    }

    voucherDateValidator(currentdate: string) {
        if (currentdate == "") {
            alert("Please enter the voucher date");
            return false;
        }
        let today = new Date;
        this._purchaseService.get(Global.BASE_NEPALIMONTH_ENDPOINT + '?NDate=' + currentdate)
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
     * Load list of purchases form the server
     */
    loadPurchaseList(sfromdate: any, stodate: any){
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
        this.indLoading = true;

        this._purchaseService.get(Global.BASE_PURCHASE_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 9)
            .subscribe(
                purchase => {
                    purchase.map((purch) => purch['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + purch.Id + '&ApplicationModule=JournalVoucher');

                    console.log('the purchase list', purchase)
                    this.purchase = purchase; 
                    this.indLoading = false; 
                },
                error => this.msg = <any>error
            );
    }

    /**
     * Open Add New Purchase Form Modal
     */
    addPurchase() {
        // this.dbops = DBOperation.create;
        // this.SetControlsState(true);
        // this.modalTitle = "Add Purchase";
        // this.modalBtnTitle = "Save";
        // this.reset();
        // //this.purchaseFrm.controls['Name'].setValue('Purchase');
        // this.modalRef = this.modalService.show(this.TemplateRef, {
        //     backdrop: 'static',
        //     keyboard: false,
        //     class: 'modal-xl'
        // });
        this.router.navigate(['add'], {relativeTo: this.route});
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

    exportRowToPdf(Id: number) {
        this._purchaseService.get(Global.BASE_PURCHASE_ENDPOINT + '?TransactionId=' + Id)
            .subscribe((purchase: any) => {
                console.log('the purchase is', purchase)
                var doc = new jsPDF("p", "mm", "a4");
                

                // for purchase items
                var rowsItems = [];
                let snItem = 1;
                rowsItems.push(['S.No','Name of Item','Quantity','Rate','Amount']);
                purchase.PurchaseDetails.forEach(item => {
                    let findItem = this.inventoryItemList.find(x => x.Id == item.InventoryItemId);
                    var tempItem = [
                        snItem,
                        findItem.Name,
                        item.Quantity,
                        item.PurchaseRate,
                        item.PurchaseAmount
                    ];

                    snItem = snItem * 1 + 1;
                    rowsItems.push(tempItem);
                });




                // for account items
                var rows = [];
                let sn = 1;

                rows.push(['S.No','Dr/Cr','Account','Debit Amount','Credit Amount','Description']);
                purchase.AccountTransactionValues.forEach(data => {
                    let account = this.account.find(a => a.Id == data.AccountId);
                    var tempData = [
                        sn,
                        data.entityLists,
                        account.Name,
                        data.Debit > 0 ? data.Debit.toFixed(2) : '',
                        data.Credit > 0 ? data.Credit.toFixed(2) : '',
                        data.Description
                    ];
            
                    sn = sn * 1 + 1;
                    rows.push(tempData);
                    
                })

                rows.push(['','','Total',purchase.drTotal,purchase.crTotal,''])
                rows.push(['','','Voucher Description','','',purchase.Description])

                doc.setFontSize(14);
                doc.text(80,20, `${this.company?.NameEnglish}`);
                doc.text(87,30,'Purchase Voucher');
                doc.text(10,40,'Voucher No');
                doc.text(40,40,` : ${purchase.Name}`);
                doc.text(120,40,'Voucher Date');
                doc.text(150,40,` : ${purchase.AccountTransactionValues[0]['NVDate']}`);

                doc.autoTable({
                    margin: {left: 10,bottom:20},
                    setFontSize: 14,
            
                    //for next page 
                    startY: doc.pageCount > 1? doc.autoTableEndPosY() + 20 : 50,
                    rowPageBreak: 'avoid',
                    body: rows,
                    bodyStyles: {
                    fontSize: 9,
                    },
                    columnStyles: {
                        0: {cellWidth: 30},
                        1: {cellWidth: 30},
                        2: {cellWidth: 30},
                        3: {cellWidth: 30, halign: 'right',},
                        4: {cellWidth: 30, halign: 'right',},
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
                
                doc.save('Purchase-Report-Of- ' + purchase.Id + '-'+ `${this.date.transform(new Date, "yyyy-MM-dd")}` + '.pdf');
            });
    }

    exportTableToPdf() {
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['S.No','Date','Particular','Voucher Type','Voucher No','Debit Amount','Credit Amount']);

        this.purchase.forEach(p => {
            var tempPurchase = [
                sn,
                p.VDate,
                p.Name,
                p.VType,
                p.VoucherNo,
                '',
                ''
            ];
        
            sn = sn * 1 + 1;
            rows.push(tempPurchase);

            p.AccountTransactionValues.forEach(account => {
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
        doc.text(87,30,'Purchase Voucher');
        doc.text(80,40,`${this.sfromDate} - ${this.stoDate}`);
        doc.autoTable({
            margin: {left: 10,bottom:20},
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
     * Export formatter table in excel
     * @param tableID 
     * @param filename 
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
        // filename = filename ? filename + '.xlsx' : 'Purchase Voucher of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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

        let element = document.getElementById('purchaseTable'); 
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

        ws['!cols'] = [];
        ws['!cols'][6] = { hidden: true };
        ws['!cols'][7] = { hidden: true };

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.toExportFileName);
    }

    /**
     * Gets individual journal voucher
     * @param Id 
     */
    getPurchaseDetails(Id: number) {
        this.indLoading = true;
        return this._purchaseService.get(Global.BASE_PURCHASE_ENDPOINT + '?TransactionId=' + Id);
    }

    /**
     * Opens Edit Existing Journal Voucher Form Modal
     * @param Id 
     */
    editPurchase(Id: number) {
        this.router.navigate(['edit/' + Id], {relativeTo: this.route});
        // this.dbops = DBOperation.update;
        // this.SetControlsState(true);
        // this.modalTitle = "Edit Purchase";
        // this.modalBtnTitle = "Save";
        // this.reset();
        // this.getPurchaseDetails(Id)
        //     .subscribe((purchase: AccountTrans) => {
        //         console.log('for edit', purchase);
        //         this.indLoading = false;
        //         this.purchaseFrm.controls['Id'].setValue(purchase.Id);
        //         this.purchaseFrm.controls['Date'].setValue(purchase.AccountTransactionValues[0]['NVDate']);
        //         // this.purchaseFrm.controls['Name'].setValue(purchase.Name);
        //         this.purchaseFrm.controls['Name'].setValue(purchase.AccountTransactionType);
        //         this.purchaseFrm.controls['AccountTransactionDocumentId'].setValue(purchase.AccountTransactionDocumentId);
        //         this.purchaseFrm.controls['Description'].setValue(purchase.Description);

        //         this.purchaseFrm.controls['PurchaseDetails'] = this.fb.array([]);
        //         const control = <FormArray>this.purchaseFrm.controls['PurchaseDetails'];
        
        //         for (let i = 0; i < purchase.PurchaseDetails.length; i++) {
        //             let valuesFromServer = purchase.PurchaseDetails[i];
        //             let instance = this.fb.group(valuesFromServer);
        //             this.currentItem = this.inventoryItem.filter(x => x.Id === purchase.PurchaseDetails[i]["InventoryItemId"])[0];
        //             // if (this.currentaccount !== undefined) {
        //                 instance.controls["InventoryItemId"].setValue(this.currentItem);
        //             // }
        //             control.push(instance);
        //         }
        
        //         this.purchaseFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        //         const controlAc = <FormArray>this.purchaseFrm.controls['AccountTransactionValues'];
        //         controlAc.controls = [];
        
        //         for (let i = 0; i < purchase.AccountTransactionValues.length; i++) {
        //             let valuesFromServer = purchase.AccountTransactionValues[i];
        //             let instance = this.fb.group(valuesFromServer);

        //             // this.currentaccount = this.account.filter(x => x.Id === purchase.AccountTransactionValues[i]["AccountId"])[0];
        //             const account = this.account.find(x => x.Id === purchase.AccountTransactionValues[i].AccountId);
        //             // if (this.currentaccount !== undefined) {
        //                 // instance.controls["AccountId"].setValue(this.currentaccount.Name);
        //                 // instance.controls["AccountId"].setValue(this.currentaccount.Id);
        //                 instance.controls["AccountId"].setValue(account);
        //             // }

        //             if (valuesFromServer['entityLists'] === "Dr") {
        //                 instance.controls['Credit'].disable();
        
        //             } else if (valuesFromServer['entityLists'] === "Cr") {
        //                 instance.controls['Debit'].disable();
        //             }

        //             // instance.controls["Debit"].setValue(purchase.AccountTransactionValues[i].Debit);
        //             // instance.controls["Credit"].setValue(purchase.AccountTransactionValues[i].Credit);
        //             // instance.controls["Description"].setValue(purchase.AccountTransactionValues[i].Description);
        //             controlAc.push(instance);
        //         }

        //         console.log('the control', controlAc);

        //         this.modalRef = this.modalService.show(this.TemplateRef, {
        //             backdrop: 'static',
        //             keyboard: false,
        //             class: 'modal-xl'
        //         });
        //     });
    }

    /**
     * Delete Existing Purchase
     * @param id 
     */
    deletePurchase(Id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Purchase";
        this.modalBtnTitle = "Delete";
        this.reset();
        this.getPurchaseDetails(Id)
            .subscribe((purchase: AccountTrans) => {
                this.indLoading = false;  
                this.purchaseFrm.controls['Id'].setValue(purchase.Id);
                this.purchaseFrm.controls['Date'].setValue(purchase.AccountTransactionValues[0]['NVDate']);
                // this.purchaseFrm.controls['Name'].setValue(purchase.Name);
                this.purchaseFrm.controls['Name'].setValue(purchase.AccountTransactionType);
                this.purchaseFrm.controls['AccountTransactionDocumentId'].setValue(purchase.AccountTransactionDocumentId);
                this.purchaseFrm.controls['Description'].setValue(purchase.Description);
                
                this.purchaseFrm.controls['PurchaseDetails'] = this.fb.array([]);
                const control = <FormArray>this.purchaseFrm.controls['PurchaseDetails'];
        
                for (let i = 0; i < purchase.PurchaseDetails.length; i++) {
                    let valuesFromServer = purchase.PurchaseDetails[i];
                    let instance = this.fb.group(valuesFromServer);
                    this.currentItem = this.inventoryItem.filter(x => x.Id === purchase.PurchaseDetails[i]["InventoryItemId"])[0];
                    // if (this.currentaccount !== undefined) {
                        instance.controls["InventoryItemId"].setValue(this.currentItem);
                    // }
                    control.push(instance);
                }
        
                this.purchaseFrm.controls['AccountTransactionValues'] = this.fb.array([]);
                const controlAc = <FormArray>this.purchaseFrm.controls['AccountTransactionValues'];
                controlAc.controls = [];
        
                for (let i = 0; i < purchase.AccountTransactionValues.length; i++) {
                    let valuesFromServer = purchase.AccountTransactionValues[i];
                    let instance = this.fb.group(valuesFromServer);
        
                    const account = this.account.find(x => x.Id === purchase.AccountTransactionValues[i].AccountId);
                    instance.controls["AccountId"].setValue(account);

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
                    class: 'modal-xl'
                });
            });
    }

    // Initialize the formbuilder arrays//
    initPurchase() {
        return this.fb.group({
            InventoryItemId: ['', Validators.required],
            Quantity: ['', Validators.required],
            PurchaseRate: ['', Validators.required],
            PurchaseAmount: ['']
        });
    }

    // Initialize the journal details//
    initJournalDetail() {
        return this.fb.group({
            entityLists: ['', Validators.required],
            AccountId: ['', Validators.required],
            Debit: ['', Validators.required],
            Credit: ['', Validators.required],
            Description: ['']
        });
    }


    //Push the values of purchasdetails //
    addPurchaseitems() {
        const control = <FormArray>this.purchaseFrm.controls['PurchaseDetails'];
        const addPurchaseValues = this.initPurchase();
        control.push(addPurchaseValues);
    }

    removePurchaseitems(i: number) {
        let controls = <FormArray>this.purchaseFrm.controls['PurchaseDetails'];
        let controlToRemove = this.purchaseFrm.controls.PurchaseDetails['controls'][i].controls;
        // console.log('the contro', controlToRemove)
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        let currentaccountid = controlToRemove.PurchaseId.value;

        if (currentaccountid != "0") {
            this._purchaseDetailsService.delete(Global.BASE_PURCHASEDETAILS_ENDPOINT, currentaccountid)
                .subscribe(data => {
                    (data == 1) && controls.removeAt(i);
                    this.toastrService.success('Item removed successfully!');
                });
        } else {
            if (i >= 0) {
                controls.removeAt(i);
            } else {
                alert("Form requires at least one row");
            }
        }
    }

    // Push Journal Values in row    
    addJournalitems() {
        const control = <FormArray>this.purchaseFrm.controls['AccountTransactionValues'];
        const addPurchaseValues = this.initJournalDetail();
        control.push(addPurchaseValues);
    }

    //remove the rows//
    removePurchase(i: number) {
        let controls = <FormArray>this.purchaseFrm.controls['AccountTransactionValues'];
        let controlToRemove = this.purchaseFrm.controls.AccountTransactionValues['controls'][i].controls;
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

    //Calulate total amount of all columns //
    calculateAmount() {
        let controls = this.purchaseFrm.controls['PurchaseDetails'].value;
        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.PurchaseAmount) ? (total + Math.round(accounts.PurchaseAmount)) : total;
        }, 0);
    }

    //calulate the sum of debit columns//
    sumDebit(journalDetailsFrm: any) {
        let controls = this.purchaseFrm.controls.AccountTransactionValues.value;
        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    }

    //calculate the sum of credit columns//
    sumCredit(journalDetailsFrm: any) {
        let controls = this.purchaseFrm.controls.AccountTransactionValues.value;
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

    /**
     * Performs the form submit action for CRUD Operations
     * @param formData 
     */
    onSubmit(formData: any, fileUpload: any) {
        this.msg = "";
        this.formSubmitAttempt = true;
        let purchase = this.purchaseFrm;

        // if (!this.voucherDateValidator(purchase.get('Date').value)) {
        //     return false;
        // }

        purchase.get('FinancialYear').setValue(this.currentYear['Name'] || '');
        purchase.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
        purchase.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');
        
        if (purchase.valid) {
            let totalDebit = this.sumDebit(this.journalDetailsFrm);
            let totalCredit = this.sumCredit(this.journalDetailsFrm);

            if (totalDebit != totalCredit || totalDebit == 0 || totalCredit == 0) {
                alert("Debit and Credit are not Equal | Value must be greater than Amount Zero.");
                return;
            }

            const control = this.purchaseFrm.controls['AccountTransactionValues'].value;
            const controls = <FormArray>this.purchaseFrm.controls['AccountTransactionValues'];

            let accountList = [];
            control.forEach(account => {
                let Id = account.AccountId.Id;
                account.AccountId  = Id;

                accountList.push(account);
            });


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

            const purchasecontrol = this.purchaseFrm.controls['PurchaseDetails'].value;
            const purchasecontrols = <FormArray>this.purchaseFrm.controls['PurchaseDetails'];

            console.log('the purchase details', purchasecontrol)

            let purchaseList = [];
            purchasecontrol.forEach(item => {
                let Id = item.InventoryItemId.Id;
                item.InventoryItemId  = Id;

                purchaseList.push(item);
            });
            // for (var i = 0; i < purchasecontrol.length; i++) {
            //     let Id = purchasecontrol[i]['Id'];
            //     if (Id > 0) {
            //         let CurrentItemName = purchasecontrol[i]['InventoryItemId'];
            //         this.inventoryItemName = this.inventoryItem.filter(x => x.Id === CurrentItemName.Name)[0];
            //         let CurrentItemId = this.inventoryItemName.Id;
            //         let currentinventoryItem = purchasecontrol[i];
            //         let instance = this.fb.group(currentinventoryItem);
            //         instance.controls["InventoryItemId"].setValue(CurrentItemId);
            //         purchasecontrols.push(instance);
            //     }
            //     else {
            //         let xcurrentCurrentItemName = purchasecontrol[i]['InventoryItemId'];
            //         let currentinventoryItem = purchasecontrol[i];
            //         let instance = this.fb.group(currentinventoryItem);
            //         this.inventoryItemName = this.inventoryItem.filter(x => x.Name === xcurrentCurrentItemName.Name)[0];
            //         instance.controls["InventoryItemId"].setValue(this.inventoryItemName.Id.toString());
            //         purchasecontrols.push(instance);
            //     }
            // }

            let purchaseObject = {
                Id: this.purchaseFrm.controls['Id'].value,
                Date: this.purchaseFrm.controls['Date'].value,
                Name: this.purchaseFrm.controls['Name'].value,
                AccountTransactionDocumentId: this.purchaseFrm.controls['AccountTransactionDocumentId'].value,
                Description: this.purchaseFrm.controls['Description'].value,
                FinancialYear: this.purchaseFrm.controls['FinancialYear'].value,
                UserName: this.purchaseFrm.controls['UserName'].value,
                CompanyCode: this.purchaseFrm.controls['CompanyCode'].value,
                // PurchaseDetails: this.purchaseFrm.controls['PurchaseDetails'].value,
                PurchaseDetails: purchaseList,
                // AccountTransactionValues: this.purchaseFrm.controls['AccountTransactionValues'].value
                AccountTransactionValues: accountList
            }

            switch (this.dbops) {
                case DBOperation.create:
                    this._purchaseService.post(Global.BASE_PURCHASE_ENDPOINT, purchaseObject).subscribe(
                        async data => {
                            if (data > 0) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });
                                alert("Data successfully added.");
                                this.loadPurchaseList(this.fromDate, this.toDate);
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        }
                    );
                    break;
                case DBOperation.update:
                    this._purchaseService.put(Global.BASE_PURCHASE_ENDPOINT, purchase.value.Id, purchaseObject).subscribe(
                        async data => {
                            if (data > 0) {
                                // file upload stuff goes here
                                await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });
                                alert("Data successfully updated.");
                                this.loadPurchaseList(this.fromDate, this.toDate);
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                    );
                    break;
                case DBOperation.delete:
                    this._purchaseService.delete(Global.BASE_PURCHASE_ENDPOINT, purchaseObject).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data successfully deleted.");
                                this.loadPurchaseList(this.fromDate, this.toDate);
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                            this.reset();
                        }
                    );
            }
        }
        else {
            this.validateAllFields(purchase);
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
        this.purchaseFrm.controls['AccountTransactionDocumentId'].reset();
        this.purchaseFrm.controls['Date'].reset();
        this.purchaseFrm.controls['Description'].reset();
        this.purchaseFrm.controls['PurchaseDetails'] = this.fb.array([]);
        this.purchaseFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        this.addPurchaseitems();
        this.addJournalitems();
    }

    /**
     * Sets control's state
     * @param isEnable 
     */
    SetControlsState(isEnable: boolean) {
        isEnable ? this.purchaseFrm.enable() : this.purchaseFrm.disable();
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
    searchChange($event) {
        console.log($event);
    }
    config = {
        displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: '200px'
    };
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
