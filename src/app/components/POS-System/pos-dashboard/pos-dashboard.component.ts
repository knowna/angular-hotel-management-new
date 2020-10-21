import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Global } from '../../../Shared/global'; 
import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';


// Model
import { Table } from '../../../Model/table.model';
import { Customer } from '../../../Model/customer.model';

// Services
import { TableStoreService } from '../../../Service/Billing/table.store.service';
import { CustomerStoreService } from '../../../Service/Billing/customer.store.service';
import { TicketStoreService } from '../../../Service/Billing/ticket.store.service';

// Selectors
import * as TableSelector from '../../../selectors/table.selector';
import * as CustomerSelector from '../../../selectors/customer.selector';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DBOperation } from '../../../Shared/enum';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Account } from '../../../Model/Account/account';
import { AccountType } from '../../../Model/AccountType/accountType';

@Component({
    selector: 'dcubehotel-pos',
    templateUrl: './pos-dashboard.component.html',
    styleUrls: ['./pos-dashboard.component.css']
})
export class POSDashboardComponent implements OnInit {
    tables$: Observable<Table[]>;
    customers: Observable<Customer[]>;
    public acctype: any;
    account: Account;
    accounts: Account[];
    customerName: string = '';
    tabName: string = '';
    msg: string;
    indLoading: boolean = false;
    accountLedgerFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    @ViewChild('template',{static:false}) TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested',{static:false}) TemplateRef2: TemplateRef<any>;
    
    constructor(
        private router: Router,
        private store: Store<any>,
        private fb: FormBuilder, 
        private activatedRoute: ActivatedRoute,
        private tableStoreService: TableStoreService,
        private customerStoreService: CustomerStoreService,
        private _customerService:AccountTransactionTypeService,
        private accountService: AccountTransactionTypeService
,
        private ticketStoreApi: TicketStoreService,
        private modalService: BsModalService
    ) 
    {
        this.accountService.getAccountTypes().subscribe(data => { this.acctype = data });

        this.activatedRoute.params.subscribe(params => {
            this.tabName = params['tabName'] || 'tables';
        });
    }

    // On init
    ngOnInit() { 
        this.accountLedgerFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required],
            AccountTypeId: [''],
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
            Amount: ['']
        });
             
        this.tables$ = this.store.select(TableSelector.getAllTables);
        console.log("loadedTable",this.tables$)
        this.LoadCustomers();
        this.LoadMasters();
    }

    LoadCustomers() {
        console.log("loading Customers")
        this.indLoading = true;
        this._customerService.get(Global.BASE_ACCOUNT_POSCUSTOMER_ENDPOINT)
            .subscribe(
            customers => {
                this.customers = customers;
                this.indLoading = false;
            },
            error => console.log(error)
        );
    }

    LoadMasters(): void {
        this.indLoading = true;
        this.accountService.get(Global.BASE_ACCOUNT_ENDPOINT)
            .subscribe(accounts => { this.accounts = accounts; this.indLoading = false; },
            error => this.msg = <any>error);
    }

    // set the current selected table Id
    setCurrentTable(table: Table) {
        this.ticketStoreApi.clearAllTickets();
        this.tableStoreService.setCurrentTable(table);
        this.customerStoreService.setCurrentCustomer({ Id: 0 });
        this.router.navigate(['tables', table.TableId]);
    }

    // set current selected customer Id
    setCurrentCustomer(customer: Customer) {
        this.ticketStoreApi.clearAllTickets();
        this.customerStoreService.setCurrentCustomer(customer);
        this.tableStoreService.setCurrentTable({ Id: 0, TableId: '' });
        this.router.navigate(['customer', customer.Id]);
    }

    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
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

    addAccounts() {
         ;
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Ledger";
        this.modalBtnTitle = "Save & Submit";
        this.accountLedgerFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    editAccounts(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Ledger";
        this.modalBtnTitle = "Update";
        this.account = this.accounts.filter(x => x.Id == Id)[0];
        this.accountLedgerFrm.setValue(this.account);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    deleteAccounts(Id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Ledger?";
        this.modalBtnTitle = "Delete";
        this.account = this.accounts.filter(x => x.Id == Id)[0];
        this.accountLedgerFrm.setValue(this.account);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class: 'modal-xl'
        });
    }

    onSubmit() {
         
        this.msg = "";
        let master = this.accountLedgerFrm;
        this.formSubmitAttempt = true;
        if (master.valid) {
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
        // ;
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
}
