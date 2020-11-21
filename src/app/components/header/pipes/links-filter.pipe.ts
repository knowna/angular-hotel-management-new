import { Pipe, PipeTransform } from '@angular/core';
import { navcomponents } from 'src/app/Shared/navcomponents';

@Pipe({
  name: 'LinksFilter'
})



export class LinksFilterPipe implements PipeTransform {


  permissionList=[
    'POS',
    'Billing',
    'Billing:Order',
    'Billing:Customer',
    'Billing:Billing',
    'Billing:Menu',
    'Billing:Menu:Item',
    'Billing:Menu:Category',
    'Billing:Menu:Consumption',
    'Billing:Menu:Menu',
    'Billing:Menu:Table and Room Design',
    'Manage',
    'Manage:user',
    'Manage:user:login',
    'Manage:user:users',
    'Manage:user:roles',
    'Manage:user:role module',
    'Manage:user:user roles',
    'Manage:management',
    'Manage:management:department',
    'Manage:management : financial year',
    'Manage:management: company',
    'Account / Finance',
    'Account:Master',
    'Account:Master:legder',
    'Account:Master:group',
    
    'Account:Master:legder:transactionType'



];


  transform(items): any {

  if(!items) return [];
   
    
    const filteredLinks = items.filter(item => {
      
      if(this.permissionList.includes(item.permission)) {
        return item.permission;
      }
    });
    
    return filteredLinks;
  }
  
}
