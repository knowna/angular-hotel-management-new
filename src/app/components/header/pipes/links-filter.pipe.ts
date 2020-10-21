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
    'Billing:Menu:Table and Room Design'

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
