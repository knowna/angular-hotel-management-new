import { Component } from "@angular/core"
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: "reservationdashboard-app",
    templateUrl: './ReservationDashboard.component.html',
    styleUrls: ['./ReservationDashboard.component.css']
})

export class ReservationDashboardComponent {
    user: any;
    constructor(private activatedRoute: ActivatedRoute,
        private router: Router) {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}
