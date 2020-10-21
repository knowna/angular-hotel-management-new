import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { RoomStatus } from '../../../Model/reservation/room-status.model';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
 import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';

import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './Reservationstatus.component.html',
    styleUrls:[
        './Reservationstatus.component.css'
    ]
})

export class RoomStatusComponent implements OnInit{
    company: any;
    RoomStatuss: RoomStatus[];
    msg: string;
    isLoading: boolean = false;
    modalRef: BsModalRef;
    public fromDate: any;
    public toDate: any;

    /**
     * Sale Book Constructor
     */
    constructor(private _reservationService: AccountTransactionTypeService, private modalService: BsModalService, private date: DatePipe) {
        this.company = JSON.parse(localStorage.getItem('company'));
    }

    /**
     * Overrides ngOnInit 
     */
    ngOnInit(): void {
        this.LoadRoomStatus();
    }
    getDataDateFilter() {
        this.isLoading = true;
        this._reservationService.get(Global.BASE_ROOM_STATUS_ENDPOINT + '?fromDate=' + this.date.transform(this.fromDate, 'yyyy-MM-dd') + '&toDate=' + this.date.transform(this.toDate, 'yyyy-MM-dd'))
            .subscribe(SB => {
                this.RoomStatuss = SB; this.isLoading = false;
            },
                error => this.msg = <any>error);
    }
    LoadRoomStatus() {
        this.isLoading = true;
        this._reservationService.get(Global.BASE_ROOM_STATUS_ENDPOINT)
            .subscribe(SB => {
                this.RoomStatuss = SB; this.isLoading = false;
            },
                error => this.msg = <any>error);
    }

    exportTableToExcel(tableID, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var clonedtable = $('#' + tableID);
        var clonedHtml = clonedtable.clone();
        $(clonedtable).find('.export-no-display').remove();
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        $('#' + tableID).html(clonedHtml.html());

        // Specify file name
        filename = filename ? filename + '.xls' : 'Room Status Of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }
}