import { Component } from "@angular/core"
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: "reservationdashboardnav-app",
    templateUrl: './ReservationDashboardNav.component.html',
    styleUrls: ['./ReservationDashboardNav.component.css']
})

export class ReservationDashboardNavComponent {
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
