import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
// import { MasterLedgerService } from '../../Service/MasterLedger.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { MasterLedger } from '../../Model/MasterLedger/masterLedger';
// import { DBOperation } from '../../Shared/enum';
import { Observable } from 'rxjs/Rx';
// import { Global } from '../../Shared/global';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterLedger } from 'src/app/Model/MasterLedger/masterLedger';
import { DBOperation } from 'src/app/Shared/enum';
import { MasterLedgerService } from './services/MasterLedger.service';
import { Global } from 'src/app/Shared/global';

import * as XLSX from 'xlsx';
//generating pdf
import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

import { DatePipe } from '@angular/common';
import { EntityMock } from 'src/app/Model/Account/account';

@Component({
    templateUrl: './master-ledger.component.html'
})
export class MasterLedgerComponent implements OnInit {
    @ViewChild('template') TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    masterLedgers: MasterLedger[];
    tempMasterLedgers: MasterLedger[];
    masterLedger: MasterLedger;
    msg: string;
    indLoading: boolean = false;
    masterLedgerFrm: FormGroup;
    taxLedgerFrm: FormGroup;
    addressFrm: FormGroup;
    settingFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    public entityLists: EntityMock[];
    
    searchKeyword = '';

    public company: any = {};


    toExportFileName: string = 'Master Ledger-' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
    toPdfFileName: string = 'Master Ledger-' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';
    
    constructor(private fb: FormBuilder, private _masterLedgerService: MasterLedgerService, private modalService: BsModalService,private date: DatePipe,) { 
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' }
        ];

        this.company = JSON.parse(localStorage.getItem('company'));
    }

    ngOnInit(): void {
        this.masterLedgerFrm = this.fb.group({
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
            DRCR: [''],
            UnderGroupMaster:[''],
            Currency:[''],
            // entityLists: ['', Validators.required],
        })

        this.LoadMasters();

    }

    LoadMasters(): void {
        this.indLoading = true;
        this._masterLedgerService.get(Global.BASE_ACCOUNT_ENDPOINT)
            .subscribe(masterLedgers => { 
                this.masterLedgers = masterLedgers; 
                this.tempMasterLedgers = masterLedgers;
                console.log('the ledgers are ', this.masterLedgers)
                this.indLoading = false; 
            },
            error => this.msg = <any>error);
    }

    addMasterLedger() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Ledger";
        this.modalBtnTitle = "Save";
        this.masterLedgerFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl' });
    }

    editMasterLedger(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Ledger";
        this.modalBtnTitle = "Save";
        this.masterLedger = this.masterLedgers.filter(x => x.Id == Id)[0];
        // this.masterLedgerFrm.controls['UnderGroupMaster'].setValue('');
        // this.masterLedgerFrm.setValue(this.masterLedger);
        this.masterLedgerFrm.controls['Id'].setValue(this.masterLedger.Id),
        this.masterLedgerFrm.controls['Name'].setValue(this.masterLedger.Name),
        this.masterLedgerFrm.controls['AccountTypeId'].setValue(this.masterLedger.AccountTypeId),
        this.masterLedgerFrm.controls['ForeignCurrencyId'].setValue(this.masterLedger.ForeignCurrencyId),
        this.masterLedgerFrm.controls['TaxClassificationName'].setValue(this.masterLedger.TaxClassificationName),
        this.masterLedgerFrm.controls['TaxType'].setValue(this.masterLedger.TaxType),
        this.masterLedgerFrm.controls['TaxRate'].setValue(this.masterLedger.TaxRate),
        this.masterLedgerFrm.controls['GSTType'].setValue(this.masterLedger.GSTType),
        this.masterLedgerFrm.controls['ServiceCategory'].setValue(this.masterLedger.ServiceCategory),
        this.masterLedgerFrm.controls['ExciseDutyType'].setValue(this.masterLedger.ExciseDutyType),
        this.masterLedgerFrm.controls['TraderLedNatureOfPurchase'].setValue(this.masterLedger.TraderLedNatureOfPurchase),
        this.masterLedgerFrm.controls['TDSDeducteeType'].setValue(this.masterLedger.TDSDeducteeType),
        this.masterLedgerFrm.controls['TDSRateName'].setValue(this.masterLedger.TDSRateName),
        this.masterLedgerFrm.controls['LedgerFBTCategory'].setValue(this.masterLedger.LedgerFBTCategory),
        this.masterLedgerFrm.controls['IsBillWiseOn'].setValue(this.masterLedger.IsBillWiseOn),
        this.masterLedgerFrm.controls['ISCostCentresOn'].setValue(this.masterLedger.ISCostCentresOn),
        this.masterLedgerFrm.controls['IsInterestOn'].setValue(this.masterLedger.IsInterestOn),
        this.masterLedgerFrm.controls['AllowInMobile'].setValue(this.masterLedger.AllowInMobile),
        this.masterLedgerFrm.controls['IsCondensed'].setValue(this.masterLedger.IsCondensed),
        this.masterLedgerFrm.controls['AffectsStock'].setValue(this.masterLedger.AffectsStock),
        this.masterLedgerFrm.controls['ForPayRoll'].setValue(this.masterLedger.ForPayRoll),
        this.masterLedgerFrm.controls['InterestOnBillWise'].setValue(this.masterLedger.InterestOnBillWise),
        this.masterLedgerFrm.controls['OverRideInterest'].setValue(this.masterLedger.OverRideInterest),
        this.masterLedgerFrm.controls['OverRideADVInterest'].setValue(this.masterLedger.OverRideADVInterest),
        this.masterLedgerFrm.controls['IgnoreTDSExempt'].setValue(this.masterLedger.IgnoreTDSExempt),
        this.masterLedgerFrm.controls['UseForVat'].setValue(this.masterLedger.UseForVat),
        this.masterLedgerFrm.controls['IsTCSApplicable'].setValue(this.masterLedger.IsTCSApplicable),
        this.masterLedgerFrm.controls['IsTDSApplicable'].setValue(this.masterLedger.IsTDSApplicable),
        this.masterLedgerFrm.controls['IsFBTApplicable'].setValue(this.masterLedger.IsFBTApplicable),
        this.masterLedgerFrm.controls['IsGSTApplicable'].setValue(this.masterLedger.IsGSTApplicable),
        this.masterLedgerFrm.controls['ShowInPaySlip'].setValue(this.masterLedger.ShowInPaySlip),
        this.masterLedgerFrm.controls['UseForGratuity'].setValue(this.masterLedger.UseForGratuity),
        this.masterLedgerFrm.controls['ForServiceTax'].setValue(this.masterLedger.ForServiceTax),
        this.masterLedgerFrm.controls['IsInputCredit'].setValue(this.masterLedger.IsInputCredit),
        this.masterLedgerFrm.controls['IsExempte'].setValue(this.masterLedger.IsExempte),
        this.masterLedgerFrm.controls['IsAbatementApplicable'].setValue(this.masterLedger.IsAbatementApplicable),
        this.masterLedgerFrm.controls['TDSDeducteeIsSpecialRate'].setValue(this.masterLedger.TDSDeducteeIsSpecialRate),
        this.masterLedgerFrm.controls['Audited'].setValue(this.masterLedger.Audited),
        this.masterLedgerFrm.controls['SortPosition'].setValue(this.masterLedger.SortPosition),
        this.masterLedgerFrm.controls['OpeningBalance'].setValue(this.masterLedger.OpeningBalance),
        this.masterLedgerFrm.controls['InventoryValue'].setValue(this.masterLedger.InventoryValue),
        this.masterLedgerFrm.controls['MaintainBilByBill'].setValue(this.masterLedger.MaintainBilByBill),
        this.masterLedgerFrm.controls['Address'].setValue(this.masterLedger.Address),
        this.masterLedgerFrm.controls['District'].setValue(this.masterLedger.District),
        this.masterLedgerFrm.controls['City'].setValue(this.masterLedger.City),
        this.masterLedgerFrm.controls['Street'].setValue(this.masterLedger.Street),
        this.masterLedgerFrm.controls['PanNo'].setValue(this.masterLedger.PanNo),
        this.masterLedgerFrm.controls['Telephone'].setValue(this.masterLedger.Telephone),
        this.masterLedgerFrm.controls['Email'].setValue(this.masterLedger.Email),
        this.masterLedgerFrm.controls['Amount'].setValue(this.masterLedger.Amount),
        this.masterLedgerFrm.controls['DRCR'].setValue(this.masterLedger.DRCR),
        this.masterLedgerFrm.controls['UnderGroupMaster'].setValue(this.masterLedger.UnderGroupMaster),
        this.masterLedgerFrm.controls['Currency'].setValue(this.masterLedger.Currency),
        
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    deleteMasterLedger(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.masterLedger = this.masterLedgers.filter(x => x.Id == id)[0];
        // this.masterLedgerFrm.setValue(this.masterLedger);

        this.masterLedgerFrm.controls['Id'].setValue(this.masterLedger.Id),
        this.masterLedgerFrm.controls['Name'].setValue(this.masterLedger.Name),
        this.masterLedgerFrm.controls['AccountTypeId'].setValue(this.masterLedger.AccountTypeId),
        this.masterLedgerFrm.controls['ForeignCurrencyId'].setValue(this.masterLedger.ForeignCurrencyId),
        this.masterLedgerFrm.controls['TaxClassificationName'].setValue(this.masterLedger.TaxClassificationName),
        this.masterLedgerFrm.controls['TaxType'].setValue(this.masterLedger.TaxType),
        this.masterLedgerFrm.controls['TaxRate'].setValue(this.masterLedger.TaxRate),
        this.masterLedgerFrm.controls['GSTType'].setValue(this.masterLedger.GSTType),
        this.masterLedgerFrm.controls['ServiceCategory'].setValue(this.masterLedger.ServiceCategory),
        this.masterLedgerFrm.controls['ExciseDutyType'].setValue(this.masterLedger.ExciseDutyType),
        this.masterLedgerFrm.controls['TraderLedNatureOfPurchase'].setValue(this.masterLedger.TraderLedNatureOfPurchase),
        this.masterLedgerFrm.controls['TDSDeducteeType'].setValue(this.masterLedger.TDSDeducteeType),
        this.masterLedgerFrm.controls['TDSRateName'].setValue(this.masterLedger.TDSRateName),
        this.masterLedgerFrm.controls['LedgerFBTCategory'].setValue(this.masterLedger.LedgerFBTCategory),
        this.masterLedgerFrm.controls['IsBillWiseOn'].setValue(this.masterLedger.IsBillWiseOn),
        this.masterLedgerFrm.controls['ISCostCentresOn'].setValue(this.masterLedger.ISCostCentresOn),
        this.masterLedgerFrm.controls['IsInterestOn'].setValue(this.masterLedger.IsInterestOn),
        this.masterLedgerFrm.controls['AllowInMobile'].setValue(this.masterLedger.AllowInMobile),
        this.masterLedgerFrm.controls['IsCondensed'].setValue(this.masterLedger.IsCondensed),
        this.masterLedgerFrm.controls['AffectsStock'].setValue(this.masterLedger.AffectsStock),
        this.masterLedgerFrm.controls['ForPayRoll'].setValue(this.masterLedger.ForPayRoll),
        this.masterLedgerFrm.controls['InterestOnBillWise'].setValue(this.masterLedger.InterestOnBillWise),
        this.masterLedgerFrm.controls['OverRideInterest'].setValue(this.masterLedger.OverRideInterest),
        this.masterLedgerFrm.controls['OverRideADVInterest'].setValue(this.masterLedger.OverRideADVInterest),
        this.masterLedgerFrm.controls['IgnoreTDSExempt'].setValue(this.masterLedger.IgnoreTDSExempt),
        this.masterLedgerFrm.controls['UseForVat'].setValue(this.masterLedger.UseForVat),
        this.masterLedgerFrm.controls['IsTCSApplicable'].setValue(this.masterLedger.IsTCSApplicable),
        this.masterLedgerFrm.controls['IsTDSApplicable'].setValue(this.masterLedger.IsTDSApplicable),
        this.masterLedgerFrm.controls['IsFBTApplicable'].setValue(this.masterLedger.IsFBTApplicable),
        this.masterLedgerFrm.controls['IsGSTApplicable'].setValue(this.masterLedger.IsGSTApplicable),
        this.masterLedgerFrm.controls['ShowInPaySlip'].setValue(this.masterLedger.ShowInPaySlip),
        this.masterLedgerFrm.controls['UseForGratuity'].setValue(this.masterLedger.UseForGratuity),
        this.masterLedgerFrm.controls['ForServiceTax'].setValue(this.masterLedger.ForServiceTax),
        this.masterLedgerFrm.controls['IsInputCredit'].setValue(this.masterLedger.IsInputCredit),
        this.masterLedgerFrm.controls['IsExempte'].setValue(this.masterLedger.IsExempte),
        this.masterLedgerFrm.controls['IsAbatementApplicable'].setValue(this.masterLedger.IsAbatementApplicable),
        this.masterLedgerFrm.controls['TDSDeducteeIsSpecialRate'].setValue(this.masterLedger.TDSDeducteeIsSpecialRate),
        this.masterLedgerFrm.controls['Audited'].setValue(this.masterLedger.Audited),
        this.masterLedgerFrm.controls['SortPosition'].setValue(this.masterLedger.SortPosition),
        this.masterLedgerFrm.controls['OpeningBalance'].setValue(this.masterLedger.OpeningBalance),
        this.masterLedgerFrm.controls['InventoryValue'].setValue(this.masterLedger.InventoryValue),
        this.masterLedgerFrm.controls['MaintainBilByBill'].setValue(this.masterLedger.MaintainBilByBill),
        this.masterLedgerFrm.controls['Address'].setValue(this.masterLedger.Address),
        this.masterLedgerFrm.controls['District'].setValue(this.masterLedger.District),
        this.masterLedgerFrm.controls['City'].setValue(this.masterLedger.City),
        this.masterLedgerFrm.controls['Street'].setValue(this.masterLedger.Street),
        this.masterLedgerFrm.controls['PanNo'].setValue(this.masterLedger.PanNo),
        this.masterLedgerFrm.controls['Telephone'].setValue(this.masterLedger.Telephone),
        this.masterLedgerFrm.controls['Email'].setValue(this.masterLedger.Email),
        this.masterLedgerFrm.controls['Amount'].setValue(this.masterLedger.Amount),
        this.masterLedgerFrm.controls['DRCR'].setValue(this.masterLedger.DRCR),
        this.masterLedgerFrm.controls['UnderGroupMaster'].setValue(this.masterLedger.UnderGroupMaster),
        this.masterLedgerFrm.controls['Currency'].setValue(this.masterLedger.Currency),

        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
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
       
        
        //this.isChecked = Number(data['status']) === 0 ? false : true;
        this.msg = "";
        let master = this.masterLedgerFrm;
        this.formSubmitAttempt = true;

        console.log(this.masterLedgerFrm);
        
                    
        // if (master.valid) {
                    
            switch (this.dbops) {
                    
                case DBOperation.create:
                    
                    this._masterLedgerService.post(Global.BASE_MASTERLEDGER_ENDPOINT, this.masterLedgerFrm.value).subscribe(
                        data => {
                            console.log('aayo hai',data);
                            
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                // this.openModal2(this.TemplateRef2); 
                                this.LoadMasters();
                                this.formSubmitAttempt = true;
                                this.modalRef.hide();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                
                case DBOperation.update:
                    this._masterLedgerService.put(Global.BASE_MASTERLEDGER_ENDPOINT, this.masterLedgerFrm.value.Id, this.masterLedgerFrm.value).subscribe(
                        data => {
                            console.log('aayo hai',data);
                            
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                // this.openModal2(this.TemplateRef2); 
                                this.LoadMasters();
                                this.formSubmitAttempt = true;
                                this.modalRef.hide();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
                
                case DBOperation.delete:
                    this._masterLedgerService.delete(Global.BASE_MASTERLEDGER_ENDPOINT, this.masterLedgerFrm.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully deleted.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.LoadMasters();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            //this.modal.dismiss();
                        },
                        error => {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    );
                    break;
            }

        // }
        //  else {
        //     this.validateAllFields(this.masterLedgerFrm);
        // }
    }

    confirm(): void {
        this.modalRef2.hide();
    }

    reset() {
        this.modalRef.hide();
        // let control = this.masterLedgerFrm.controls['Id'].value;
        // if (control > 0) {
        //     this.buttonDisabled = true;
        // } else {
        //     this.masterLedgerFrm.reset();
        // }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.masterLedgerFrm.enable() : this.masterLedgerFrm.disable();
    }

    searchItem(){
        this.searchKeyword = this.searchKeyword.trim();
        if(this.searchKeyword == '' || this.searchKeyword == null ){
            this.masterLedgers = this.masterLedgers;
        }

        let filteredMasterLedgers: any[] = [];

        filteredMasterLedgers = this.tempMasterLedgers.filter(
            ledger=>{
                return (ledger.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) !== -1);
            }
        );
        this.masterLedgers = filteredMasterLedgers;
    }

    exportTableToExcel(tableID) {
        let element = document.getElementById('ledgersTable'); 
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
        ws['!cols'] = [];
        ws['!cols'][1] = { hidden: true };

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

        rows.push(['S.No','Name']);

        this.masterLedgers.forEach(masterLedger => {
            var tempMasterLedger = [
                sn,
                masterLedger.Name,
            ];

            sn = sn * 1 + 1;
            rows.push(tempMasterLedger);
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
}