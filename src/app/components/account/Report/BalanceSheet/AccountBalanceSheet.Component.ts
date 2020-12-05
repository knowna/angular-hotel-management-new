﻿import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { JournalVoucherService } from '../../../Service/journalVoucher.service';

import { BalanceSheet } from '../../../Model/BalanceSheet';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';

@Component({
    templateUrl: './AccountBalanceSheet.Component.html'
})

export class AccountBalanceSheetComponent implements OnInit {
    BalanceSheets: BalanceSheet[];
    msg: string;
    inLoading: boolean = false;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;
    private formSubmitAttempt: boolean;

    constructor(private _BalanceSheetService: JournalVoucherService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.LoadBalanceSheet();
    }

    LoadBalanceSheet(): void {
        debugger
        //this._BalanceSheetService.get(Global.BASE_ACCOUNTBALANCESHEET_ENDPOINT)
          //  .subscribe(balancesheets => { this.BalanceSheets = balancesheets; this.inLoading = false; },
            //    error => this.msg = <any>error);
    }
}