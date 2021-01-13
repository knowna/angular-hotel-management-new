import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Ticket, PaymentHistory } from '../../../../Model/ticket.model';
import { Order, OrderItem } from '../../../../Model/order.model';
import { Product } from '../../../../Model/product.model';
import { Global } from '../../../../Shared/global';
import { IInvoicePrint } from '../../../../Model/InvoicePrint'; 

// Selectors
import * as ProductSelector from '../../../../selectors/product.selector';
import * as TicketSelector from '../../../../selectors/ticket.selector';
import * as OrderSelector from '../../../../selectors/order.selector';

// Services
import { OrderStoreService } from '../../../../Service/store/order.store.service';
import { TicketStoreService } from '../../../../Service/store/ticket.store.service';

//for JSPDF Print
import * as $ from 'jquery';
declare var jsPDF: any;
import 'jspdf-autotable';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/Service/Billing/order.service';
import { BillingService } from 'src/app/Service/Billing/billing.service';
import { TicketService } from 'src/app/Service/Billing/ticket.service';

@Component({
    selector: 'app-pos-InvoicePrint',
    templateUrl: './pos-invoiceprint.component.html'
})

export class PosInvoicePrintComponent implements OnInit {
    ticket: Ticket;
    ticket$: Observable<Ticket>;
    orders$: Observable<Order[]>;
    parsedOrders: Order[] = [];
    products$: Observable<Product[]>;
    invoiceprint: IInvoicePrint;
    selectedTicket:number;
    productList:Product[]=[];


    public company: any = {};

    OrderItems:any[] = [];

    mergedItemList: any[] = [];

    // Constructor
    constructor(
        private store: Store<any>,
        private _location: Location,
        private _purchaseService:AccountTransactionTypeService,
        private activatedRoute: ActivatedRoute,
        private orderApi: OrderService,
        private billService: BillingService,
        private ticketService: TicketService
    ) {
        this.company = JSON.parse(localStorage.getItem('company'));
    }
    ngOnInit() {
        this.activatedRoute.queryParamMap
            .subscribe(params => {
                this.selectedTicket =  +params.get('ticketId')||0;
                if(this.selectedTicket){
                    this.orderApi.loadOrdersNew(this.selectedTicket.toString())
                        .subscribe(
                            data => {
                                // this.parsedOrders = data;
                                // this.parsedOrders = this.mergeDuplicateItems(data);
                
                                data.forEach(order => {
                                    order.OrderItems.forEach(item => {
                                        this.OrderItems.push(item);
                                    });
                                    
                                });

                                if(this.OrderItems.length) {
                                    this.mergedItemList = this.mergeDuplicateItems(this.OrderItems);
                                }

                                console.log('the mergedItemList',this.mergedItemList)
                            }
                        )
                    

                    this.ticketService.getTicketById(this.selectedTicket)
                    .subscribe(
                        data => {
                            this.ticket = data;
                            console.log('the ticket is', this.ticket);
                        }
                    );
                }
        });

        this.billService.loadProducts()
            .subscribe(data => { 
                this.productList = data;
        });

        this.ticket$ = this.store.select(TicketSelector.getCurrentTicket);
        this.orders$ = this.store.select(OrderSelector.getAllOrders);
        this.products$ = this.store.select(ProductSelector.getAllProducts);

        // Subscriptions
        this.ticket$.subscribe((ticket: Ticket) => {
            if (ticket) {
                this.ticket = ticket;
            }
        });

        this.orders$.subscribe((orders: Order[]) => {
            if (orders.length) {
                this.parsedOrders = this.mergeDuplicateItems(orders);
            }
        });
    }
    /**
     * Item Price
     * @param UnitPrice 
     */
    CurrentUnitPrice(UnitPrice: number) {
        // let currentprice = UnitPrice / 1.13;
        // Return product
        return UnitPrice.toFixed(2);
    }
    /**
     * Item Price
     * @param UnitPrice 
     * @param Qty 
     */
    ProductPrice(UnitPrice: number, Qty: number) {
        // let currentprice = UnitPrice / 1.13 * Qty;
        let currentprice = UnitPrice * Qty;
        // Return product
        return currentprice.toFixed(2);
    }

    /**
     * Filter product by product ID
     * @param products 
     * @param productId 
     */
    getProductById(products: Product[], productId: number) {
        var products: Product[] = products.filter((product: Product) => product.Id === productId);
        // Return product
        return products.length ? products[0] : {};
    }


    /**
     * Merge Duplicate Items
     */
    // mergeDuplicateItems(orders: Order[]) {
    //     var orders: Order[] = JSON.parse(JSON.stringify(orders));
    //     orders.forEach((order: Order) => {
    //         var counts = [];
    //         order.OrderItems.forEach((a, i) => {
    //             if (counts[a.ItemId] === undefined) {
    //                 counts[a.ItemId] = a;
    //             } else {
    //                 counts[a.ItemId].Qty += a.Qty;
    //             }
    //         });
    //         order.OrderItems = counts;
    //         order.OrderItems = order.OrderItems.filter((n) => n != undefined);
    //     });

    //     return orders;
    // }

    // Calculate sum of the items in a order list
    // -> Avoids void and gift items from calculation of total
    
    mergeDuplicateItems(itemList: any[]) {
        var counts = [];
        itemList.forEach((a, i) => {
            if(counts[a.ItemId] === undefined) {
                counts[a.ItemId] = a;
            } else {
                counts[a.ItemId].Qty += a.Qty;
            }
        });

        itemList = counts;
        itemList = itemList.filter((n) => n != undefined); 

        return itemList;
    }

    calculateSum(): number {
        let totalAmount = 0;

        this.mergedItemList.forEach(item => {
            totalAmount += item.Qty * item.UnitPrice;
        });

        // if (this.parsedOrders.length) {
        //     this.parsedOrders.forEach((order) => {
        //         order.OrderItems.forEach(item => {
        //             totalAmount += item.Qty * item.UnitPrice;
        //         });
        //         // totalAmount = totalAmount +
        //         //     (order.OrderItems.length) ? order.OrderItems.reduce((total: number, order: OrderItem) => {
        //         //         return total + order.Qty * eval((order.UnitPrice / 1.13).toFixed(2));
        //         //     }, 0) : 0;
        //     });
        // }

        return eval(totalAmount.toFixed(2));
    }

    // Calculates Discount
    calculateDiscount():any {
        let discount = this.ticket?.Discount;

        this.mergedItemList.forEach(item => {
            if(item.Tags === 'Void'){
                discount += item.TotalAmount;
            }
        });

        // this.parsedOrders.forEach(order => {
        //     order.OrderItems.forEach(item => {
        //         // console.log('the item in discount is', item)
        //         if(item.Tags === 'Void'){
        //             discount += item.TotalAmount;
        //         }
        //     });
        // });

        return discount?.toFixed(2) || 0.0;
        // return 0.00;
        // let sum = this.calculateSum();
        // let giftSum = this.calculateVoidGiftSum();
        // let value = (giftSum / sum) * 100 || 0;

        // return (this.ticket.Discount)
        //     ? this.ticket.Discount.toFixed(2)
        //     : (sum * (value / 100)).toFixed(2);
    }

    /**
     * Calculates void and gift sum
     */
    calculateVoidGiftSum(): number {
        let totalSum = 0;
        if (this.parsedOrders.length) {
            this.parsedOrders.forEach((order) => {
                var finalTotal = (order.OrderItems.length) ? order.OrderItems.forEach((order: OrderItem) => {
                    if (order.IsVoid || (order.Tags && order.Tags.indexOf('Gift')) != -1) {
                        totalSum = totalSum + order.Qty * eval((order.UnitPrice / 1.13).toFixed(2));
                    }
                }) : 0;
            });
        }

        return eval(totalSum.toFixed(2));
    }
    // Calculates Taxable Amount
    calculateTaxableAmount(): number {
        return 0;
        // let sum = this.calculateSum();
        // let Discount = this.ticket.Discount;
        // let TaxableAmount = sum - Discount;
        // return TaxableAmount; 
    }

    // Calculates VAT Amount
    calculateVat() {
        // let taxableAmount = this.calculateSum();
        let taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount * 0.13).toFixed(2);
    }

    /**
     * Calculates the grand total of the ticket
     */
    getGrandTotal() {
        // let taxableAmount = this.calculateSum();
        let taxableAmount = this.calculateSum() - eval(this.calculateDiscount()) + eval(this.calculateServiceCharge());
        return (taxableAmount + taxableAmount * 0.13).toFixed(2);
    }

    /**
     * Calculates the Total Service Charge
     */
    calculateServiceCharge() {
        //let totalSum = this.calculateSum();
        //let discountAmount = this.calculateDiscount();
        //let ticketTotalAfterDiscount = totalSum - eval(discountAmount);

        //return (ticketTotalAfterDiscount * 0.1).toFixed(2);
        let servicecharge = 0;
        return servicecharge.toFixed(2);
    }

    // Go back to last page
    close() {
        this._location.back();
    }
    /**
     * Calculates the final balace of the ticket 
     */
    getFinalBalance(): number {
        let finalBalance = 0;
        const balanceCalc = eval(this.getGrandTotal()) - this.getTotalCharged(this.ticket);

        if (balanceCalc < 0) {
            finalBalance = balanceCalc * (-1);
        } else {
            finalBalance = balanceCalc;
        }

        return finalBalance;
    } 
    /**
     * Calculates total charged amount
     * @param ticket 
     */
    getTotalCharged(ticket: Ticket) {
        return ticket.PaymentHistory.reduce((total: number, pay: PaymentHistory) => {
            total = total + pay.AmountPaid;
            return total;
        }, 0);
    }

    //Print Bill
    // printBill() {
    //     (window as any).print();


        // if (this.getFinalBalance() > 0) {
        //     alert("Before bill print! Please settle amount");
        // }
        // else
        // {
        //     //let Printbill =
        //     let BillNo = this.ticket.TicketId;
        //     let BillAmount = this.getGrandTotal();
        //     this.getPrintInvoice(BillNo, Number(BillAmount))
        //         .subscribe((invoicePrint: IInvoicePrint) => { this.invoiceprint = invoicePrint });
        //     if (this.invoiceprint != null) {
        //         let TDate = this.invoiceprint.TDate;
        //         let IDate = this.invoiceprint.IDate;
        //         var doc = new jsPDF('p', 'pt', 'a4');
        //         var elem = document.getElementById('InvoiceTableData');
        //         var CompanyName = JSON.parse(localStorage.getItem('company'));
        //         var header = function (data) {
        //             doc.setFontSize(18);
        //             doc.setTextColor(40);
        //             doc.setFontStyle('normal');
        //             doc.text(CompanyName.NameEnglish, data.settings.margin.left + 270, 20, 'center');
        //             doc.text(CompanyName.Address + " " + CompanyName.Street + " " + CompanyName.City + " " + CompanyName.District, data.settings.margin.left + 270, 40, 'center');
        //             doc.setFontSize(14);
        //             doc.text("VAT/PAN # " + CompanyName.Pan_Vat, data.settings.margin.left + 255, 60, 'center');
        //             doc.text("Tax Invoice ", data.settings.margin.left + 270, 80, 'center');
        //             doc.setFontSize(12);
        //             doc.text("Bill # " + BillNo, data.settings.margin.left + 10, 100, 'left');
        //             doc.text("Transaction Date : " + TDate, data.settings.margin.left + 10, 120, 'left');
        //             doc.text("Invoice Date : " + IDate, data.settings.margin.left + 10, 140, 'left');
        //             doc.text("Payment Mode : ", data.settings.margin.left + 10, 160, 'left');
        //         };

        //         var options = {
        //             beforePageContent: header,
        //             margin: {
        //                 top: 80
        //             },
        //             columnStyles: {
        //                 0: { columnWidth: 40, halign: 'left' },
        //                 1: { columnWidth: 220, halign: 'left' },
        //                 2: { columnWidth: 60, halign: 'center' },
        //                 3: { columnWidth: 80, halign: 'right' },
        //                 4: { columnWidth: 80, halign: 'right' }
        //             },
        //             startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 10 : 180
        //             // startY: doc.autoTableEndPosY() + 20
        //         };

        //         var data = doc.autoTableHtmlToJson(elem);
        //         var head = [{ "header": "S.N." }, { "header": "Details" }, { "header": "Quantity" }, { "header": "Per Unit (Rs.)" }, { "header": "Total(Rs.)" }];
        //         doc.autoTable(head, data.rows, options, {
        //             tableLineColor: [189, 195, 199],
        //             tableLineWidth: 0.75,
        //             styles: {
        //                 font: 'Meta',
        //                 lineColor: [44, 62, 80],
        //                 lineWidth: 0.55
        //             },
        //             headerStyles: {
        //                 fillColor: [0, 0, 0],
        //                 fontSize: 11
        //             },
        //             bodyStyles: {
        //                 fillColor: [216, 216, 216],
        //                 textColor: 50
        //             },
        //             alternateRowStyles: {
        //                 fillColor: [250, 250, 250]
        //             },
        //             startY: 50,
        //             drawHeaderRow: function (row, data) {
        //                 row.height = 46; // Height for both headers
        //             },
        //             drawHeaderCell: function (cell, data) {
        //                 doc.rect(cell.x, cell.y, cell.width, cell.height, cell.styles.fillStyle);
        //                 doc.setFillColor(230);
        //                 doc.rect(cell.x, cell.y + (cell.height / 2), cell.width, cell.height / 2, cell.styles.fillStyle);
        //                 doc.autoTableText(cell.text, cell.textPos.x, cell.textPos.y, {
        //                     halign: cell.styles.halign,
        //                     valign: cell.styles.valign
        //                 });
        //                 doc.setTextColor(100);
        //                 var text = data.table.rows[0].cells[data.column.dataKey].text;
        //                 doc.autoTableText(text, cell.textPos.x, cell.textPos.y + (cell.height / 2), {
        //                     halign: cell.styles.halign,
        //                     valign: cell.styles.valign
        //                 });
        //                 return false;
        //             },
        //             drawRow: function (row, data) {
        //                 // Colspan
        //                 doc.setFontStyle('bold');
        //                 doc.setFontSize(10);
        //                 //if ($(row.raw[0]).hasClass("innerHeader")) {
        //                 //    doc.setTextColor(200, 0, 0);
        //                 //    doc.setFillColor(110, 214, 84);
        //                 //    doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'F');
        //                 //    doc.autoTableText("", data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
        //                 //        halign: 'center',
        //                 //        valign: 'middle'
        //                 //    });
        //                 //    /*  data.cursor.y += 20; */
        //                 //};

        //                 doc.setTextColor(200, 0, 0);
        //                 doc.setFillColor(110, 214, 84);
        //                 doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'F');
        //                 doc.autoTableText("", data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
        //                     halign: 'center',
        //                     valign: 'middle'
        //                 });


        //                 if (row.index % 5 === 0) {
        //                     var posY = row.y + row.height * 6 + data.settings.margin.bottom;
        //                     if (posY > doc.internal.pageSize.height) {
        //                         data.addPage();
        //                     }
        //                 }
        //             },
        //             drawCell: function (cell, data) {
        //                 // Rowspan
        //                 console.log(cell);
        //                 //if ($(cell.raw).hasClass("innerHeader")) {
        //                 //    doc.setTextColor(200, 0, 0);
        //                 //    doc.autoTableText(cell.text + '', data.settings.margin.left + data.table.width / 2, data.row.y + data.row.height / 2, {
        //                 //        halign: 'center',
        //                 //        valign: 'middle'
        //                 //    });

        //                 //    return false;
        //                 //}
        //                 doc.setTextColor(200, 0, 0);
        //                 doc.autoTableText(cell.text + '', data.settings.margin.left + data.table.width / 2, data.row.y + data.row.height / 2, {
        //                     halign: 'center',
        //                     valign: 'middle'
        //                 });

        //                 return false;
        //             }
        //         });
        //         doc.setFontSize(12);
        //         doc.setTextColor(40);
        //         doc.setFontStyle('bold');
        //         doc.text("(In Words :" + this.invoiceprint.AmountWord + ")", 40, doc.autoTableEndPosY() + 20, 'left');
        //         doc.text(".................................", 550, doc.autoTableEndPosY() + 35, 'right');
        //         doc.text("Authorized Signature", 550, doc.autoTableEndPosY() + 50, 'right');

        //        // doc.save("Invoice.pdf");

        //         //For Auto Print of the bill using iframe
        //         doc.autoPrint();
        //         let docUrl = doc.output('bloburl');

        //         // Update the pdf inside the iframe
        //         const element: HTMLIFrameElement = document.getElementById('iframePrint') as HTMLIFrameElement;
        //         const printIframe = element.contentWindow;
        //         printIframe.document.body.innerHTML = '';
        //         let newObjectTag = document.createElement('object');
        //         newObjectTag.setAttribute('data', docUrl);
        //         newObjectTag.setAttribute('type', 'application/pdf');
        //         let newEmbedTag = document.createElement('embed');
        //         newEmbedTag.setAttribute('url', docUrl);
        //         newEmbedTag.setAttribute('type', 'application/pdf');
        //         newObjectTag.appendChild(newEmbedTag);
        //         printIframe.document.body.appendChild(newObjectTag);
        //     }
        // }
    // }


    printBill() {
       
        let ticketId = this.selectedTicket;
        if (this.getFinalBalance() > 0) {
            // alert("Before bill print! Please settle amount");
            (window as any).print();
        }
        else{
            this.orderApi.ticketPrintApi(ticketId)
            .subscribe(
                (data:IInvoicePrint)=>{
                    this.invoiceprint=data;
                    if (this.invoiceprint != null) {
                        (window as any).print();
                    }
                
                }
            )
        }

    }
    /**
 * Gets individual journal voucher
 * @param Id 
 */
    getPrintInvoice(Id) {
         this.orderApi.ticketPrintApi(Id)
        .subscribe(
            data=>{
                console.log('printBill section',data);
                
            }
        )
    }
}
