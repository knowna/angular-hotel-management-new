import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
    selector: 'app-header-component',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './header.component.html',
    styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit{

    public clicked=false;
    openChild = false;

    closeSidebar = false;
    public clickeditem:[];


    openChildren = false;

    public open(link){
        this.router.navigate([link])
    }

    public clickedFunc(what){
    }

    constructor(public router: Router,
         @Inject("NAVCOMPONENTS") public  items:any[] ) {
        
       
    
        
    }

   
    ngOnInit(){ 
        // console.log(localStorage.getItem('permissionList'));

        this.items.forEach(item => {
            item.show = false;
            if(item.children != null) {
                 item.children.forEach(child => {
                    child.show = false;
 
                     if(child.children != null) {
                        child.children?.forEach(c => {
                            c.show = false;
                        });
                     }
                 });
            }
        })
    }

    public pageName = 'Job';
  
    

   
    
}
