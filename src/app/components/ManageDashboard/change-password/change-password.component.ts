import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { UsersService } from '../../../Service/user.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IUser } from '../../../Model/User/user';
import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs';
import { Global } from '../../../Shared/global'; import { AccountTransactionTypeService } from '../../../Service/Inventory/account-trans-type.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { CheckPattern } from 'src/app/models/check-pattern.model';
import { RoleService } from 'src/app/Service/role.service';

@Component({
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
    @ViewChild('template',{static:false}) TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested',{static:false}) TemplateRef2: TemplateRef<any>;
    
    user: any;
    openPasswordForm = false;
    constructor(private _roleService: RoleService,
        private fb: FormBuilder,
         private _userService: UsersService, private modalService: BsModalService) { }

    ngOnInit(): void {
       this.user = localStorage.getItem('userInformation');
      
       
       
    }

   

   
}