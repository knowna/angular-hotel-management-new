import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DatePipe } from '@angular/common';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';
import { AccountType } from 'src/app/Model/AccountType/accountType';
import { AccountTransType } from 'src/app/Model/AccountTransactionType/accountTransType';
import { DBOperation } from 'src/app/Shared/enum';
import { Global } from 'src/app/Shared/global';

import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';


@Component({
    templateUrl: './account-transaction-type.component.html'
})

export class AccountTransactionTypeComponent implements OnInit {
    @ViewChild('template') TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    // public acctype: Observable<AccountType>;
    acctype: AccountType[] = [];
    accounttransTypes: AccountTransType[];
    tempAccounttransTypes: AccountTransType[];

    accounttransType: AccountTransType;
    msg: string;
    indLoading: boolean = false;
    acctransTypeFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;

    searchKeyword = '';
    public company: any = {};


    toExportFileName: string = 'Transaction Type -' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Transaction Type -' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

    constructor(private fb: FormBuilder, private acctransTypeService: AccountTransactionTypeService, private date: DatePipe, private modalService: BsModalService) {
        this.acctransTypeService.getAccountTypes()
        .subscribe(data =>{
            this.acctype = data
        })

        this.company = JSON.parse(localStorage.getItem('company'));

    }
    
    ngOnInit(): void {
        this.acctransTypeFrm = this.fb.group({
            Id: [''],
            SortOrder: [''],
            SourceAccountTypeId: ['', Validators.required],
            TargetAccountTypeId: ['', Validators.required],
            DefaultSourceAccountId:[''],
            DefaultTargetAccountId: [''],
            ForeignCurrencyId: [''],
            UserString:[''],
            Name: [''],        
        });

        this.LoadAcctransTypes();
    }




    LoadAcctransTypes(): void {
        this.indLoading = true;
        this.acctransTypeService.get(Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT)
            .subscribe(
                accounttransTypes => { 
                    this.accounttransTypes = accounttransTypes;
                    this.tempAccounttransTypes = accounttransTypes;
                    this.indLoading = false; 
                },
            error => this.msg = <any>error);
    }

    exportTableToPdf() {
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['S.No','Name']);

        this.accounttransTypes.forEach(accounttransType => {
            var tempAccounttransType = [
                sn,
                accounttransType.Name,
            ];

            sn = sn * 1 + 1;
            rows.push(tempAccounttransType);
        });

        doc.setFontSize(14);
        doc.text(80,20, `${this.company?.NameEnglish}`);

        doc.autoTable({
            margin: {left: 10,bottom:20},
            setFontSize: 14,
      
            //for next page 
            startY: doc.pageCount > 1? doc.autoTableEndPosY() + 20 : 30,
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
        // filename = filename ? filename + '.xls' : 'Trial Balance of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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

        let element = document.getElementById('TransactionTypeTable'); 
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
        ws['!cols'] = [];
        ws['!cols'][1] = { hidden: true };

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.toExportFileName);
    }

    addAcctransType() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Transaction Type";
        this.modalBtnTitle = "Save";
        this.acctransTypeFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });

    }
    editAcctransType(Id: number) {
       
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Transaction Type";
        this.modalBtnTitle = "Save";
        this.accounttransType = this.accounttransTypes.filter(x => x.Id == Id)[0];
        this.acctransTypeFrm.setValue(this.accounttransType);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    deleteAcctransType(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Transaction Type?";
        this.modalBtnTitle = "Delete";
        this.accounttransType = this.accounttransTypes.filter(x => x.Id == id)[0];
        this.acctransTypeFrm.setValue(this.accounttransType);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
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
    
    //displays the confirm popup-window
    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    }

    //Submit the Form
    onSubmit() {
        this.msg = "";
        let accountType = this.acctransTypeFrm
        this.formSubmitAttempt = true;

        if (accountType.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                   
                    this.acctransTypeService.post(Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT, accountType.value).subscribe(
                        data => {

                            if (data == 1) //Success

                            {

                                this.openModal2(this.TemplateRef2);
                                this.LoadAcctransTypes();
                            }
                            else {
                                // this.modal.backdrop;
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;

                        },

                    );
                    break;
                case DBOperation.update:
                    
                    this.acctransTypeService.put(Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT, accountType.value.Id, accountType.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.openModal2(this.TemplateRef2);
                                this.LoadAcctransTypes();
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
                    this.acctransTypeService.delete(Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT, accountType.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data deleted sucessfully");
                                this.LoadAcctransTypes();
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
            this.validateAllFields(accountType);
        }

        //this.acctransTypeService.delete(Global.BASE_ACCOUNTTRANSTYPE_ENDPOINT, accountType.value.Id).subscribe(
        //    data => {
        //        if (data == 1) //Success
        //        {
        //            this.msg = "Data successfully deleted.";
        //            this.LoadAcctransTypes();
        //        }
        //        else {
        //            this.msg = "There is some issue in saving records, please contact to system administrator!"
        //        }

        //        this.modalRef.hide();
        //    },
           

        //);

    }


    confirm(): void {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    }


    reset() {
        let control = this.acctransTypeFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.acctransTypeFrm.reset();
            this.formSubmitAttempt = false;

        }

    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.acctransTypeFrm.enable() : this.acctransTypeFrm.disable();
    }

    searchItem(){
        this.searchKeyword = this.searchKeyword.trim();
        if(this.searchKeyword == '' || this.searchKeyword == null ){
            this.accounttransTypes = this.accounttransTypes;
        }

        let filteredAccounttransTypes: any[] = [];

        filteredAccounttransTypes = this.tempAccounttransTypes.filter(
            accountType=>{
                return (accountType.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) !== -1);
            }
        );
        this.accounttransTypes = filteredAccounttransTypes;
    }

}
