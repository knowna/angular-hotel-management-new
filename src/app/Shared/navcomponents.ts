export const navcomponents=[
    {
      title: 'Front Office',
      icon: 'fa fa-shopping-cart',
      permission:'Front Office',
      children: [
        {
          title: 'Booking',
          icon: 'fa fa-circle',
          permission:'Front Office:Booking',
          children: [
            {
              title: 'Booking',
              link: 'reservation',
              permission:'Front Office:Booking:Booking',
            },
            {
              title: 'Check-in',
              link: 'reservation/checkin',
              permission:'Front Office:Booking:Check-in',
            },
            {
              title: 'Room Status',
              link: 'reservation/reservationstatus',
              permission:'Front Office:Booking:Room Status',
            },
            {
              title: 'Check-Out',
              link: 'reservation/checkout',
              permission:'Front Office:Booking:Check-Out',
            },
           
            {
              title: 'Inquiry',
              link: 'reservation/reservationinquiry',
              permission:'Front Office:Booking:Inquiry',
            },
            {
              title: 'Customer',
              link: 'reservation/customer',
              permission:'Front Office:Booking:Customer',
            }
                     
          ]
        },
        {
          title: 'Master Setup',
          icon: 'fa fa-book',
          children: [
            {
              title: 'Payment',
              link: 'reservation/payment',
            },
            {
              title: 'Facility',
              link: 'reservation/facility',
            },
            {
              title: 'Room Types',
              link: 'reservation/roomtype',
            },
            {
              title: 'Customer',
              link: 'reservation/customertypes',
            },
            {
              title: 'Reservation',
              link: 'reservation/reservationtype',
            },
            {
              title: 'Rooms Setup',
              link: 'reservation/room',
            },
          ]
        },
      ],
    }, 
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
      permission:'Billing',
      show: false,
      children: [
        {
          title: 'Order',
          img:'../../../assets/images/order.png',
          permission:'Billing:Order',
          home: true,
          show: false,
          children: [
            {
              title: 'New Order',
              img:'../../../assets/images/dish.png',
              link: 'pos-dashboard/tables',
              permission:'Billing:Menu:Item',
            },
            {
              title: 'Full Merge',
              img:'../../../assets/images/category.png',
              link: 'full-merge',
              permission:'Billing:Menu:Category',
            },
            {
              title: 'Partial Merge',
              img:'../../../assets/images/consumption.png',
              link: 'partial-merge',
              permission:'Billing:Menu:Consumption',
            },
            {
              title: 'Split Order',
              link: 'split-order',
              img:'../../../assets/images/menu.png',
              permission:'Billing:Menu:Menu',
            },
            
          ],
        },
        
        {
          title: 'Customer',
          img:'../../../assets/images/customer.png',
          link: 'pos-dashboard/customers',
          permission:'Billing:Customer',
          show: false,
        },
        {
          title: 'Report',
          img:'../../../assets/images/report.png',
          link: 'pos-dashboard/table/posbilling',
          permission:'Billing:Billing',
          show: false,
        },
        {
          title: 'Menu Setup',
          img:'../../../assets/images/menu.png',
          icon: 'layout-outline',
          permission:'Billing:Menu',
          show: false,
          children: [
            {
              title: 'Item',
              img:'../../../assets/images/dish.png',
              link: 'pos-dashboard/table/items',
              permission:'Billing:Menu:Item',
            },
            {
              title: 'Category',
              img:'../../../assets/images/category.png',
              link: 'pos-dashboard/table/category',
              permission:'Billing:Menu:Category',
            },
            {
              title: 'Consumption',
              img:'../../../assets/images/consumption.png',

              link: 'pos-dashboard/table/menuconsumption',
              permission:'Billing:Menu:Consumption',
            },
            {
              title: 'Menu Configure',
              link: 'pos-dashboard/table/menu',
              img:'../../../assets/images/menu.png',
              permission:'Billing:Menu:Menu',
            },
            {
              title: 'Table/Room Setup',
              pathMatch: 'prefix',
              link: 'pos-dashboard/table/table',
              img:'../../../assets/images/table.png',
              permission:'Billing:Menu:Table and Room Design',
            },
          ],
        },
      ],    
    },
    {
      title: 'Accounts',
      permission:'Account / Finance',
      group: true,
      img:'../../../assets/images/accounts.png',
      children: [
       ,
        {
          title: 'Transaction',
          permission:'Transaction',
          icon: 'edit-2-outline',
          children: [
            {
              title: 'Bank/Cash',
              link: 'Account/contra',
            },
            {
              title: 'Sales',
              link: 'Account/sales',
            },
            {
              title: 'Receipt',
              link: 'Account/receipt',
            },
            {
              title: 'Purchase',
              link: 'Account/purchase',
            },
            {
              title: 'Payment',
              link: 'Account/payment',
            },
            {
              title: 'Journal',
              link: 'Account/journalVoucher',
            },
            {
              title: 'Debit Note',
              link: 'Account/debit-note',
            },
            {
              title: 'Credit Note',
              link: 'Account/credit-note',
            },      
          ],
        },
        {
          title: 'Report',
          permission:'Report',
          icon: 'keypad-outline',
          link: '/pages/ui-features',
          children: [
            {
              title: 'Account',
              icon: 'grid-outline',
              children:[
                {
                  title: 'Day Book',
                  link: 'Account/journalVoucher',
                },
                {
                  title: 'Ledger',
                  link: 'Account/accountLedgerView',
                },
                {
                  title: 'Trial Balance',
                  link: 'Account/TrialBalance',
                },
                {
                  title: 'Profit & Loss',
                  link: 'Account/ProfitLoss',
                },
                {
                  title: 'Balance Sheet',
                  link: 'Account/BalanceSheet',
                },
                {
                  title: 'Cash Flow',
                  link: 'Account/journalVoucher',
                },
                {
                  title: 'Fund Flow',
                  link: 'Account/journalVoucher',
                },
              ],
            },
            {
              title: 'Sale / Purchase',
              icon: 'grid-outline',
              children:[
                {
                  title: 'Sales Book',
                  link: 'Account/SaleBook',
                },
                {
                  title: 'Item Wise',
                  link: 'Account/SaleItemWise',
                },
                {
                  title: 'Date Wise',
                  link: 'Account/SaleDateWise',
                },
                {
                  title: 'Customer',
                  link: 'Account/SaleCustomerWise',
                },
              ],
            },
            {
              title: 'Miscellaneous',
              icon: 'grid-outline',
              children:[
                {
                  title: 'Purchase Book',
                  link: 'Account/PurchaseBook',
                },
                {
                  title: 'Materialized View',
                  link: 'Account/MaterializedView',
                },
                {
                  title: 'Bill Return View',
                  link: 'Account/BillReturnView',
                },
              ],
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
              permission:'Account:Master:legder',
              link: 'Account/ledger',
              img:'../../../assets/images/ledger.png',
            },
            {
              title: 'Group Ledger',
              permission:'Account:Master:group',
              link: 'Account/accountType',
              img:'../../../assets/images/group-ledger.png',
            },
            {
              title: 'Transaction Type',
              link: 'Account/accounttransType',
              permission:'Account:Master:legder:transactionType',
              img:'../../../assets/images/transaction.png',
            },
          ],
        },  ] },
    {
      title: 'Inventory',
      permission:'Inventory',
      group: true,
    }, 
    {
      title: 'Transaction',
      permission:'Transaction',
      icon: 'edit-2-outline',
      children: [
        {
          title: 'Receipt',
          link: 'Inventory/inventory-receipt',
        },
        {
          title: 'Consumption',
          link: 'Inventory/consumption',
        },
        {
          title: 'Stock Damage',
          link: 'Inventory/stock-damage',
        },
      ],
    },
    {
      title: 'Report',
      icon: 'keypad-outline',
      permission:'Report',
      children: [
        {
          title: 'Stockin-hand',
          link: 'Inventory/stockinhand',
        },
      ],
    },   
    {
      title: 'Master',
      icon: 'browser-outline',
      permission:'Master',
      
      children: [
        {
          title: 'Item',
          link: 'Inventory/inventory',
        },
        {
          title: 'Category',
          link: 'Inventory/category',
        },
        {
          title: 'Unit Type',
          link: 'Inventory/unittype',
        },      
      ],
    },
    {
      title: 'Warehouse',
      icon: 'browser-outline',
      permission:'Warehouse',
      children: [
        {
          title: 'Warehouses',
          link: 'Inventory/warehouses',
        },
        {
          title: 'Warehouse Type',
          link: 'Inventory/WareHouseType',
        },
      ],
    },

    {
      title: 'User Management',
      group: true,
      permission:'User Management',
      
    }, 

    {
      title: 'Manage',
      icon: 'lock-outline',
      img:'../../../assets/images/manage.png',
      permission:'Manage',
      children: [
        {
          title: 'User',
          icon: 'lock-outline',
          permission:'Manage:user',
          img:'../../../assets/images/user.png',
          children: [
            // {
            //   title: 'Login',
            //   link: 'login',
            //   permission:'Manage:user:login',
            // },
            {
              title: 'Users',
              link: '/user',
              permission:'Manage:user:users',
              img:'../../../assets/images/group.png',
            },
            {
              title: 'Roles',
              link: '/managedashboard/role',
              permission: 'Manage:user:roles',
              img:'../../../assets/images/roles.png',
            },
            {
              title: 'Role Module',
              link: '/managedashboard/rolemodule',
              permission:'Manage:user:role module',
              img:'../../../assets/images/roleModule.png',
            },
            {
              title: 'User Roles',
              link: '/managedashboard/userRole',
              permission:'Manage:user:user roles',
              img:'../../../assets/images/userRole.png',
            },
          ],
        },
        {
          title: 'Management',
          icon: 'home-outline',
          permission:'Manage',
          img:'../../../assets/images/management.png',
          children: [
            {
              title: 'Department',
              link: '/managedashboard/department',
              permission: 'Manage:management:department',
              img:'../../../assets/images/department.png',
            },
            {
              title: 'Financial Year',
              link: '/managedashboard/financial',
              permission:'Manage:management : financial year',
              img:'../../../assets/images/financial-year.png',
            },
            {
              title: 'Company',
              link: '/managedashboard/company',
              permission: 'Manage:management: company',
              img:'../../../assets/images/company.png',
            },
          ],
        },      
      ],
    },
  ];