﻿import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountType } from '../../../../Model/AccountType/accountType';
import { DBOperation } from '../../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../../Shared/global';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DatePipe } from '@angular/common';
import { AccountTypeService } from '../master-ledger/services/account-type.service';

import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

@Component({
    templateUrl: './account-type.component.html'
})

export class AccountTypeComponent implements OnInit {
    @ViewChild('template') TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    accountTypes: AccountType[];
    tempAccountTypes: AccountType[];
    accountType: AccountType;
    msg: string;
    indLoading: boolean = false;
    accTypeFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    public company: any = {};

    searchKeyword = '';

    toExportFileName: string = 'Group Ledger-' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Group Ledger-' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

    constructor(private fb: FormBuilder, private accTypeService: AccountTypeService, private modalService: BsModalService, private date: DatePipe) {
        // this.accTypeService.getaccounttypes().subscribe(data => { this.accountTypes = data });
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    ngOnInit(): void {
        this.accTypeFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            DefaultFilterType: [''],
            WorkingRule: [''],
            SortOrder: [''],
            UserString: [''],
            Tags: [''],
            UnderGroupLedger: ['', Validators.required],
            NatureofGroup: ['', Validators.required],
            GroupSubLedger: false,
            DebitCreditBalanceReporting: false,
            UsedforCalculation: false,
            PurchaseInvoiceAllocation: false,
            AFFECTSGROSSPROFIT: false,
            ISBILLWISEON: false,
            ISCOSTCENTRESON: false,
            ISADDABLE: false,
            ISREVENUE: false,
            ISDEEMEDPOSITIVE: false,
            TRACKNEGATIVEBALANCES: false,
            ISCONDENSED: false,
            AFFECTSSTOCK: false,
            SORTPOSITION: false
        });
        this.LoadAccTypes();
    }

    LoadAccTypes(): void {
        this.indLoading = true;
        this.accTypeService.get(Global.BASE_ACCOUNTTYPE_ENDPOINT)
            .subscribe(accounttypes => { 
                this.accountTypes = accounttypes; 
                this.tempAccountTypes = accounttypes; 
                console.log('llll', this.accountTypes)
                this.indLoading = false; 
            },
            error => this.msg = <any>error);
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
        // filename = filename ? filename + '.xls' : 'Account Type of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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
        let element = document.getElementById('GroupLedgerTable'); 
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.toExportFileName);
    }

    exportTableToPdf() {
        var doc = new jsPDF("p", "mm", "a4");
        var rows = [];
        let sn = 1;

        rows.push(['S.No','Group Name','UnderGroup Ledger','Nature Of Group']);

        this.accountTypes.forEach(accountType => {
            var tempAccountType = [
                sn,
                accountType.Name,
                accountType.UnderGroupLedger,
                accountType.NatureofGroup
            ];

            sn = sn * 1 + 1;
            rows.push(tempAccountType);
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



    addAccType() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Group";
        this.modalBtnTitle = "Save";
        this.accTypeFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class:'modal-lg'
        });
      
    }
    editAccType(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Group";
        this.modalBtnTitle = "Save";
        this.accountType = this.accountTypes.filter(x => x.Id == Id)[0];

        let accountType = this.accountTypes.find(x => x.Name === this.accountType.UnderGroupLedger);

        this.accountType.UnderGroupLedger = accountType ? accountType.Id+'' : '';

        this.accTypeFrm.setValue(this.accountType);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class:'modal-lg'
        });
    }

    deleteAccType(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Group?";
        this.modalBtnTitle = "Delete";
        this.accountType = this.accountTypes.filter(x => x.Id == id)[0];
       
        this.accTypeFrm.setValue(this.accountType);
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
        let accountType = this.accTypeFrm
        this.formSubmitAttempt = true;

        // console.log('the account tyoe', accountType.value)

        if (accountType.valid) {
            switch (this.dbops) {
                case DBOperation.create:                  
                    this.accTypeService.post(Global.BASE_ACCOUNTTYPE_ENDPOINT, accountType.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.openModal2(this.TemplateRef2);
                                this.LoadAccTypes();
                            }
                            else {
                                // this.modal.backdrop;
                                this.msg = "There is some issue in saving records, please contact to system administrator!";
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;

                        },
                       
                    );
                    break;
                case DBOperation.update:
                    this.accTypeService.put(Global.BASE_ACCOUNTTYPE_ENDPOINT, accountType.value.Id, accountType.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.openModal2(this.TemplateRef2);
                                this.LoadAccTypes();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },
                    )
                    break;
                case DBOperation.delete:
                    this.accTypeService.delete(Global.BASE_ACCOUNTTYPE_ENDPOINT, accountType.value.Id).subscribe(
                        data => {
                            if (data == 1)
                            {
                                alert("Data deleted sucessfully");
                                this.LoadAccTypes();
                            }
                            else
                            {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        }
                    )
            }
        }
        else {
            this.validateAllFields(accountType);
        }
    }


    confirm(): void {
        this.modalRef2.hide();
    }


    reset() {
        let control = this.accTypeFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.accTypeFrm.reset();

        }

    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.accTypeFrm.enable() : this.accTypeFrm.disable();
    }

    searchItem(){
        this.searchKeyword = this.searchKeyword.trim();
        if(this.searchKeyword == '' || this.searchKeyword == null ){
            this.accountTypes = this.accountTypes;
        }

        let filteredAccountTypes: any[] = [];

        filteredAccountTypes = this.tempAccountTypes.filter(
            account=>{
                return (account.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) !== -1);
            }
        );
        this.accountTypes = filteredAccountTypes;
    }

}
