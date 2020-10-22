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
    {
      title: 'POS',
      permission:'POS',
      group: true,
      show: false
     
    }, 
    {
      title: 'Billing',
      icon: 'fa fa-shopping-cart-outline',
      permission:'Billing',
      show: false,
      children: [
        {
          title: 'Order',
          link: 'pos-dashboard/tables',
          permission:'Billing:Order',
          home: true,
          show: false,
        },
        
        {
          title: 'Customer',
          link: 'pos-dashboard/customers',
          permission:'Billing:Customer',
          show: false,
        },
        {
          title: 'Billing',
          link: 'pos-dashboard/table/posbilling',
          permission:'Billing:Billing',
          show: false,
        },
        {
          title: 'Menu',
          icon: 'layout-outline',
          permission:'Billing:Menu',
          show: false,
          children: [
            {
              title: 'Item',
              link: 'pos-dashboard/table/items',
              permission:'Billing:Menu:Item',
            },
            {
              title: 'Category',
              link: 'pos-dashboard/table/category',
              permission:'Billing:Menu:Category',
            },
            {
              title: 'Consumption',
              link: 'pos-dashboard/table/menuconsumption',
              permission:'Billing:Menu:Consumption',
            },
            {
              title: 'Menu',
              link: 'pos-dashboard/table/menu',
              permission:'Billing:Menu:Menu',
            },
            {
              title: 'Table and Room Design',
              pathMatch: 'prefix',
              link: 'pos-dashboard/table/table',
              permission:'Billing:Menu:Table and Room Design',
            },
          ],
        },
      ],    
    },
    {
      title: 'Account / Finance',
      permission:'Account / Finance',
      group: true,
    },
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
      permission:'Master',
      icon: 'layout-outline',
      children: [
        {
          title: 'Ledger',
          link: 'Account/account',
        },
        {
          title: 'Group Ledger',
          link: 'Account/accountType',
        },
        {
          title: 'Transaction Type',
          link: 'Account/accounttransType',
        },
      ],
    },  
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
      permission:'Manage',
      children: [
        {
          title: 'User',
          icon: 'lock-outline',
          children: [
            {
              title: 'Login',
              link: 'login',
            },
            {
              title: 'Users',
              link: '/user',
            },
            {
              title: 'Roles',
              link: '/managedashboard/role',
            },
            {
              title: 'Role Module',
              link: '/managedashboard/rolemodule',
            },
            {
              title: 'User Roles',
              link: '/managedashboard/userRole',
            },
          ],
        },
        {
          title: 'Management',
          icon: 'home-outline',
          children: [
            {
              title: 'Department',
              link: '/managedashboard/department',
            },
            {
              title: 'Financial Year',
              link: '/managedashboard/financial',
            },
            {
              title: 'Company',
              link: '/managedashboard/company',
            },
          ],
        },      
      ],
    },
  ];