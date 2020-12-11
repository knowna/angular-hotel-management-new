import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { AccountType } from '../../Model/AccountType/accountType';
import { Observable } from 'rxjs/Rx';
import { EntityMock } from 'src/app/Model/Account/account';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
@Component({
    selector: 'my-journaldetail-list',
    templateUrl: './journalvoucher-details.component.html'
})
export class JournalVoucherDetailComponent {
    @Input('group')
    public journalDetailsFrm: FormGroup;
   // public acctype: Observable<AccountType>;
    public entityLists: EntityMock[];


    constructor(private journalService: JournalVoucherService) {
       // this.journalService.getAccountTypes().subscribe(data => { this.acctype = data });
        this.entityLists = [
            { id: 0, name: 'Dr' },
            { id: 1, name: 'Cr' }
        ];
    }


    // calculate amount
    //calulate the sum of debit columns//
    sumDebit(journalDetailsFrm:any) {

        let controls = this.journalDetailsFrm.controls.AccountValues.value;

        return controls.reduce(function (total: any, accounts: any) {

            return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
        }, 0);
    }

    //calculate the sum of credit columns//
    sumCredit(journalDetailsFrm:any) {

        let controls = this.journalDetailsFrm.controls.AccountValues.value;

        return controls.reduce(function (total: any, accounts: any) {
            return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
        }, 0);
    }


    enableDisable(data: any) {
        debugger;
        if (data.entityLists.value == 'Dr') {
            data.Debit.enable();
            data.Credit.disable();
            data.Credit.reset();

        }
        else if
        (data.entityLists.value == 'Cr') {
            data.Credit.enable();
            data.Debit.disable();
            data.Debit.reset();
        }
        else {
            data.Debit.enable();
            data.Credit.enable();

        }
    }




}