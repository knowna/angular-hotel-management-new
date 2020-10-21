import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Account, EntityMock } from '../../../Model/Account/account';
import { AccountType } from '../../../Model/AccountType/accountType';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';

@Component({
    templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
    @ViewChild('template',{static:false})
 TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested',{static:false}) TemplateRef2: TemplateRef<any>;
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    // public acctype: Observable<AccountType>;
    public acctype;
    accounts: Account[];
    account: Account;
    public accounttype: AccountType;
    currentAmount: number;
    public entityLists: EntityMock[];
    msg: string;
    indLoading: boolean = false;
    accountLedgerFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    singleSelect: any = [];

    constructor(private fb: FormBuilder, private accountService: AccountTransactionTypeService
, private modalService: BsModalService, private date: DatePipe) {
        this.accountService.getAccountTypes().subscribe(data => { this.acctype = data });
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' }
        ];
    }

    ngOnInit(): void {
        this.accountLedgerFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            AccountTypeId: ['', Validators.required],
            ForeignCurrencyId: [''],
            TaxClassificationName: [''],
            TaxType: [''],
            TaxRate: [''],
            GSTType: [''],
            ServiceCategory: [''],
            ExciseDutyType: [''],
            TraderLedNatureOfPurchase: [''],
            TDSDeducteeType: [''],
            TDSRateName: [''],
            LedgerFBTCategory: [''],
            IsBillWiseOn: [''],
            ISCostCentresOn: [''],
            IsInterestOn: [''],
            AllowInMobile: [''],
            IsCondensed: [''],
            AffectsStock: [''],
            ForPayRoll: [''],
            InterestOnBillWise: [''],
            OverRideInterest: [''],
            OverRideADVInterest: [''],
            IgnoreTDSExempt: [''],
            UseForVat: [''],
            IsTCSApplicable: [''],
            IsTDSApplicable: [''],
            IsFBTApplicable: [''],
            IsGSTApplicable: [''],
            ShowInPaySlip: [''],
            UseForGratuity: [''],
            ForServiceTax: [''],
            IsInputCredit: [''],
            IsExempte: [''],
            IsAbatementApplicable: [''],
            TDSDeducteeIsSpecialRate: [''],
            Audited: [],
            SortPosition: [''],
            OpeningBalance: [''],
            InventoryValue: false,
            MaintainBilByBill: false,
            Address: [''],
            District: [''],
            City: [''],
            Street: [''],
            PanNo: [''],
            Telephone: [''],
            Email: [''],
            Amount: ['', [Validators.required, Validators.pattern(/^[.\d]+$/)]],
            entityLists: ['', Validators.required],
        });
    
        this.LoadMasters();
    }

    LoadMasters(): void {
        this.indLoading = true;
        this.accountService.get(Global.BASE_ACCOUNT_ENDPOINT)
            .subscribe(accounts => { this.accounts = accounts; this.indLoading = false; },
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
        filename = filename ? filename + '.xls' : 'Account List of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

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

    addAccounts() {
        
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Ledger";
        this.modalBtnTitle = "Save";
        this.accountLedgerFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }
    
    editAccounts(Id: number) {
        
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Ledger";
        this.modalBtnTitle = "Update";
        this.account = this.accounts.filter(x => x.Id == Id)[0];
        this.currentAmount = parseFloat(this.account.Amount) ; 
        if (this.currentAmount < 0) {
            this.accountLedgerFrm.controls['Amount'].setValue(Math.abs(parseFloat(this.account.Amount)));
            this.accountLedgerFrm.controls['entityLists'].setValue("Cr");
        }
        else {
            this.accountLedgerFrm.controls['Amount'].setValue(this.account.Amount);
            this.accountLedgerFrm.controls['entityLists'].setValue("Dr");
        }
        this.accountLedgerFrm.controls['Id'].setValue(this.account.Id);
        this.accountLedgerFrm.controls['Name'].setValue(this.account.Name);
        this.accounttype = this.acctype.filter(x => x.Id === this.account.AccountTypeId)[0];
        if (this.accounttype !== undefined) {
            this.accountLedgerFrm.controls['AccountTypeId'].setValue(this.accounttype.Name);
        }
        this.accountLedgerFrm.controls['ForeignCurrencyId'].setValue(this.account.ForeignCurrencyId);
        this.accountLedgerFrm.controls['TaxClassificationName'].setValue(this.account.TaxClassificationName);
        this.accountLedgerFrm.controls['TaxType'].setValue(this.account.TaxType);
        this.accountLedgerFrm.controls['TaxRate'].setValue(this.account.TaxRate);
        this.accountLedgerFrm.controls['GSTType'].setValue(this.account.GSTType);
        this.accountLedgerFrm.controls['ServiceCategory'].setValue(this.account.ServiceCategory);
        this.accountLedgerFrm.controls['ExciseDutyType'].setValue(this.account.ExciseDutyType);
        this.accountLedgerFrm.controls['TraderLedNatureOfPurchase'].setValue(this.account.TraderLedNatureOfPurchase);
        this.accountLedgerFrm.controls['TDSDeducteeType'].setValue(this.account.TDSDeducteeType);
        this.accountLedgerFrm.controls['TDSRateName'].setValue(this.account.TDSRateName);
        this.accountLedgerFrm.controls['LedgerFBTCategory'].setValue(this.account.LedgerFBTCategory);
        this.accountLedgerFrm.controls['IsBillWiseOn'].setValue(this.account.IsBillWiseOn);
        this.accountLedgerFrm.controls['ISCostCentresOn'].setValue(this.account.ISCostCentresOn);
        this.accountLedgerFrm.controls['IsInterestOn'].setValue(this.account.IsInterestOn);
        this.accountLedgerFrm.controls['AllowInMobile'].setValue(this.account.AllowInMobile);
        this.accountLedgerFrm.controls['IsCondensed'].setValue(this.account.IsCondensed);
        this.accountLedgerFrm.controls['AffectsStock'].setValue(this.account.AffectsStock);
        this.accountLedgerFrm.controls['ForPayRoll'].setValue(this.account.ForPayRoll);
        this.accountLedgerFrm.controls['InterestOnBillWise'].setValue(this.account.InterestOnBillWise);
        this.accountLedgerFrm.controls['OverRideInterest'].setValue(this.account.OverRideInterest);
        this.accountLedgerFrm.controls['OverRideADVInterest'].setValue(this.account.OverRideADVInterest);
        this.accountLedgerFrm.controls['UseForVat'].setValue(this.account.UseForVat);
        this.accountLedgerFrm.controls['IgnoreTDSExempt'].setValue(this.account.IgnoreTDSExempt);
        this.accountLedgerFrm.controls['IsTCSApplicable'].setValue(this.account.IsTCSApplicable);
        this.accountLedgerFrm.controls['IsTDSApplicable'].setValue(this.account.IsTDSApplicable);
        this.accountLedgerFrm.controls['IsFBTApplicable'].setValue(this.account.IsFBTApplicable);
        this.accountLedgerFrm.controls['IsGSTApplicable'].setValue(this.account.IsGSTApplicable);
        this.accountLedgerFrm.controls['ShowInPaySlip'].setValue(this.account.ShowInPaySlip);
        this.accountLedgerFrm.controls['UseForGratuity'].setValue(this.account.UseForGratuity);
        this.accountLedgerFrm.controls['ForServiceTax'].setValue(this.account.ForServiceTax);
        this.accountLedgerFrm.controls['IsInputCredit'].setValue(this.account.IsInputCredit);
        this.accountLedgerFrm.controls['IsExempte'].setValue(this.account.IsExempte);
        this.accountLedgerFrm.controls['IsAbatementApplicable'].setValue(this.account.IsAbatementApplicable);
        this.accountLedgerFrm.controls['TDSDeducteeIsSpecialRate'].setValue(this.account.TDSDeducteeIsSpecialRate);
        this.accountLedgerFrm.controls['Audited'].setValue(this.account.Audited);
        this.accountLedgerFrm.controls['SortPosition'].setValue(this.account.SortPosition);
        this.accountLedgerFrm.controls['OpeningBalance'].setValue(this.account.OpeningBalance);
        this.accountLedgerFrm.controls['InventoryValue'].setValue(this.account.InventoryValue);
        this.accountLedgerFrm.controls['MaintainBilByBill'].setValue(this.account.MaintainBilByBill);
        this.accountLedgerFrm.controls['Address'].setValue(this.account.Address);
        this.accountLedgerFrm.controls['District'].setValue(this.account.District);
        this.accountLedgerFrm.controls['City'].setValue(this.account.City);
        this.accountLedgerFrm.controls['Street'].setValue(this.account.Street);
        this.accountLedgerFrm.controls['PanNo'].setValue(this.account.PanNo);
        this.accountLedgerFrm.controls['Telephone'].setValue(this.account.Telephone);
        this.accountLedgerFrm.controls['Email'].setValue(this.account.Email);
        //this.accountLedgerFrm.controls['Currency'].setValue(this.account.Currency);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg'
        });
    }

    deleteAccounts(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Ledger?";
        this.modalBtnTitle = "Delete";
        this.account = this.accounts.filter(x => x.Id == id)[0];
        this.currentAmount = parseFloat(this.account.Amount);
        if (this.currentAmount < 0) {
            this.accountLedgerFrm.controls['Amount'].setValue(Math.abs(parseFloat(this.account.Amount)));
            this.accountLedgerFrm.controls['entityLists'].setValue("Cr");
        }
        else {
            this.accountLedgerFrm.controls['Amount'].setValue(this.account.Amount);
            this.accountLedgerFrm.controls['entityLists'].setValue("Dr");
        }
        this.accountLedgerFrm.controls['Id'].setValue(this.account.Id);
        this.accountLedgerFrm.controls['Name'].setValue(this.account.Name);
        this.accounttype = this.acctype.filter(x => x.Id === this.account.AccountTypeId)[0];
        if (this.accounttype !== undefined) {
            this.accountLedgerFrm.controls['AccountTypeId'].setValue(this.accounttype.Name);
        }
        this.accountLedgerFrm.controls['ForeignCurrencyId'].setValue(this.account.ForeignCurrencyId);
        this.accountLedgerFrm.controls['TaxClassificationName'].setValue(this.account.TaxClassificationName);
        this.accountLedgerFrm.controls['TaxType'].setValue(this.account.TaxType);
        this.accountLedgerFrm.controls['TaxRate'].setValue(this.account.TaxRate);
        this.accountLedgerFrm.controls['GSTType'].setValue(this.account.GSTType);
        this.accountLedgerFrm.controls['ServiceCategory'].setValue(this.account.ServiceCategory);
        this.accountLedgerFrm.controls['ExciseDutyType'].setValue(this.account.ExciseDutyType);
        this.accountLedgerFrm.controls['TraderLedNatureOfPurchase'].setValue(this.account.TraderLedNatureOfPurchase);
        this.accountLedgerFrm.controls['TDSDeducteeType'].setValue(this.account.TDSDeducteeType);
        this.accountLedgerFrm.controls['TDSRateName'].setValue(this.account.TDSRateName);
        this.accountLedgerFrm.controls['LedgerFBTCategory'].setValue(this.account.LedgerFBTCategory);
        this.accountLedgerFrm.controls['IsBillWiseOn'].setValue(this.account.IsBillWiseOn);
        this.accountLedgerFrm.controls['ISCostCentresOn'].setValue(this.account.ISCostCentresOn);
        this.accountLedgerFrm.controls['IsInterestOn'].setValue(this.account.IsInterestOn);
        this.accountLedgerFrm.controls['AllowInMobile'].setValue(this.account.AllowInMobile);
        this.accountLedgerFrm.controls['IsCondensed'].setValue(this.account.IsCondensed);
        this.accountLedgerFrm.controls['AffectsStock'].setValue(this.account.AffectsStock);
        this.accountLedgerFrm.controls['ForPayRoll'].setValue(this.account.ForPayRoll);
        this.accountLedgerFrm.controls['InterestOnBillWise'].setValue(this.account.InterestOnBillWise);
        this.accountLedgerFrm.controls['OverRideInterest'].setValue(this.account.OverRideInterest);
        this.accountLedgerFrm.controls['OverRideADVInterest'].setValue(this.account.OverRideADVInterest);
        this.accountLedgerFrm.controls['UseForVat'].setValue(this.account.UseForVat);
        this.accountLedgerFrm.controls['IgnoreTDSExempt'].setValue(this.account.IgnoreTDSExempt);
        this.accountLedgerFrm.controls['IsTCSApplicable'].setValue(this.account.IsTCSApplicable);
        this.accountLedgerFrm.controls['IsTDSApplicable'].setValue(this.account.IsTDSApplicable);
        this.accountLedgerFrm.controls['IsFBTApplicable'].setValue(this.account.IsFBTApplicable);
        this.accountLedgerFrm.controls['IsGSTApplicable'].setValue(this.account.IsGSTApplicable);
        this.accountLedgerFrm.controls['ShowInPaySlip'].setValue(this.account.ShowInPaySlip);
        this.accountLedgerFrm.controls['UseForGratuity'].setValue(this.account.UseForGratuity);
        this.accountLedgerFrm.controls['ForServiceTax'].setValue(this.account.ForServiceTax);
        this.accountLedgerFrm.controls['IsInputCredit'].setValue(this.account.IsInputCredit);
        this.accountLedgerFrm.controls['IsExempte'].setValue(this.account.IsExempte);
        this.accountLedgerFrm.controls['IsAbatementApplicable'].setValue(this.account.IsAbatementApplicable);
        this.accountLedgerFrm.controls['TDSDeducteeIsSpecialRate'].setValue(this.account.TDSDeducteeIsSpecialRate);
        this.accountLedgerFrm.controls['Audited'].setValue(this.account.Audited);
        this.accountLedgerFrm.controls['SortPosition'].setValue(this.account.SortPosition);
        this.accountLedgerFrm.controls['OpeningBalance'].setValue(this.account.OpeningBalance);
        this.accountLedgerFrm.controls['InventoryValue'].setValue(this.account.InventoryValue);
        this.accountLedgerFrm.controls['MaintainBilByBill'].setValue(this.account.MaintainBilByBill);
        this.accountLedgerFrm.controls['Address'].setValue(this.account.Address);
        this.accountLedgerFrm.controls['District'].setValue(this.account.District);
        this.accountLedgerFrm.controls['City'].setValue(this.account.City);
        this.accountLedgerFrm.controls['Street'].setValue(this.account.Street);
        this.accountLedgerFrm.controls['PanNo'].setValue(this.account.PanNo);
        this.accountLedgerFrm.controls['Telephone'].setValue(this.account.Telephone);
        this.accountLedgerFrm.controls['Email'].setValue(this.account.Email);
        //this.accountLedgerFrm.controls['Currency'].setValue(this.account.Currency);
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

    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    }

    onSubmit() {
        
        this.msg = "";
        let master = this.accountLedgerFrm;
        this.formSubmitAttempt = true;
        if (master.valid) {
            let DRCR = master.get('entityLists').value;
            if (DRCR == "Cr") {
                let Amount = master.get('Amount').value;
                Amount = -Amount;
                master.get('Amount').setValue(Amount);
            }
            else {
                let Amount = master.get('Amount').value;
                Amount = Amount;
                master.get('Amount').setValue(Amount);
            }
            let AccountType = master.get('AccountTypeId').value;
            let AccountTypeId = AccountType.Id;
            master.get('AccountTypeId').setValue(AccountTypeId);

            switch (this.dbops) {
                case DBOperation.create:
                    this.accountService.post(Global.BASE_ACCOUNT_ENDPOINT, master.value).subscribe(
                        data => {
                            
                            if (data == 1) //Success
                            {
                                this.openModal2(this.TemplateRef2);
                                this.LoadMasters();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },

                    );

                case DBOperation.update:
                    this.accountService.put(Global.BASE_ACCOUNT_ENDPOINT, master.value.Id, master.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                         
                                this.openModal2(this.TemplateRef2);
                                this.LoadMasters();
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
                    this.accountService.delete(Global.BASE_ACCOUNT_ENDPOINT, master.value.Id).subscribe(
                        data => {
                            if (data == 1) {
                                alert("Data deleted sucessfully");
                                this.LoadMasters();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        }
                    );
            }

        }

        else {
            this.validateAllFields(master);
        }
    }

    confirm(): void {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    }

    reset() {
        //
        let control = this.accountLedgerFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.accountLedgerFrm.reset();
        }
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.accountLedgerFrm.enable() : this.accountLedgerFrm.disable();
    }
    searchChange($event) {
        console.log($event);
    }
    config = {
        displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000
    };
    download() {
        var doc = new jsPDF();
        doc.text(20, 20, 'Hello world!');
        doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
        doc.addPage();
        doc.text(20, 20, 'Do you like that?');

        // Save the PDF
        doc.save('Test.pdf');
    }
}