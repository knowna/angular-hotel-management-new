﻿import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
    selector: "InventoryDashboard-app",
    templateUrl: 'InventoryDashboard.Component.html',
    styleUrls: ['InventoryDashboard.Component.css']
})

export class InventoryDashboardComponent {
    title = 'D. Cube Hotel Management System';
    user: any;
    hideElement = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                if (event.url === '/InventoryDashboard') {
                    this.hideElement = true;
                } else {
                    this.hideElement = false;
                }
            }
        });
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }
}