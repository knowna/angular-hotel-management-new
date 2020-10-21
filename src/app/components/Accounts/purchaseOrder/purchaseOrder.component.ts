import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AccountTrans } from '../../../Model/AccountTransaction/accountTrans';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';


type CSV = any[][];

@Component({
    templateUrl: './purchaseOrder.component.html',
    styleUrls: ['./purchaseOrder.component.css']
})

export class PurchaseOrderComponent {
     @ViewChild("template",{static:false}) TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested',{static:false}) TemplateRef2: TemplateRef<any>;
    
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    // public account: Observable<Account>;
    public account;
    public purchaseOrderFrm: FormGroup;
    purchaseorders: AccountTrans;
    purchaseorder: AccountTrans[];
    dbops: DBOperation;
    msg: string;
    modalTitle: string;
    modalBtnTitle: string;
    indLoading: boolean = false;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    formattedDate: any;
    public fromDate: any;
    public toDate: any;
    public currentYear: any = {};
    public currentUser: any = {};
    public company: any = {};
    dropMessage: string = "Upload Reference File";
    uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
    toExportFileName: string = 'Purchase order voucher-' + this.date.transform(new Date, "dd-MM-yyyy") + '.xls';
    fileUrl: string;
    settings = {
		bigBanner: false,
		timePicker: false,
		format: 'dd/MM/yyyy',
		defaultOpen: false
    };

    /**
     * Constructor
     * @param fb 
     * @param _purchaseOrderService 
     * @param _purchaseOrderDetailsService 
     * @param date 
     * @param modalService 
     */
    constructor(
        private fb: FormBuilder, 
        private _purchaseOrderService: AccountTransactionTypeService
, 
        private _purchaseOrderDetailsService: AccountTransactionTypeService, 
        private date: DatePipe, 
        private modalService: BsModalService
    ) {
        this._purchaseOrderService.getAccounts().subscribe(data => { this.account = data });
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.company = JSON.parse(localStorage.getItem('company'));
        this.fromDate = new Date(this.currentYear['StartDate']);
        this.toDate = new Date(this.currentYear['EndDate']);
    }

    ngOnInit(): void {
        this.purchaseOrderFrm = this.fb.group({
            Id: [''],
            Name: [''],
            AccountTransactionDocumentId: [''],
            Date: [new Date(), Validators.required],
            Description: ['', Validators.required],
            TotalAmount: [''],
            PurchaseOrderDetails: this.fb.array([ this.initPurchaseOrder()]),
            FinancialYear: [''],
            UserName: [''],
            CompanyCode: ['']
        });
       this.loadPurchaseOrderList();
    }

    voucherDateValidator(control: any) {
        let today = new Date; 
        let voucherDate = new Date(control.value);
        let currentYearStartDate = new Date(this.currentYear.StartDate);
        let currentYearEndDate = new Date(this.currentYear.EndDate);

        if (
            (voucherDate < currentYearStartDate)
            || (voucherDate > currentYearEndDate)
            || (voucherDate > today)
        ) {
            alert("Date should be within current financial year's start date and end date inclusive");
            return false;
        }

        return true;
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

    loadPurchaseOrderList(): void {
        this.indLoading = true;
        this._purchaseOrderService.get(Global.BASE_PURCHASEORDER_ENDPOINT+ '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 9)
            .subscribe(
                purchaseorder => { 
                    purchaseorder.map((porder) => porder['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + porder.Id + '&ApplicationModule=JournalVoucher');
                    this.purchaseorder = purchaseorder; this.indLoading = false; 
                },
                error => this.msg = <any>error
            );
    }

    addPurchaseOrder() {
        this.reset();
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Purchase Order";
        this.modalBtnTitle = "Save & Submit";
        this.purchaseOrderFrm.reset();
        this.purchaseOrderFrm.controls['Name'].setValue('PurchaseOrder');
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    getPurchaseDetails(Id: number) {
        this.indLoading = true;
        return this._purchaseOrderService.get(Global.BASE_PURCHASEORDER_ENDPOINT + '?TransactionId=' + Id);
    }

    editPurchaseOrder(Id: number) {
        this.reset();
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit";
        this.modalBtnTitle = "Update";
        this.getPurchaseDetails(Id)
            .subscribe((purchaseOrder: AccountTrans) => {
                this.indLoading = false;
                this.purchaseorders = purchaseOrder;
                this.purchaseOrderFrm.controls['Id'].setValue(this.purchaseorders.Id);
                this.formattedDate = new Date(this.purchaseorders.AccountTransactionValues[0]['Date']);        
                this.purchaseOrderFrm.controls['Date'].setValue(this.formattedDate);
                this.purchaseOrderFrm.controls['Name'].setValue(this.purchaseorders.Name);
                this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].setValue(this.purchaseorders.AccountTransactionDocumentId);
                this.purchaseOrderFrm.controls['Description'].setValue(this.purchaseorders.Description);
                this.purchaseOrderFrm.controls['PurchaseOrderDetails'] = this.fb.array([]);
                let control = <FormArray>this.purchaseOrderFrm.controls['PurchaseOrderDetails'];

                for (let i = 0; i < this.purchaseorders.PurchaseOrderDetails.length; i++) {
                    control.push(this.fb.group(this.purchaseorders.PurchaseOrderDetails[i]));
                }

                this.modalRef = this.modalService.show(this.TemplateRef, {
                    backdrop: 'static',
                    keyboard: false,
                    class: 'modal-lg'
                });
            });
    }

    deletePurchaseOrder(Id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.getPurchaseDetails(Id)
            .subscribe((purchaseOrder: AccountTrans) => {
                this.indLoading = false;
                this.purchaseorders = purchaseOrder;
                this.purchaseOrderFrm.controls['Id'].setValue(this.purchaseorders.Id);
                this.formattedDate = new Date(this.purchaseorders.AccountTransactionValues[0]['Date']);        
                this.purchaseOrderFrm.controls['Date'].setValue(this.formattedDate);
                this.purchaseOrderFrm.controls['Name'].setValue(this.purchaseorders.Name);
                this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].setValue(this.purchaseorders.AccountTransactionDocumentId);
                this.purchaseOrderFrm.controls['Description'].setValue(this.purchaseorders.Description);
                this.purchaseOrderFrm.controls['PurchaseOrderDetails'] = this.fb.array([]);
                let control = <FormArray>this.purchaseOrderFrm.controls['PurchaseOrderDetails'];

                for (let i = 0; i < this.purchaseorders.PurchaseOrderDetails.length; i++) {
                    control.push(this.fb.group(this.purchaseorders.PurchaseOrderDetails[i]));
                }

                this.modalRef = this.modalService.show(this.TemplateRef, {
                    backdrop: 'static',
                    keyboard: false,
                    class: 'modal-lg'
                });
            });
    }
    //initialize the array//
    initPurchaseOrder() {
        return this.fb.group({
            InventoryItemId: ['', Validators.required],
            Quantity: ['', Validators.required],
            PurchaseOrderRate: ['', Validators.required],
            PurchaseOrderAmount: ['']
        });
    }

    //Push the values of PurchaseOrderDetails
    addPurchaseOrderitems() {
        const control = <FormArray>this.purchaseOrderFrm.controls['PurchaseOrderDetails'];
        const addPurchaseValues = this.initPurchaseOrder();
        control.push(addPurchaseValues);
    }

    //remove the rows//
    removePurchaseOrder(i: number) {
        let controls = <FormArray>this.purchaseOrderFrm.controls['PurchaseOrderDetails'];
        let controlToRemove = this.purchaseOrderFrm.controls.PurchaseOrderDetails['controls'][i].controls;
        let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

        if (selectedControl) {
            this._purchaseOrderDetailsService.delete(Global.BASE_PURCHASEORDERDETAILS_ENDPOINT, i).subscribe(data => {
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

    // calculate total Amount of all Columns
    calculateAmount() {
        let controls = this.purchaseOrderFrm.controls['PurchaseOrderDetails'].value;
        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.PurchaseOrderAmount) ? (total + Math.round(accounts.PurchaseOrderAmount)) : total;
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


    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    }


    onSubmit(fileUpload: any) {
        this.msg = "";
        this.formSubmitAttempt = true;
        let newDate = new Date();
        let purchaseOrder = this.purchaseOrderFrm;
        let voucherDate = new Date(purchaseOrder.get('Date').value);
        voucherDate.setTime(voucherDate.getTime() - (newDate.getTimezoneOffset() * 60000));
        purchaseOrder.get('Date').setValue(voucherDate);
                        
        if (!this.voucherDateValidator(purchaseOrder.get('Date'))) {
            return false;
        }

        if (purchaseOrder.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._purchaseOrderService.post(Global.BASE_PURCHASEORDER_ENDPOINT, purchaseOrder.value).subscribe(
                        async (data) => {
                            if (data > 0) {
                                // file upload stuff goes here
                                let upload = await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });

                                if (upload == 'error' ) {
                                    alert('There is error uploading file!');
                                } 
                                
                                if (upload == true || upload == false) {
                                    this.modalRef.hide();
                                    this.formSubmitAttempt = false;
                                    this.reset();
                                }
                                this.modalRef.hide();
                                this.loadPurchaseOrderList();
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                    );

                    break;
                case DBOperation.update:
                    let purchaseOrderObj = {
                        Id: this.purchaseOrderFrm.controls['Id'].value,
                        Date: this.purchaseOrderFrm.controls['Date'].value,
                        Name: this.purchaseOrderFrm.controls['Name'].value,
                        AccountTransactionDocumentId: this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.purchaseOrderFrm.controls['Description'].value,
                        PurchaseOrderDetails: this.purchaseOrderFrm.controls['PurchaseOrderDetails'].value
                    }
                    this._purchaseOrderService.put(Global.BASE_PURCHASEORDER_ENDPOINT, purchaseOrder.value.Id, purchaseOrderObj).subscribe(
                        async (data) => {
                            if (data > 0) {
                                // file upload stuff goes here
                                let upload = await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });

                                if (upload == 'error' ) {
                                    alert('There is error uploading file!');
                                } 
                                
                                if (upload == true || upload == false) {
                                    this.modalRef.hide();
                                    this.formSubmitAttempt = false;
                                    this.reset();
                                }
                                this.modalRef.hide();
                                this.loadPurchaseOrderList();
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                    );
                    break;
                case DBOperation.delete:
                    let purchaseOrderObjc = {
                        Id: this.purchaseOrderFrm.controls['Id'].value,
                        Date: this.purchaseOrderFrm.controls['Date'].value,
                        Name: this.purchaseOrderFrm.controls['Name'].value,
                        AccountTransactionDocumentId: this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].value,
                        Description: this.purchaseOrderFrm.controls['Description'].value,
                        PurchaseOrderDetails: this.purchaseOrderFrm.controls['PurchaseOrderDetails'].value
                    }
                    this._purchaseOrderService.delete(Global.BASE_PURCHASEORDER_ENDPOINT, purchaseOrderObjc.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");                           
                                this.loadPurchaseOrderList();
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                            this.reset();
                        },
                    );
            }
        } else {
            this.validateAllFields(purchaseOrder);
        }
    }

    confirm(): void {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    }

    reset() {
        this.purchaseOrderFrm.controls['AccountTransactionDocumentId'].reset();
        this.purchaseOrderFrm.controls['Date'].reset();
        this.purchaseOrderFrm.controls['Description'].reset();
        this.purchaseOrderFrm.controls['PurchaseOrderDetails'] = this.fb.array([]);
        this.addPurchaseOrderitems();
    }
    
    SetControlsState(isEnable: boolean) {
        isEnable ? this.purchaseOrderFrm.enable() : this.purchaseOrderFrm.disable();
    }

    /**
     *  Get the list of filtered Purchases by the form and to date
     */
    filterPurchaseOrdersByDate () {
        this.indLoading = true;
        this._purchaseOrderService.get(Global.BASE_PURCHASEORDER_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd') + '&TransactionTypeId=' + 9)
            .subscribe(
                purchaseOrders => { 
                    this.purchaseorders = purchaseOrders; 
                    this.indLoading = false; 
                },
                error => this.msg = <any>error
            );
    }

    /**
     * Checks selected date
     * @param selectedDate 
     */
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
}
