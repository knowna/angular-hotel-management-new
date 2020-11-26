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

@Component({
    templateUrl: './master-ledger.component.html'
})
export class MasterLedgerComponent implements OnInit {
    @ViewChild('template') TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    masterLedgers: MasterLedger[];
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

    constructor(private fb: FormBuilder, private _masterLedgerService: MasterLedgerService, private modalService: BsModalService) { }

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
            // entityLists: ['', Validators.required],
        })

        this.LoadMasters();

    }

    LoadMasters(): void {
        this.indLoading = true;
        this._masterLedgerService.get(Global.BASE_ACCOUNT_ENDPOINT)
            .subscribe(masterLedgers => { 
                this.masterLedgers = masterLedgers; 
                console.log('the ledgers are ', this.masterLedgers)
                this.indLoading = false; 
            },
            error => this.msg = <any>error);
    }

    addMasterLedger() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Master Ledger";
        this.modalBtnTitle = "Add";
        this.masterLedgerFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-lg' });
    }

    editMasterLedger(Id: number) {
        //debugger;
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Group Ledger";
        this.modalBtnTitle = "Update";
        this.masterLedger = this.masterLedgers.filter(x => x.Id == Id)[0];
        this.masterLedgerFrm.setValue(this.masterLedger);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
        });
    }

    deleteMasterLedger(id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.masterLedger = this.masterLedgers.filter(x => x.Id == id)[0];
        this.masterLedgerFrm.setValue(this.masterLedger);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false
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
        if (master.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    // this._masterLedgerService.post(Global.BASE_MASTERLEDGER_ENDPOINT, master.value).subscribe(
                    //     data => {

                    //         if (data == 1) //Success
                    //         {
                    //             //alert("Data successfully added.");
                    //             this.openModal2(this.TemplateRef2); 
                    //             this.LoadMasters();
                    //         }
                    //         else {
                    //             alert("There is some issue in saving records, please contact to system administrator!");
                    //         }
                    //     },
                    //     error => {
                    //         this.msg = error;
                    //     }
                    // );
            }

        } else {
            this.validateAllFields(master);
        }
    }

    confirm(): void {
        this.modalRef2.hide();
    }

    reset() {
        //debugger;
        let control = this.masterLedgerFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        } else {
            this.masterLedgerFrm.reset();
        }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.masterLedgerFrm.enable() : this.masterLedgerFrm.disable();
    }
}