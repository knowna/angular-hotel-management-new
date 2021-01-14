import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'src/app/Model/table.model';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { TicketService } from 'src/app/Service/Billing/ticket.service';
import { MergeService } from '../services/merge.service';

@Component({
  selector: 'app-table-move',
  templateUrl: './table-move.component.html',
  styleUrls: ['./table-move.component.css']
})
export class TableMoveComponent implements OnInit {

  tables: Table[] = [];

  baseTable: any = {};

  destinationTable: any = {};

  selectedTicket = '';

  constructor(
    private billingService: BillingService,
    private ticketService: TicketService,
    private mergeService: MergeService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.billingService.loadTables()
      .subscribe(
        data => {
          this.tables = data;
          // console.log('the tables are', this.tables)
        }
    );
  }

  showBaseTable(value) {
    this.baseTable = value;
    if(this.baseTable) {
      this.ticketService.loadTableTickets(this.baseTable.TableId)
      .subscribe(
        data => {
          this.baseTable.ticketList = data;
        }
      );
    }

    console.log('the base table is', this.baseTable);
  }


  showDestinationTable(value) {
    this.destinationTable = value;
  }

  move() {
    let request = {
      'baseTable' : this.baseTable.TableId+'',
      'baseTicketNumber': this.selectedTicket+'',
      'distinationTable': this.destinationTable.TableId+''
    }

    console.log('the request is', request);

    this.mergeService.tableMove(request)
      .subscribe(
        data => {
          if(data == 1) {
            this.toastrService.success('Table moved successfully!');
            window.location.reload();
          }else{
            this.toastrService.error('Error while moving table!');
          }
        }
      )
  }

  config = {
    search:true,
    displayKey:"Name",
    searchOnKey: 'Name',
    height: '300px'
  }

}
