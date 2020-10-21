import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { MasterLedger } from '../../../Model/MasterLedger/masterLedger';
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';
import { DBOperation } from '../../../Shared/enum';
import { Global } from '../../../Shared/global';

;
@Component({
    templateUrl: './master-ledger.component.html'
})
export class MasterLedgerComponent implements OnInit {
    @ViewChild('template', { static: false })
    TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested', { static: false }) TemplateRef2: TemplateRef<any>;
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

    constructor(private fb: FormBuilder, private _masterLedgerService: AccountTransactionTypeService
        , private modalService: BsModalService) { }

    ngOnInit(): void {
        this.masterLedgerFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            UnderGroupMaster: ['', Validators.required],
            InventoryValue: false,
            MaintainBilByBill: false,
            TaxClassificationName: [''],
            TaxType: ['', Validators.required],
            TaxRate: [''],
            TraderLedNatureOfPurchase: ['', Validators.required],
            TDSDeducteeType: ['', Validators.required],
            TDSRateName: ['', Validators.required],
            Address: ['', Validators.required],
            District: ['', Validators.required],
            City: ['', Validators.required],
            Street: ['', Validators.required],
            PanNo: ['', Validators.required],
            Telephone: ['', Validators.required],
            Email: ['', Validators.required],
            Currency: ['', Validators.required],
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
            Amount: ['', Validators.required]

        })

        this.LoadMasters();

    }

    LoadMasters(): void {
        this.indLoading = true;
        this._masterLedgerService.get(Global.BASE_MASTERLEDGER_ENDPOINT)
            .subscribe(masterLedgers => { this.masterLedgers = masterLedgers; this.indLoading = false; },
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
            keyboard: false
        });
    }

    editMasterLedger(Id: number) {
        //
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
                    this._masterLedgerService.post(Global.BASE_MASTERLEDGER_ENDPOINT, master.value).subscribe(
                        data => {

                            if (data == 1) //Success
                            {
                                //alert("Data successfully added.");
                                this.openModal2(this.TemplateRef2);
                                this.LoadMasters();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                        error => {
                            this.msg = error;
                        }
                    );
            }

        } else {
            this.validateAllFields(master);
        }
    }

    confirm(): void {
        this.modalRef2.hide();
    }

    reset() {
        //
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