import { Pipe, PipeTransform } from '@angular/core';
import { navcomponents } from 'src/app/Shared/navcomponents';

@Pipe({
  name: 'LinksFilter'
})



export class LinksFilterPipe implements PipeTransform {


  permissionList=[
    'Front Office',
    'Front Office:Booking',
    'Front Office:Booking:Booking',
    'POS',
    'Billing',
    'Billing:Order'

];


  transform(items): any {
    
    const filteredLinks = items.filter(item => {
      
      if(this.permissionList.includes(item.permission)) {
        return item.permission;
      }
    });
    console.log(filteredLinks);
    
    return filteredLinks;
  }
  
}
