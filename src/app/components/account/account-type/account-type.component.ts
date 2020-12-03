import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountType } from '../../../Model/AccountType/accountType';
import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DatePipe } from '@angular/common';
import { AccountTypeService } from '../master-ledger/services/account-type.service';

@Component({
    templateUrl: './account-type.component.html'
})

export class AccountTypeComponent implements OnInit {
    @ViewChild('template') TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    accountTypes: AccountType[];
    accountType: AccountType;
    msg: string;
    indLoading: boolean = false;
    accTypeFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;

    constructor(private fb: FormBuilder, private accTypeService: AccountTypeService, private modalService: BsModalService, private date: DatePipe) {
        // this.accTypeService.getaccounttypes().subscribe(data => { this.accountTypes = data });
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
            .subscribe(accounttypes => { this.accountTypes = accounttypes; this.indLoading = false; },
            error => this.msg = <any>error);
    }

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
        filename = filename ? filename + '.xls' : 'Account Type of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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

}
