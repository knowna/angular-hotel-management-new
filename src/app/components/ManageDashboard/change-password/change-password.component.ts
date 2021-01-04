﻿import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
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
import { AuthenticationService } from 'src/app/Service/authentication.service';

@Component({
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
    @ViewChild('template',{static:false}) TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested',{static:false}) TemplateRef2: TemplateRef<any>;
    
    user: any;
    userRequest:any={};
    openPasswordForm = false;
    confirmPassword ='';
    password ='';
    passwordNotMatch = false;

    constructor(private _roleService: RoleService,
        private fb: FormBuilder,
        public authService:AuthenticationService,
         private _userService: UsersService, private modalService: BsModalService) { }

    ngOnInit(): void {
       this.user = JSON.parse(localStorage.getItem('userInformation'));
      
    }

    passwordMatch(){
        console.log(this.password, this.confirmPassword);
        
        this.passwordNotMatch = false;
        
        if(this.password!= this.confirmPassword){
            this.passwordNotMatch = true;
        }
        else{
            this.passwordNotMatch = false; 
        }
        console.log(this.passwordNotMatch);
        
    }

    onSave(){
        this.userRequest.Id = this.user.Id;
        this.userRequest.FirstName = this.user.FirstName;
        this.userRequest.LastName = this.user.LastName;
        this.userRequest.Email = this.user.Email;
        this.userRequest.UserName = this.user.UserName;
        this.userRequest.RoleName = this.user.RoleName;
        this.userRequest.IsActive = this.user.IsActive;
        this.userRequest.Password = this.password;
        this.userRequest.ConfirmPassword = this.confirmPassword;

        this._userService.put(Global.BASE_USERACCOUNT_UPDATE_ENDPOINT, this.userRequest.Id, this.userRequest).subscribe(
            data => {
                if (data == 1) //Success
                {
                    alert("Data updated successfully.");
                    this.authService.logout();
                }
                else {
                    alert("There is some issue in saving records, please contact to system administrator!");
                }
            },

        );
        
    }

   

   
}