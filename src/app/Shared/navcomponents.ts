export const navcomponents=[
    // {
    //   title: 'Front Office',
    //   img:'../../../assets/images/frontOffice.png',
    //   permission:'Front Office',
    //   children: [
    //     {
    //       title: 'Booking',
    //       icon: 'fa fa-circle',
    //       permission:'Front Office:Booking',
    //       img:'../../../assets/images/bookingBooking.png',
    //       children: [
    //         {
    //           title: 'Reservation',
    //           link: 'reservation',
    //           img:'../../../assets/images/bookingBooking.png',
    //           permission:'Front Office:Booking:Booking',
    //         },
    //         {
    //           title: 'Check-in',
    //           link: 'reservation/checkin',
    //           img:'../../../assets/images/check-in.png',
    //           permission:'Front Office:Booking:Check-in',
    //         },
    //         {
    //           title: 'Room Status',
    //           link: 'reservation/reservationstatus',
    //           img:'../../../assets/images/status.png',
    //           permission:'Front Office:Booking:Room Status',
    //         },
    //         {
    //           title: 'Check-Out',
    //           link: 'reservation/checkout',
    //           img:'../../../assets/images/check-out.png',
    //           permission:'Front Office:Booking:Check-Out',
    //         },
           
    //         {
    //           title: 'Inquiry',
    //           link: 'reservation/reservationinquiry',
    //           img:'../../../assets/images/inquiry.png',
    //           permission:'Front Office:Booking:Inquiry',
    //         },
    //         {
    //           title: 'Customer',
    //           link: 'reservation/customer',
    //           img:'../../../assets/images/customer-booking.png',
    //           permission:'Front Office:Booking:Customer',
    //         }
                     
    //       ]
    //     },
    //     {
    //       title: 'Master Setup',
    //       permission:'Front Office:master',
    //       icon: 'fa fa-book',
    //       children: [
    //         {
    //           title: 'Payment Types',
    //           link: 'reservation/payment',
    //           permission:'Front Office:master:Payment',
    //         },
    //         {
    //           title: 'Facility',
    //           link: 'reservation/facility',
    //           permission:'Front Office:master:facility',
    //         },
    //         {
    //           title: 'Room Types',
    //           link: 'reservation/roomtype',
    //           permission:'Front Office:master:roomtype',
    //         },
    //         {
    //           title: 'Customer Types',
    //           permission:'Front Office:master:customertypes',
    //           link: 'reservation/customertypes',
    //         },
    //         {
    //           title: 'Reservation Type',
    //           permission:'Front Office:master:reservationtype',
    //           link: 'reservation/reservationtype',
    //         },
    //         {
    //           title: 'Rooms Setup',
    //           permission:'Front Office:master:room',
    //           link: 'reservation/room',
    //         },
    //       ]
    //     },
    //   ],
    // }, 
    // {
    //   title: 'POS',
    //   img:'../../../assets/images/pos1.svg',
    //   permission:'POS',
    //   group: true,
    //   show: false
     
    // }, 
    {
      title: 'POS',
      img:'../../../assets/images/pos.png',
      icon: 'fa fa-shopping-cart-outline',
      permission:'POS',
      show: false,
      children: [
        {
          title: 'Order',
          img:'../../../assets/images/order.png',
          permission:'POS:Order',
          home: true,
          show: false,
          children: [
            {
              title: 'New Order',
              img:'../../../assets/images/dish.png',
              link: 'pos-dashboard/tables',
              permission:'POS:Order:NewOrder',
            },
            {
              title: 'Full Merge',
              img:'../../../assets/images/category.png',
              link: 'full-merge',
              permission:'POS:Order:FullMerge',
            },
            {
              title: 'Partial Merge',
              img:'../../../assets/images/consumption.png',
              link: 'partial-merge',
              permission:'POS:Order:PartialMerge',
            },
            {
              title: 'Split Order',
              link: 'split-order',
              img:'../../../assets/images/menu.png',
              permission:'POS:Order:SplitOrder',
            },
            
          ],
        },
        {
          title: 'Notification',
          img:'../../../assets/images/report.png',
          link: 'pos-dashboard/table/kitchen-order',
          permission:'POS:Notification',
          show: false,
        },
        {
          title: 'Customer',
          img:'../../../assets/images/customer.png',
          link: 'pos-dashboard/customers',
          permission:'POS:Customer',
          show: false,
        },
        {
          title: 'Report',
          img:'../../../assets/images/report.png',
          link: 'pos-dashboard/table/posbilling',
          permission:'POS:Report',
          show: false,
        },
        {
          title: 'Menu Setup',
          img:'../../../assets/images/menu.png',
          icon: 'layout-outline',
          permission:'POS:MenuSetup',
          show: false,
          children: [
            {
              title: 'Menu Price',
              img:'../../../assets/images/dish.png',
              link: 'pos-dashboard/table/menu-price',
              permission:'POS:MenuSetup:MenuPrice',
            },
            {
              title: 'Item',
              img:'../../../assets/images/dish.png',
              link: 'pos-dashboard/table/items',
              permission:'POS:MenuSetup:Item',
            },
            {
              title: 'Category',
              img:'../../../assets/images/category.png',
              link: 'pos-dashboard/table/category',
              permission:'POS:MenuSetup:Category',
            },
            {
              title: 'Consumption',
              img:'../../../assets/images/consumption.png',

              link: 'pos-dashboard/table/menuconsumption',
              permission:'POS:MenuSetup:Consumption',
            },
            {
              title: 'Menu Configure',
              link: 'pos-dashboard/table/menu',
              img:'../../../assets/images/menu.png',
              permission:'POS:MenuSetup:MenuConfigure',
            },
            {
              title: 'Table/Room Setup',
              pathMatch: 'prefix',
              link: 'pos-dashboard/table/table',
              img:'../../../assets/images/table.png',
              permission:'POS:MenuSetup:TableRoomSetup',
            },
          ],
        },
      ],    
    },
    {
      title: 'Account',
      permission:'Account',
      group: true,
      img:'../../../assets/images/accounts.png',
      children: [
        {
          title: 'Transaction',
          permission:'Account:Transaction',
          icon: 'edit-2-outline',
          children: [
            {
              title: 'Journal',
              permission:'Account:Transaction:Journal',
              link: 'Account/journalVoucher',
            },
            {
              title: 'Purchase',
              permission:'Account:Transaction:Purchase',
              link: 'Account/purchase',
            },
            {
              title: 'Sales',
              permission:'Account:Transaction:Sales',
              link: 'Account/sales',
            },
            {
              title: 'Receipt',
              permission:'Account:Transaction:Receipt',
              link: 'Account/receipt',
            },
            {
              title: 'Payment',
              permission:'Account:Transaction:Payment',
              link: 'Account/payment',
            },
            {
              title: 'Bank/Cash',
              permission:'Account:Transaction:BankCash',
              link: 'Account/contra',
            },
            {
              title: 'Credit Note',
              permission:'Account:Transaction:CreditNote',
              link: 'Account/credit-note',
            },  
            {
              title: 'Debit Note',
              permission:'Account:Transaction:DebitNote',
              link: 'Account/debit-note',
            },
          ],
        },
        {
          title: 'Report',
          permission:'Account:Report',
          icon: 'keypad-outline',
          link: '/pages/ui-features',
          children: [
            {
              title: 'Day Book',
              link: 'Account/journalVoucher',
              permission:'Account:Report:DayBook'
            },
            {
              title: 'Ledger',
              link: 'Account/accountLedgerView',
              permission:'Account:Report:Ledger'
            },
            {
              title: 'Trial Balance',
              link: 'Account/TrialBalance',
              permission:'Account:Report:TrialBalance'
            },
            {
              title: 'Cash Flow',
              link: 'Account/SaleBook',
              permission:'Account:Report:CashFlow'
            },
            {
              title: 'Fund Flow',
              link: 'Account/SaleBook',
              permission:'Account:Report:FundFlow'
            },
            {
              title: 'Profit & Loss',
              link: 'Account/ProfitLoss',
              permission:'Account:Report:ProfitLoss'
            },
            {
              title: 'Balance Sheet',
              link: 'Account/BalanceSheet',
              permission:'Account:Report:BalanceSheet'
            },
            {
              title: 'Sales Book',
              link: 'Account/SaleBook',
              permission:'Account:Report:SalesBook'
            },
            {
              title: 'Sales Item Wise',
              link: 'Account/SaleItemWise',
              permission:'Account:Report:SalesItemWise'
            },
            {
              title: 'Sales Date Wise',
              link: 'Account/SaleDateWise',
              permission:'Account:Report:SalesDateWise'
            },
            {
              title: 'Sales Customer Wise',
              link: 'Account/SaleCustomerWise',
              permission:'Account:Report:SalesCustomerWise'
            },
            {
              title: 'Purchase Book',
              link: 'Account/PurchaseBook',
              permission:'Account:Report:PurchaseBook'
            },
            {
              title: 'Materialized View',
              link: 'Account/MaterializedView',
              permission:'Account:Report:MaterializedView'
            },
            {
              title: 'Bill Return View',
              link: 'Account/BillReturnView',
              permission:'Account:Report:BillReturnView'
            },     
          
          ],
        },
        {
          title: 'Master',
          permission:'Account:Master',
          icon: 'layout-outline',
          img:'../../../assets/images/master.png',
          children: [
            {
              title: 'Ledger',
              permission:'Account:Master:Ledger',
              link: 'Account/ledger',
              img:'../../../assets/images/ledger.png',
            },
            {
              title: 'Group Ledger',
              permission:'Account:Master:GroupLedger',
              link: 'Account/accountType',
              img:'../../../assets/images/group-ledger.png',
            },
            {
              title: 'Transaction Type',
              link: 'Account/accounttransType',
              permission:'Account:Master:TransactionType',
              img:'../../../assets/images/transaction.png',
            },
          ],
        }, 
      ] 
    },
    {
      title: 'Inventory',
      permission:'Inventory',
      img:'../../../assets/images/inventory.png',
      // group: true,
      show: false,
      children: [
        {
          title: 'Transaction',
          permission:'Inventory:Transaction',
          img:'../../../assets/images/inventory.png',
          icon: 'edit-2-outline',
          children: [
            {
              title: 'Receipt',
              link: 'Inventory/inventory-receipt',
              permission: 'Inventory:Transaction:Receipt'
            },
            {
              title: 'Consumption',
              link: 'Inventory/consumption',
              permission: 'Inventory:Transaction:Consumption'
            },
            {
              title: 'Stock Damage',
              link: 'Inventory/stock-damage',
              permission: 'Inventory:Transaction:StockDamage'
            },
          ],
        },
        {
          title: 'Master',
          icon: 'browser-outline',
          permission:'Inventory:Master',
          img:'../../../assets/images/master.png',
          children: [
            {
              title: 'Item',
              link: 'Inventory/item',
              permission: 'Inventory:Master:Item',
              img:'../../../assets/images/item.png',
             
            },
            {
              title: 'Category',
              link: 'Inventory/category',
              permission: 'Inventory:Master:Category',
              img:'../../../assets/images/category-inventory.png',
            },
            {
              title: 'Unit Type',
              link: 'Inventory/unittype',
              permission: 'Inventory:Master:UnitType',
              img:'../../../assets/images/unitType.png',
            },      
          ],
        },
        {
          title: 'Report',
          icon: 'keypad-outline',
          permission:'Inventory:Report',
          children: [
            {
              title: 'Stock In Hand',
              link: 'Inventory/stockinhand',
              permission: 'Inventory:Report:StockInHand'
            },
          ],
        },
        {
          title: 'Warehouses',
          icon: 'browser-outline',
          permission:'Inventory:Warehouses',
          img:'../../../assets/images/warehouses.png',
          children: [
            {
              title: 'Warehouse',
              link: 'Inventory/WareHouse',
              permission: 'Inventory:Warehouses:Warehouse',
              img:'../../../assets/images/warehouse.png',
            },
            {
              title: 'Warehouse Type',
              link: 'Inventory/WareHouseType',
              img:'../../../assets/images/warehouseType.png',
              permission: 'Inventory:Warehouses:WareHouseType'
            },
          ],
        },

      ]
    }, 
    
    // {
    //   title: 'User Management',
    //   group: true,
    //   permission:'User Management',
      
    // }, 

    {
      title: 'Manage',
      icon: 'lock-outline',
      img:'../../../assets/images/category.png',
      permission:'Manage',
      children: [
        {
          title: 'User',
          icon: 'lock-outline',
          permission:'Manage:User',
          img:'../../../assets/images/user.png',
          children: [
            // {
            //   title: 'Login',
            //   link: 'login',
            //   permission:'Manage:user:login',
            // },
            {
              title: 'Roles',
              link: '/managedashboard/role',
              permission: 'Manage:User:Roles',
              img:'../../../assets/images/roles.png',
            },
            {
              title: 'Users',
              link: '/user',
              permission:'Manage:User:Users',
              img:'../../../assets/images/group.png',
            },
            // {
            //   title: 'Roles',
            //   link: '/managedashboard/role',
            //   permission: 'Manage:User:Roles',
            //   img:'../../../assets/images/roles.png',
            // },
            // {
            //   title: 'Role Module',
            //   link: '/managedashboard/rolemodule',
            //   permission:'Manage:User:RoleModule',
            //   img:'../../../assets/images/roleModule.png',
            // },
            // {
            //   title: 'User Roles',
            //   link: '/managedashboard/userRole',
            //   permission:'Manage:User:UserRoles',
            //   img:'../../../assets/images/userRole.png',
            // },
          ],
        },
        {
          title: 'Management',
          icon: 'home-outline',
          permission:'Manage:Management',
          img:'../../../assets/images/management.png',
          children: [
            {
              title: 'Department',
              link: '/managedashboard/department',
              permission: 'Manage:Management:Department',
              img:'../../../assets/images/department.png',
            },
            {
              title: 'Table/Room Type',
              link: '/managedashboard/table-room',
              permission: 'Manage:Management:TableRoomType',
              img:'../../../assets/images/manage-roomtype.png',
            },
            {
              title: 'Financial Year',
              link: '/managedashboard/financial',
              permission:'Manage:Management:FinancialYear',
              img:'../../../assets/images/financial-year.png',
            },
            {
              title: 'Company',
              link: '/managedashboard/company',
              permission: 'Manage:Management:Company',
              img:'../../../assets/images/company.png',
            },
          ],
        },      
      ],
    },
  ];