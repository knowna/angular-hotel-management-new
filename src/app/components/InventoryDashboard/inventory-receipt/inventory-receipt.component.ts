import { Component, OnInit, ViewChild, Directive, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgModel, FormArray, FormControl } from '@angular/forms';
import { InventoryReceipt, InventoryReceiptDetails } from '../../../Model/Inventory/InventoryReceipt';
import { Account } from '../../../Model/Account/account';
import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IInventoryItem } from '../../../Model/Inventory/inventoryItem';
import { InventoryReceiptService } from 'src/app/Service/Inventory/InventoryReceipt.service';
import { InventoryReceiptDetailsService } from 'src/app/Service/Inventory/InventoryReceiptDetails.service';

import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

@Component({
    moduleId: module.id,
    selector: 'my-receipt-list',
    templateUrl: 'inventory-receipt.component.html',
})

export class InventoryReceiptComponent implements OnInit {
    @ViewChild('template') TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
   
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    inventoryReceipt: InventoryReceipt[];
    inventoryReceiptItem: IInventoryItem[];
    public account: Observable<Account>;
    msg: string;
    indLoading: boolean = false;
    InventReceiptFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    formattedDate: any;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    public fromDate: any;
    public toDate: any;
    public currentYear: any = {};
    public currentUser: any = {};
    public company: any = {};
    settings = {
        bigBanner: false,
        timePicker: false,
        format: 'dd/MM/yyyy',
        defaultOpen: false,
    };
    public vdate: string;

    toExportFileName: string = 'Inventory Receipt-' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Inventory Receipt-' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

    constructor(private fb: FormBuilder, private _inventoryReceiptService: InventoryReceiptService,
        private _inventReceiptDetailsService: InventoryReceiptDetailsService,
        private date: DatePipe,
        private modalService: BsModalService) {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        // this.fromDate = new Date(this.currentYear['StartDate']);
        // this.toDate = new Date(this.currentYear['EndDate']);
        this.fromDate = this.currentYear['NepaliStartDate'];
        this.toDate = this.currentYear['NepaliEndDate'];
        this._inventoryReceiptService.getAccounts().subscribe(data => { this.account = data });
        this._inventoryReceiptService.getInventoryItems().subscribe(data => { this.inventoryReceiptItem = data });   
    }
    
    ngOnInit(): void {

        this.InventReceiptFrm = this.fb.group({
            Id: [''],
            Date: [new Date(), Validators.required],
            AccountTypeId: ['', Validators.required],
            ReceiptNumber: ['', Validators.required],
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: [''],
            InventoryReceiptDetails: this.fb.array([
                this.initInventoryDetails(),
            ]),
        });
        this.loadInventoryReceipt();
    }
    
    initInventoryDetails() {
        return this.fb.group({
            Id: [''],
            Quantity: ['', Validators.required],
            Rate: ['', Validators.required],
            InventoryItemId: ['', Validators.required],
            TotalAmount: [''],
            BatchNo: ['', Validators.required],
            Mdate: ['', Validators.required],
            Edate: ['', Validators.required],
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: [''],
        });
    }

    loadInventoryReceipt(): void {
        this.indLoading = true;
        this._inventoryReceiptService.get(Global.BASE_INVENTORYRECEIPT_ENDPOINT)
            .subscribe(
                inventoryReceipt => { 
                    this.inventoryReceipt = inventoryReceipt; 
                    this.indLoading = false; 
                },
                error => {
                    this.msg = <any>error;
                    this.indLoading = false;
                });
    }

    /**
 * Get customer Details
 * @param Id 
 */
    getIRItem(Id: number) {
        if (this.inventoryReceiptItem) {
            return this.inventoryReceiptItem.filter((IRItem) => {
                return IRItem.Id === Id;
            })[0];
        }
    }

    /**
   * Gets individual Inventory Receipt
   * @param Id 
   */
    getInventoryReceipt(Id: number) {
        this.indLoading = true;
        return this._inventoryReceiptService.get(Global.BASE_INVENTORYRECEIPT_ENDPOINT + '?Id=' + Id);
    }

    addDetails() {
        // add address to the list
        const control = <FormArray>this.InventReceiptFrm.controls['InventoryReceiptDetails'];
        control.push(this.initInventoryDetails());
    }

    exportTableToPdf() {
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['Receipt No','Date','Rate','Total Amount','BatchNo','Actions','']);

        this.inventoryReceipt.forEach(IReceipts => {
            var tempIReceipts = [
                IReceipts.ReceiptNumber,
                this.date.transform(IReceipts.Date,'dd/MM/yyyy'),
                '',
                '',
                '',
                '',
                '',
            ];

            rows.push(tempIReceipts);

            rows.push(['Item Name','Quality','Rate','Total Amount','BatchNo','Mdate','Edate']);

            IReceipts.InventoryReceiptDetails.forEach(transaction => {
                var tempTransaction = [
                    this.getIRItem(transaction.InventoryItemId)?.Name,
                    transaction.Quantity,
                    transaction.Rate,
                    transaction.TotalAmount,
                    transaction.BatchNo,
                    this.date.transform(transaction.Mdate,'dd/MM/yyyy'),
                    this.date.transform(transaction.Edate,'dd/MM/yyyy'),
                ];

                rows.push(tempTransaction);
            });
        });

        doc.setFontSize(14);
        doc.text(80,20, `${this.company?.NameEnglish}`);
        doc.text(87,30,'Inventory Receipt');
        doc.text(80,40,`${this.date.transform(this.fromDate,'yyyy.MM.dd')} - ${this.date.transform(this.toDate,'yyyy.MM.dd')}`);
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

    exportTableToExcel(tableID, filename = '') {
        // var downloadLink;
        // var dataType = 'application/vnd.ms-excel';
        // var clonedtable = $('#' + tableID);
        // var clonedHtml = clonedtable.clone();
        // $(clonedtable).find('.export-no-display').remove();
        // var tableSelect = document.getElementById(tableID);
        // var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        // $('#' + tableID).html(clonedHtml.html());

        // // Specify file name
        // filename = filename ? filename + '.xls' : 'Inventory Receipts of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
        let element = document.getElementById(tableID); 
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
        ws['!cols'] = [];

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.toExportFileName);

    }

    InventoryDateValidator(control: FormControl) {
        let voucherDate = new Date(control.value);
        let today = new Date;
        if (voucherDate > today) {
            return { InvalidDate: "Selected voucher date should not be greater than today's date" };
        }
        if (voucherDate < new Date(this.currentYear.Mdate)) {
             return { InvalidDate: "Selected voucher date should not be less than current financial year's start date" };
        }

       return null;
    }

    //remove the rows//
    removeInventory(i: number) {
        let controls = <FormArray>this.InventReceiptFrm.controls['InventoryReceiptDetails'];
        let controlToRemove = this.InventReceiptFrm.controls.InventoryReceiptDetails['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        if (selectedControl) {
            this._inventReceiptDetailsService.delete(Global.BASE_INVENTORYRECEIPTDETAIL_ENDPOINT, i).subscribe(data => {
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

    addInventoryReceipt() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Inventory Receipt";
        this.modalBtnTitle = "Save";
        this.InventReceiptFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl',
        });
    }

    editInventoryReceipt(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Inventory Receipt";
        this.modalBtnTitle = "Save";
        this.reset();
        this.getInventoryReceipt(Id).subscribe((inventoryReceipts: InventoryReceipt) => {
            this.indLoading = false;
            this.InventReceiptFrm.controls['Id'].setValue(inventoryReceipts.Id);
            this.InventReceiptFrm.controls['AccountTypeId'].setValue(inventoryReceipts.AccountTypeId);
            this.InventReceiptFrm.controls['ReceiptNumber'].setValue(inventoryReceipts.ReceiptNumber);
            // this.InventReceiptFrm.controls['Date'].setValue(new Date(inventoryReceipts.Date));
            this.InventReceiptFrm.controls['Date'].setValue(inventoryReceipts.Date);

            this.InventReceiptFrm.controls['InventoryReceiptDetails'] = this.fb.array([]);
            const control = <FormArray>this.InventReceiptFrm.controls['InventoryReceiptDetails'];

            for (let i = 0; i < inventoryReceipts.InventoryReceiptDetails.length; i++) {
                let valuesFromServer = inventoryReceipts.InventoryReceiptDetails[i];
                let instance = this.fb.group(valuesFromServer);

                instance.controls['InventoryItemId'].setValue(valuesFromServer.InventoryItemId);
                instance.controls['Quantity'].setValue(valuesFromServer.Quantity);
                instance.controls['Rate'].setValue(valuesFromServer.Rate);
                instance.controls['TotalAmount'].setValue(valuesFromServer.TotalAmount);
                instance.controls['BatchNo'].setValue(valuesFromServer.BatchNo);
                // instance.controls['Mdate'].setValue(new Date(valuesFromServer.Mdate));
                // instance.controls['Edate'].setValue(new Date(valuesFromServer.Edate));
                instance.controls['Mdate'].setValue(valuesFromServer.Mdate);
                instance.controls['Edate'].setValue(valuesFromServer.Edate);
                control.push(instance);
            }

            this.modalRef = this.modalService.show(this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-xl'
            });
        },
            error => this.msg = <any>error);
        }
            

    deleteInventory(Id: number) {

        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Delete Inventory Receipt";
        this.modalBtnTitle = "Delete";

        this.getInventoryReceipt(Id).subscribe((inventoryReceipts: InventoryReceipt) => {
            this.indLoading = false;
            this.InventReceiptFrm.controls['Id'].setValue(inventoryReceipts.Id);
            this.InventReceiptFrm.controls['AccountTypeId'].setValue(inventoryReceipts.AccountTypeId);
            this.InventReceiptFrm.controls['ReceiptNumber'].setValue(inventoryReceipts.ReceiptNumber);
            // this.InventReceiptFrm.controls['Date'].setValue(new Date(inventoryReceipts.Date));
            this.InventReceiptFrm.controls['Date'].setValue(inventoryReceipts.Date);

            this.InventReceiptFrm.controls['InventoryReceiptDetails'] = this.fb.array([]);
            const control = <FormArray>this.InventReceiptFrm.controls['InventoryReceiptDetails'];

            for (let i = 0; i < inventoryReceipts.InventoryReceiptDetails.length; i++) {
                let valuesFromServer = inventoryReceipts.InventoryReceiptDetails[i];
                let instance = this.fb.group(valuesFromServer);

                instance.controls['InventoryItemId'].setValue(valuesFromServer.InventoryItemId);
                instance.controls['Quantity'].setValue(valuesFromServer.Quantity);
                instance.controls['Rate'].setValue(valuesFromServer.Rate);
                instance.controls['TotalAmount'].setValue(valuesFromServer.TotalAmount);
                instance.controls['BatchNo'].setValue(valuesFromServer.BatchNo);
                // instance.controls['Mdate'].setValue(new Date(valuesFromServer.Mdate));
                // instance.controls['Edate'].setValue(new Date(valuesFromServer.Edate));
                instance.controls['Mdate'].setValue(valuesFromServer.Mdate);
                instance.controls['Edate'].setValue(valuesFromServer.Edate);
                control.push(instance);
            }

            this.modalRef = this.modalService.show(this.TemplateRef, {
                backdrop: 'static',
                keyboard: false,
                class: 'modal-xl'
            });
        },
            error => this.msg = <any>error);
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
    
    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    }

    //Form Submit
    onSubmit(form: any) {
        this.msg = "";
        this.formSubmitAttempt = true;
        let inventRec = this.InventReceiptFrm;
        // let InventoryDate = new Date(inventRec.get('Date').value);
        // inventRec.get('Date').setValue(InventoryDate);

        if (!this.voucherDateValidator(inventRec.get('Date').value)) {
            return false;
        }

        inventRec.get('FinancialYear').setValue(this.currentYear['Name'] || '');
        inventRec.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
        inventRec.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');
        let InventReceiptFrm = JSON.parse(JSON.stringify(inventRec.value));
        InventReceiptFrm.Date = this.date.transform(InventReceiptFrm.Date, 'dd/MM/yyyy');
        if (inventRec.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._inventoryReceiptService.post(Global.BASE_INVENTORYRECEIPT_ENDPOINT, inventRec.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.openModal2(this.TemplateRef2);
                                this.loadInventoryReceipt();
                            }
                            else {
                                alert("There is some issue in creating records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },
                    );

                    break;
                case DBOperation.update:
                    let inventReceiptObj = {

                        Id: this.InventReceiptFrm.controls['Id'].value,
                        AccountTypeId: this.InventReceiptFrm.controls['AccountTypeId'].value,
                        ReceiptNumber: this.InventReceiptFrm.controls['ReceiptNumber'].value,
                        Date: this.InventReceiptFrm.controls['Date'].value,
                        InventoryReceiptDetails: this.InventReceiptFrm.controls['InventoryReceiptDetails'].value,
                    }
                    this._inventoryReceiptService.put(Global.BASE_INVENTORYRECEIPT_ENDPOINT, inventRec.value.Id, inventReceiptObj).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.openModal2(this.TemplateRef2);
                                this.loadInventoryReceipt();
                            }
                            else {
                                this.msg = "There is some issue in updating records, please contact to system administrator!"
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },
                    );

                    break;
                  case DBOperation.delete:
                 
                    let inventReceiptObjc = {

                        Id: this.InventReceiptFrm.controls['Id'].value,
                        AccountTypeId: this.InventReceiptFrm.controls['AccountTypeId'].value,
                        ReceiptNumber: this.InventReceiptFrm.controls['ReceiptNumber'].value,
                        Date: this.InventReceiptFrm.controls['Date'].value,
                        InventoryReceiptDetails: this.InventReceiptFrm.controls['InventoryReceiptDetails'].value
                    }

                    this._inventoryReceiptService.delete(Global.BASE_INVENTORYRECEIPT_ENDPOINT, inventReceiptObjc).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");  
                                this.loadInventoryReceipt();
                            }
                            else {
                                alert("There is some issue in deleting records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },
                    );
            }
        }

        else {
            this.validateAllFields(inventRec);
        }
    }


    confirm(): void {
        this.modalRef2.hide();
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.InventReceiptFrm.enable() : this.InventReceiptFrm.disable();
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

    /**
    *  Get the list of filtered journals by the form and to date
    */
    filterJournalByDate(sfromdate: string, stodate: string) {
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

        this._inventoryReceiptService.get(Global.BASE_INVENTORYRECEIPT_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 5)
            .subscribe(inventoryReceipt => {
                this.indLoading = false;
                return this.inventoryReceipt = inventoryReceipt;
            },
            error => {
                this.indLoading = false;
                this.msg = <any>error
            });
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

    reset() {
        this.InventReceiptFrm.controls['Id'].reset();
        this.InventReceiptFrm.controls['AccountTypeId'].reset();
        this.InventReceiptFrm.controls['ReceiptNumber'].reset();
        this.InventReceiptFrm.controls['Date'].reset();
        this.InventReceiptFrm.controls['InventoryReceiptDetails'] = this.fb.array([]);
    }

    // voucherDateValidator(control: any) {
    //     let today = new Date;
    //     if (!control.value) {
    //         alert("Please select the Inventory Date");
    //         return false;
    //     }

    //     let InventoryDate = new Date(control.value);
    //     let currentYearStartDate = new Date(this.currentYear.StartDate);
    //     let currentYearEndDate = new Date(this.currentYear.EndDate);

    //     if ((InventoryDate < currentYearStartDate) || (InventoryDate > currentYearEndDate) || (InventoryDate > today))
    //    {
    //         alert("Date should be within current financial year's start date and end date inclusive, Error Occured!");
    //         return false;
    //     }

    //     return true;
    // }
    voucherDateValidator(currentdate: string) {
        console.log('the current date is', currentdate);
    
        if (currentdate == "") {
            alert("Please enter the voucher date");
            return false;
        }
        let today = new Date;
        this._inventoryReceiptService.get(Global.BASE_NEPALIMONTH_ENDPOINT + '?NDate=' + currentdate)
          .subscribe(SB => {
            this.vdate = SB;
            console.log('data is', SB)
          },
          error => this.msg = <any>error);
    
        if (this.vdate === "undefined") {
          alert("Please enter the voucher valid date");
          return false;
        }
    
        console.log('the database date is', this.vdate , currentdate)
        let voucherDate = new Date(this.vdate);
    
        let tomorrow = new Date(today.setDate(today.getDate() + 1));
    
        let currentYearStartDate = new Date(this.currentYear.StartDate);
        let currentYearEndDate = new Date(this.currentYear.EndDate);
    
        // console.log('the current date is', currentdate);
        console.log('the voucher date', voucherDate)
        console.log('the tomorrow date is', tomorrow);
        console.log('the current year start date', currentYearStartDate);
        console.log('the end year dateis', currentYearEndDate);
    
        // let voucherDateConverted = this. datepipe. transform(voucherDate, 'yyyy-MM-dd');
        // let currentYearStartDateConverted = this. datepipe. transform(currentYearStartDate, 'yyyy-MM-dd');
        // let currentYearEndDateConverted = this. datepipe. transform(currentYearEndDate, 'yyyy-MM-dd');
        // let tomorrowConverted = this. datepipe. transform(tomorrow, 'yyyy-MM-dd');
    
        if ((voucherDate < currentYearStartDate) || (voucherDate > currentYearEndDate) || voucherDate >= tomorrow) {
          alert("Date should be within current financial year's start date and end date inclusive");
          return false;
        }
        else {
            return true;
        }
        
      }
}
