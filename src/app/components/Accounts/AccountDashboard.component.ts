import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';

import { ProfitAndLoss } from '../../Model/ProfitAndLoss';
import { Global } from '../../Shared/global';

@Component({
    selector: "accountdashboard-app",
    templateUrl: './AccountDashboard.component.html',
    styleUrls: ['./AccountDashboard.component.css']
})

export class AccountDashboardComponent implements OnInit{
    currentYear: any;
    msg: string;
    user: any;
    hideElement = false;
    profitandloss: ProfitAndLoss[];
    inLoading: boolean = false;
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router, private _journalvoucherService: AccountTransactionTypeService

    )
    {
        this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/accountdashboard') {
                    this.hideElement = true;
                } else {
                    this.hideElement = false;
                }
            }
        });

    }
    ngOnInit(): void {
        this.LoadProfitAndLoss();
    }

    LoadProfitAndLoss(): void {
        
        this._journalvoucherService.get(Global.BASE_ACCOUNTPROFITANDLOSS_ENDPOINT + "?FinancialYear=" + (this.currentYear['Name'] + "&ReportType=" + "Dashboard"))
            .subscribe(ProfitAndLosss => {  this.profitandloss = ProfitAndLosss; this.inLoading = false; },
                error => this.msg = <any>error);
    }
    /**
     * Logout user
     */
    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
