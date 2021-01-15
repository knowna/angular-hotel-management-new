import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AuthenticationService } from './Service/authentication.service';
import { DepartmentService } from './Service/Department.service';
import { LoginService } from './Service/login.service';
import { UsersService } from './Service/user.service';


import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TestComponent } from './components/test/test.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { navcomponents } from "./Shared/navcomponents";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CheckInComponent } from './components/checkin/checkin.component';
import { CustomerTypeService } from "./Service/reservation/customer-type.services";
import { FacilityService } from "./Service/reservation/facility.services";
import { RoomOccupiedService } from "./Service/reservation/room-occupied.services";
import { RoomTypeService } from "./Service/reservation/room-type.services";
import { PaymentTypeService } from "./Service/reservation/payment-type.services";
import { ReservationTypeService } from "./Service/reservation/reservation-type.services";
import { ModalModule } from 'node_modules/ngx-bootstrap/modal';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileService } from "./Service/file.service";
import { BsModalModule } from "ng2-bs3-modal";
import { DatePipe, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { AngularDateTimePickerModule } from "angular2-datetimepicker";
import { BsDatepickerModule } from "node_modules/ngx-bootstrap/datepicker";

// import { RoomStatusComponent } from "./components/Reservation/reservation-status/Reservationstatus.component"
// import { ReservationComponent } from './components/Reservation/reservation.component';
// import { CheckOutComponent } from './components/Reservation/checkout/checkout.component';
// import { ReservationInquiryComponent } from './components/Reservation/ReservationInquiry/ReservationInquiry.component';
// import { ReservationCustomerComponent } from './components/Reservation/customer/customer.component';
// import { PaymentTypeComponent } from './components/Reservation/payment-type/payment-type.component';
// import { FacilityComponent } from './components/Reservation/facility/facility.component';
// import { ReservationTypeComponent } from './components/Reservation/reservation-type/reservation-type.component';
// import { RoomTypeComponent } from './components/Reservation/room-type/room-type.component';
// import { CustomerTypeComponent } from './components/Reservation/customer-type/customer-type.component';

import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { TableComponent } from './components/POS-System/Table/table.component';
import { BillingService } from './Service/Billing/billing.service';
import { TableStoreService } from './Service/Billing/table.store.service';
// import { UserService } from './Service/Billing/user.service';
// import { OrderService } from './Service/Billing/Order.service';
import { OrderStoreService } from './Service/Billing/order.store.service';
import { CustomerStoreService } from './Service/Billing/customer.store.service';

import { UserComponent } from './components/ManageDashboard/user/user.component';
import { DepartmentComponent } from './components/ManageDashboard/Department/Department.component';
import { FinancialYearComponent } from './components/ManageDashboard/FinancialYear/FinancialYear.component';
import { RoleComponent } from './components/ManageDashboard/role/role.component';
import { RoleAssignmentComponent } from './components/ManageDashboard/role-assign/role-assign.component';
import { RoleModuleComponent } from './components/ManageDashboard/rolemodule/rolemodule.component';
import { UserPermission } from './Model/User/userpermission';
import { UserPermissionComponent } from './components/ManageDashboard/user-permission/user-permission.component';
import { CompanyComponent } from './components/ManageDashboard/company/company.component';
import { UserRoleService } from './Service/userRole.service';
import { RoleService } from './Service/role.service';
import { RoleNameComponent } from './components/ManageDashboard/role-assign/role-name/role-name.component';
// import { RoomComponent } from './components/Reservation/room/room.component';
import { AccountTransactionTypeService } from './Service/Inventory/account-trans-type.service';

// import { CategoryComponent } from './components/InventoryDashboard/category/category.component';
// import { InventoryDashboardComponent } from './components/InventoryDashboard/InventoryDashboard.Component';
// import { StockInHandComponent } from './components/InventoryDashboard/inventory report/stock-in-hand.component';
// import { InventoryReceiptDetailsComponent } from './components/InventoryDashboard/inventory-receipt/inventory-receiptdetails/inventory-receiptdetails.component';
// import { UnitTypeComponent } from './components/InventoryDashboard/UnitType/UnitType.Component';
// import { WareHouseComponent } from './components/InventoryDashboard/WareHouse/warehouse.component';
// import { InventoryReceiptComponent } from './components/InventoryDashboard/inventory-receipt/inventory-receipt.component';
// import { PeriodicConsumptionComponent } from './components/InventoryDashboard/periodic-consumption/periodic-consumption.component';
// import { StockDamageComponent } from './components/InventoryDashboard/stock-damage/stock-damage.component';
// import { StockDamageDetailsComponent } from './components/InventoryDashboard/stock-damage/stock-damage-details/stock-damage-details.component';
// import { WareHouseTypeComponent } from './components/InventoryDashboard/WareHouse/warehousetype.component';
// import { WareHousesComponent } from './components/InventoryDashboard/WareHouse/WareHouse';
import { TokenInterceptorService } from './interceptor/token-interceptor.service';
// import { PeriodicConsumptionItemComponent } from './components/InventoryDashboard/periodic-consumption/periodic-consumption-items/periodic-consumption-item.component';
// import { ContraComponent } from './components/Accounts/contra/contra.component';
import { SelectDropDownModule } from "ngx-select-dropdown";
// import { SalesComponent } from './components/Accounts/sales/sales.component';
// import { SalesDetailComponent } from './components/Accounts/sales/sales-detail/salesDetail.component';
// import { ReceiptComponent } from './components/Accounts/receipt/receipt.component';
// import { JournalVouchercomponent } from './components/Accounts/journal/journaVoucher.component';
// import { PurchaseComponent } from './components/Accounts/purchase/purchase.component';
// import { PaymentComponent } from './components/Accounts/payment/payment.component';
// import { DebitNoteComponent } from './components/Accounts/debit-note/debit-note.component';
// import { AccountDashboardComponent } from './components/Accounts/AccountDashboard.component';
// import { PurchaseDetailsComponent } from './components/Accounts/purchase/purchaseDetail/purchaseDetail.component';
// import { SalesBillingDetailComponent } from './components/Accounts/sales-billing/sales-billing-detail/sales-billing-details.component';
// import { JournalVoucherDetailComponent } from './components/Accounts/journal/journalvoucher-details/journalvoucher-details.component';
// import { AccountTransactionTypeComponent } from './components/Accounts/account-transaction-type/account-transaction-type.component';
// import { AccountComponent } from './components/Accounts/account/account.component';
// import { BalanceSheetComponent } from './components/Report/balance-sheet/balance-sheet.component';
// import { AccountBalanceSheetComponent } from './components/Report/BalanceSheet/AccountBalanceSheet.Component';
// import { BillReturnViewComponent } from './components/Report/BillReturnView/BillReturnView.component';
// import { MaterializedViewComponent } from './components/Report/materialized view/materializedview.component';
// import { AccountProfitAndLossComponent } from './components/Report/ProfitAndLoss/AccountProfitAndLoss.Component';
// import { AccountSaleBookDaywise } from './components/Report/SaleBookDate/AccountSaleBookDatewise.Component';
// import { AccountLedgerViewComponent } from './components/Report/LedgerView/AccountLedgerView.Component';
// import { AccountSaleBookComponent } from './components/Report/SaleBook/AccountSaleBook.Component';
// import { AccountSaleBookCustomer } from './components/Report/SaleBookCustomer/AccountSaleBookCustomer.Component';
// import { AccountSaleBookItem } from './components/Report/SaleBookItem/AccountSaleBookItem.Component';
// import { TrialBalanceComponent } from './components/Report/TrialBalance/TrialBalance.component';
// import { MasterLedgerComponent } from './components/Accounts/master-ledger/master-ledger.component';
// import { SalesBillingComponent } from './components/Accounts/sales-billing/sales-billing.component';
import { TicketStoreService } from './Service/Billing/ticket.store.service';
import { ProductEffects } from './effects/product.effects';
import { CategoryEffects } from './effects/category.effects';
//reducers
import { OrdersReducer } from "./reducers/orders.reducer";
import { TablesReducer } from "./reducers/tables.reducer";
import { UsersReducer } from "./reducers/users.reducer";
import { TicketsReducer } from "./reducers/tickets.reducer";
import { CustomersReducer } from "./reducers/customers.reducer";
import { ProductsReducer } from "./reducers/products.reducer";
import { CategoriesReducer } from './reducers/categories.reducer';
import { POSDashboardComponent } from './components/POS-System/pos-dashboard/pos-dashboard.component';
import { TableOrderEffects } from './effects/order.effects';
import { TableEffects } from './effects/table.effects';
import { CustomerEffects } from './effects/customer.effects';
import { UserEffects } from './effects/user.effects';
import { TicketEffects } from './effects/ticket.effects';
import { MenuItemComponent } from './components/POS-System/Menu/MenuItem/MenuItem.component';
import { MenuConsumptionComponent } from './components/POS-System/Menu/MenuConsumption/menu-consumption.component';
import { PosTableComponent } from './components/POS-System/pos-table/pos-table.component';
import { MenuComponent } from './components/POS-System/Menu/menu.component';
import { MenuCategoryComponent } from './components/POS-System/Menu/MenuCategory/MenuCategory.component';
import { InventoryIssueDetailsComponent } from './components/POS-System/Menu/MenuItem/MenuItemPortion/MenuItemPortion.component';
import { ScreenMenuItemComponent } from './components/POS-System/Menu/MenuItem/ScreenMenuItem.component';
import { MenuListComponent } from './components/POS-System/menu-list/menu-list.component';
import { POSSaleBillingComponent } from './components/POS-System/pos-sale-billing/pos-sale-billing.component';
import { FilterMenuItemName } from './filters/FilterMenuItemName.filter';
import { FilterPipe } from './components/POS-System/pos-table/FilterPipe';
import { PosOptionsComponent } from './components/POS-System/pos-table/pos-options/pos-options.component';
import { PosCalculatorComponent } from './components/POS-System/pos-table/pos-calculator/pos-calculator.component';
import { PosSettleComponent } from './components/POS-System/pos-table/pos-settle/pos-settle.component';
import { PosOrdersComponent } from './components/POS-System/pos-table/pos-orders/pos-orders.component';
import { PosTicketsComponent } from './components/POS-System/pos-table/pos-tickets/pos-tickets.component';
import { TicketService } from './Service/Billing/ticket.service';
import { PosInvoicePrintComponent } from './components/POS-System/pos-table/pos-invoiceprint/pos-invoiceprint.component';
import { authReducer } from './reducers/auth.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { OrderService } from './Service/Billing/order.service';
// import { InventoryDashboardComponent } from './components/InventoryDashboard/InventoryDashboard.Component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { LinksFilterPipe } from './components/header/pipes/links-filter.pipe';
// import { MasterLedgerComponent } from './components/Accounts/master-ledger/master-ledger.component';
// import { MaterializedViewComponent } from './components/Report/materialized view/materializedview.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserStoreService } from './Service/store/user.store.service';
import { FilterMenuConsumption } from './filters/FilterMenuConsumption.filter';
import { CategoryComponent } from './components/InventoryDashboard/category/category.component';
import { PurchaseService } from './Service/Billing/purchase.service';
import { PosCustomerComponent } from './components/POS-System/pos-table/pos-customer/pos-customer.component';
import { FilterByCategory } from './filters/filterByCategory.filter';
import { MenuCategoryComponent1 } from './components/POS-System/Menu/ScreenMenuCategory/menu-category.component';
import { TableFilter } from './filters/table.filter';
import { MenuFilter } from './filters/menu.filter';
  import { from } from 'rxjs';
import { CustomerByName } from './filters/customerByName.filter';
import { FullMergeComponent } from './components/POS-System/Order/FullMerge/full-merge.component';
import { MergeService } from './components/POS-System/Order/services/merge.service';
import { PartialMergeComponent } from './components/POS-System/Order/partial-merge/partial-merge.component';
import { SplitMergeComponent } from './components/POS-System/Order/split-merge/split-merge.component';
import { ScreenMenuCategoryFilter } from './filters/screen-menu-category.filter';
import { ScreenMenuCategoryItemFilter } from './filters/screen-menu-category-item.filter';
// import { TicketService } from './Service/Billing/ticket.service';\

import { NpDatepickerModule } from 'angular-nepali-datepicker';
import { AccountTypeComponent } from './components/account/master/account-type/account-type.component';
import { InventoryItemComponent } from './components/InventoryDashboard/inventory-item/inventory-item.component';
import { InventoryItemService } from './Service/Inventory/InventoryItem.service';
import { UnitTypeComponent } from './components/InventoryDashboard/UnitType/UnitType.Component';
import { WareHouseComponent } from './components/InventoryDashboard/warehouse/warehouse.component';
import { WareHouseTypeComponent } from './components/InventoryDashboard/warehouse-type/warehousetype.component';
import { RoomService } from './Service/Inventory/room.service';
import { RoomTypeComponent } from './components/ManageDashboard/roomType/RoomType.component';
import { MasterLedgerComponent } from './components/account/master/master-ledger/master-ledger.component';
import { AccountTransactionTypeComponent } from './components/account/master/account-transaction-type/account-transaction-type.component';
import { MasterLedgerService } from './components/account/master/master-ledger/services/MasterLedger.service';
import { AccountTypeService } from './components/account/master/master-ledger/services/account-type.service';
import { AccountTransValuesService } from './Service/accountTransValues.service';
import { JournalVoucherService } from './Service/journalVoucher.service';
import { JournalVouchercomponent } from './components/account/Transaction/journal/journaVoucher.component';
import { AccountLedgerViewComponent } from './components/account/Report/LedgerView/AccountLedgerView.Component';
import { TrialBalanceComponent } from './components/account/Report/TrialBalance/TrialBalance.component';
import { AccountService } from './components/account/services/account.service';
import { AccountSaleBookComponent } from './components/account/Report/SaleBook/AccountSaleBook.Component';
import { AccountProfitAndLossComponent } from './components/account/Report/ProfitAndLoss/AccountProfitAndLoss.Component';
import { BalanceSheetComponent } from './components/account/Report/balance-sheet/balance-sheet.component';
import { CategorysService } from './components/account/services/Category.services';
import { AccountSaleBookItem } from './components/account/Report/SaleBookItem/AccountSaleBookItem.Component';
import { AccountSaleBookDaywise } from './components/account/Report/SaleBookDate/AccountSaleBookDatewise.Component';
import { AccountSaleBookCustomer } from './components/account/Report/SaleBookCustomer/AccountSaleBookCustomer.Component';
import { MaterializedViewComponent } from './components/account/Report/materialized view/materializedview.component';
import { BillReturnViewComponent } from './components/account/Report/BillReturnView/BillReturnView.component';
import { PurchaseDetailsService } from './Service/Billing/PurchaseDetails.service';
import { PurchaseComponent } from './components/account/Transaction/purchase/purchase.component';
import { PurchaseDetailsComponent } from './components/account/Transaction/purchase/purchaseDetail/purchaseDetail.component';
import { SalesBillingComponent } from './components/account/Transaction/sales-billing/sales-billing.component';
import { SalesBillingDetailComponent } from './components/account/Transaction/sales-billing/sales-billing-detail/sales-billing-details.component';
import { ReceiptComponent } from './components/account/Transaction/receipt/receipt.component';
import { PaymentComponent } from './components/account/Transaction/payment/payment.component';
import { ContraComponent } from './components/account/Transaction/contra/contra.component';
import { CreditNoteComponent } from './components/account/Transaction/credit-note/cerdit-note.component';
import { DebitNoteComponent } from './components/account/Transaction/debit-note/debit-note.component';
import { SalesComponent } from './components/account/Transaction/sales/sales.component';
import { SalesDetailComponent } from './components/account/Transaction/sales/sales-detail/salesDetail.component';
import { StockInHandComponent } from './components/InventoryDashboard/inventory report/stock-in-hand.component';
import { ReservationCustomerComponent } from './components/Reservation/customer/customer.component';
import { CheckInComponent } from './components/Reservation/checkin/checkin.component';
import { PaymentTypeComponent } from './components/Reservation/payment-type/payment-type.component';
import { CheckOutComponent } from './components/Reservation/checkout/checkout.component';
import { ReservationInquiryComponent } from './components/Reservation/ReservationInquiry/ReservationInquiry.component';
import { RoomStatusComponent } from './components/Reservation/reservation-status/Reservationstatus.component';
import { ReservationComponent } from './components/Reservation/reservation/reservation.component';
import { FacilityComponent } from './components/Reservation/facility/facility.component';
import { CustomerTypeComponent } from './components/Reservation/customer-type/customer-type.component';
import { ReservationTypeComponent } from './components/Reservation/reservation-type/reservation-type.component';
import { RoomComponent } from './components/Reservation/room/room.component';
import { JournalAddEditComponent } from './components/account/Transaction/journal/journal-add-edit/journal-add-edit.component';
import { PurchaseAddEditComponent } from './components/account/Transaction/purchase/purchase-add-edit/purchase-add-edit.component';
import { ReceiptAddEditComponent } from './components/account/Transaction/receipt/receipt-add-edit/receipt-add-edit.component';
import { PaymentAddEditComponent } from './components/account/Transaction/payment/payment-add-edit/payment-add-edit.component';
import { ContraAddEditComponent } from './components/account/Transaction/contra/contra-add-edit/contra-add-edit.component';
import { CreditNoteAddEditComponent } from './components/account/Transaction/credit-note/credit-note-add-edit/credit-note-add-edit.component';
import { DebitNoteAddEditComponent } from './components/account/Transaction/debit-note/debit-note-add-edit/debit-note-add-edit.component';
import { KitchenOrderViewComponent } from './components/POS-System/kitchen-order-view-component/kitchen-order-view.component';
import { MenuPriceComponent } from './components/POS-System/Menu/menu-price/menu-price.component';
import { InventoryReceiptComponent } from './components/InventoryDashboard/inventory-receipt/inventory-receipt.component';
import { InventoryReceiptDetailsComponent } from './components/InventoryDashboard/inventory-receipt/inventory-receiptdetails/inventory-receiptdetails.component';
import { InventoryReceiptService } from './Service/Inventory/InventoryReceipt.service';
import { InventoryReceiptDetailsService } from './Service/Inventory/InventoryReceiptDetails.service';
import { PeriodicConsumptionService } from './Service/Inventory/periodic-consumption.service';
import { PeriodicConsumptionItemService } from './Service/Inventory/peroidic-consumption-item.service';
import { MenuConsumptionService } from './Service/Inventory/MenuConsumptionService';
import { MenuConsumptionDetailsService } from './Service/Inventory/MenuConsumptionDetailsService';
import { PeriodicConsumptionComponent } from './components/InventoryDashboard/periodic-consumption/periodic-consumption.component';
import { PeriodicConsumptionItemComponent } from './components/InventoryDashboard/periodic-consumption/periodic-consumption-items/periodic-consumption-item.component';
import { StockDamageComponent } from './components/InventoryDashboard/stock-damage/stock-damage.component';
import { StockDamageDetailsComponent } from './components/InventoryDashboard/stock-damage/stock-damage-details/stock-damage-details.component';
import { ChangePasswordComponent } from './components/ManageDashboard/change-password/change-password.component';
import { OrderTicketComponent } from './components/POS-System/Order/order-ticket/order-ticket.component';
import { VoidOrderComponent } from './components/POS-System/Order/void-order/void-order.component';
import { TableMoveComponent } from './components/POS-System/Order/table-move/table-move.component';
import { PrinterSettingComponent } from './components/ManageDashboard/printer-setting/printer-setting.component';

@NgModule({
  imports: [
    SelectDropDownModule,
    FormsModule,
    NgbAccordionModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsModalModule,
    AngularDateTimePickerModule,
    StoreModule.forRoot({
      orders: OrdersReducer,
      tables: TablesReducer,
      products: ProductsReducer,
      user: UsersReducer,
      categories: CategoriesReducer,
      customers: CustomersReducer,
      tickets: TicketsReducer,
      auth: authReducer
    }),
    EffectsModule.forRoot([
      TableOrderEffects,
      ProductEffects,
      CategoryEffects,
      TableEffects,
      CustomerEffects,
      UserEffects,
      TicketEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      autoDismiss: true,
      closeButton: true,
    }),
    NpDatepickerModule,
  ],
  declarations: [

    AppComponent,
    FullMergeComponent,
    LoginComponent,
    HeaderComponent,
    NavbarComponent,
    TestComponent,

    RoomTypeComponent,
    MasterLedgerComponent,
    PagenotfoundComponent,
    CheckInComponent,
    FileUploadComponent,
    MenuCategoryComponent1,
    JournalVouchercomponent,
    ChangePasswordComponent,
    RoomStatusComponent,
    ReservationComponent,
    CheckOutComponent,
    ReservationInquiryComponent,
    ReservationCustomerComponent,
    RoomComponent,
    PaymentTypeComponent,
    FacilityComponent,
    ReservationTypeComponent,
    // RoomTypeComponent,
    CustomerTypeComponent,
    VoidOrderComponent,
    UserComponent,
    CompanyComponent,
    DepartmentComponent,
    FinancialYearComponent,
    RoleComponent,
    RoleAssignmentComponent,
    RoleModuleComponent,
    UserPermissionComponent,
    RoleNameComponent,
    //INventoryComponents
    CategoryComponent,
    // InventoryDashboardComponent,
    InventoryItemComponent,
    StockInHandComponent,
    InventoryReceiptComponent,
    InventoryReceiptDetailsComponent,
    PeriodicConsumptionComponent,
    PeriodicConsumptionItemComponent,
    StockDamageComponent,
    StockDamageDetailsComponent,
    UnitTypeComponent,
    WareHouseComponent,
    WareHouseTypeComponent,
    // WareHousesComponent,
    
    ContraComponent,
    SalesComponent,
    SalesDetailComponent,
    ReceiptComponent,
    PurchaseComponent,
    PurchaseDetailsComponent,
    PaymentComponent,
    CreditNoteComponent,
    // JournalVouchercomponent,
    // JournalVoucherDetailComponent,
    DebitNoteComponent,
    // AccountDashboardComponent,
    SalesBillingDetailComponent,
    AccountTypeComponent,
    AccountTransactionTypeComponent,
    // AccountComponent,
    BalanceSheetComponent,
    // AccountBalanceSheetComponent,
    BillReturnViewComponent,
    AccountLedgerViewComponent,
    MaterializedViewComponent,
    AccountProfitAndLossComponent,
    AccountSaleBookComponent,
    // AccountSaleBookCustomer,
    AccountSaleBookDaywise,
    AccountSaleBookItem,
    TrialBalanceComponent,
    // MasterLedgerComponent,
    // SalesComponent,
    SalesBillingComponent,
    // SalesBillingDetailComponent,
    // AccountSaleBookComponent,
    // AccountSaleBookDaywise,
    AccountSaleBookCustomer,
    // AccountSaleBookItem,
    // AccountLedgerViewComponent,
    // BillReturnViewComponent,
    // MaterializedViewComponent,
    // PurchaseComponent,
    //POS
    TableComponent,
    POSDashboardComponent,
    MenuItemComponent,
    MenuComponent,
    MenuCategoryComponent,
    MenuConsumptionComponent,
    InventoryIssueDetailsComponent,
    ScreenMenuItemComponent,
    MenuListComponent,
    POSSaleBillingComponent,
    PosTableComponent,
    FilterMenuItemName,
    FilterByCategory,
    TableFilter,
    MenuFilter,
    FilterMenuConsumption,
    FilterMenuConsumption,
    FilterPipe,
    LinksFilterPipe,
    ScreenMenuCategoryFilter,
    ScreenMenuCategoryItemFilter,
    CustomerByName,
    PosOptionsComponent,
    PosCalculatorComponent,
    PosSettleComponent,
    PosOrdersComponent,
    PosTicketsComponent,
    PosInvoicePrintComponent,
    DashboardComponent,
    PosCustomerComponent,
    PartialMergeComponent,
    SplitMergeComponent,
    JournalAddEditComponent,
    PurchaseAddEditComponent,
    ReceiptAddEditComponent,
    PaymentAddEditComponent,
    ContraAddEditComponent,
    CreditNoteAddEditComponent,
    DebitNoteAddEditComponent,
    KitchenOrderViewComponent,
    MenuPriceComponent,
    OrderTicketComponent,
    TableMoveComponent,
    PrinterSettingComponent

  ],
  providers: [
    { provide: 'NAVCOMPONENTS', useValue: navcomponents },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthenticationService,
    ReservationTypeService,
    CustomerTypeService,
    MergeService,
    FacilityService,
    PaymentTypeService,
    ReservationTypeService,
    MasterLedgerService,
    AccountTransactionTypeService,
    RoomOccupiedService,
    RoomTypeService,
    DepartmentService,
    LoginService,
    UsersService,
    UserStoreService,
    AccountTransactionTypeService,
    AccountTransValuesService,
    JournalVoucherService
    ,
    DatePipe,
   
    FileService,
    AccountTransactionTypeService,
    PaymentTypeService,
    FacilityService,
    ReservationTypeService,
    RoomTypeService,
    CustomerTypeService,
    BillingService,

    OrderService,
    OrderStoreService,

    TableStoreService,
    CustomerStoreService,
    RoleService,
    UserRoleService,
    AccountTransactionTypeService,
    PurchaseService,
    PurchaseDetailsService,
    //pos
    TicketStoreService,
    TicketService,
    AccountTypeService,
    InventoryItemService,
    RoomService,
    AccountService,
    CategorysService,
    InventoryReceiptService,
    InventoryReceiptDetailsService,
    PeriodicConsumptionService,
    PeriodicConsumptionItemService,
    MenuConsumptionService,
    MenuConsumptionDetailsService
  ],
  

  bootstrap: [AppComponent]
})
export class AppModule { }
