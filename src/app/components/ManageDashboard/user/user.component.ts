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

@Component({
    templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
    @ViewChild('template',{static:false}) TemplateRef: TemplateRef<any>;
    @ViewChild('templateNested',{static:false}) TemplateRef2: TemplateRef<any>;
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    user: IUser[];
    users: IUser;
    msg: string;
    indLoading: boolean = false;
    userFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    editingStatus: boolean;
    public formSubmitAttempt: boolean;
    buttonDisabled: boolean;
    passwordNotMatch = false;


    checkPattern : CheckPattern = new CheckPattern();
 

    constructor(private fb: FormBuilder, private _userService: UsersService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.userFrm = this.fb.group({
            Id: [''],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            UserName: ['', Validators.required],
            RoleName: ['', Validators.required],
            Password: ['', [Validators.required,Validators.pattern(this.checkPattern.passwordPattern)]],
            Email: ['', [Validators.required,Validators.pattern(this.checkPattern.emailPatternError)]],
            ConfirmPassword: ['', Validators.required],
            // PhoneNumber: ['', Validators.required],
            // IsActive: ['',],
            // ResetPassword: [''],
        });

        this.LoadUsers();
    }

    get Email() {
        return this.userFrm.controls.Email;
    }

    get Password() {
    return this.userFrm.controls.Password;
    }

    LoadUsers(): void {
        this.indLoading = true;
        this._userService.get(Global.BASE_USERACCOUNT_ENDPOINT)
            .subscribe(user => { 
                this.user = user;
                this.indLoading = false; 
                console.log(user) 
            },
            error =>{
                this.msg = error,
                this.indLoading=false
            } );
    }

    addUser() {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add User";
        this.modalBtnTitle = "Save";
        this.userFrm.reset();
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class:'modal-lg'
        });
    }

    editUser(Id: number) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit User";
        this.modalBtnTitle = "Save";
        this.users = this.user.filter(x => x.Id == Id)[0];
        this.userFrm.controls['Id'].setValue(this.users.Id);
        this.userFrm.controls['FirstName'].setValue(this.users.FirstName);
        this.userFrm.controls['LastName'].setValue(this.users.LastName);
        this.userFrm.controls['UserName'].setValue(this.users.UserName);
        // this.userFrm.controls['Password'].setValue(this.users.Password);
        this.userFrm.controls['Email'].setValue(this.users.Email);
        // console.log('the found user is', this.users);

        // this.userFrm.setValue(this.users);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class:'modal-lg'
        });

     
    }

    deleteUser(Id: number) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(false);
        this.modalTitle = "Confirm to Delete User?";
        this.modalBtnTitle = "Delete";
        this.users = this.user.filter(x => x.Id == Id)[0];
        this.userFrm.setValue(this.users);
        this.modalRef = this.modalService.show(this.TemplateRef, {
            backdrop: 'static',
            keyboard: false,
            class:'modal-lg'
        });
    }

    validateAllFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFields(control);
            }
        });
    }

    passwordMatch(){
        this.passwordNotMatch = false;
        console.log(this.userFrm.controls['Password'].value ,this.userFrm.controls['ConfirmPassword'].value);
        
        if(this.userFrm.controls['Password'].value != this.userFrm.controls['ConfirmPassword'].value){
            this.passwordNotMatch = true;
        }
        else{
            this.passwordNotMatch = false; 
        }
        
    }


    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    }

    onSubmit(formData:any) {
        this.formSubmitAttempt = true;
        this.msg = "";
        let users = this.userFrm

        if (users.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    console.log(formData.value);
                    
                    this._userService.post(Global.BASE_USERACCOUNT_CREATE_ENDPOINT, formData.value, ).subscribe(
                        data => {
                            if (data == 1)
                            {
                                alert("Data successfully added.");
                                // this.openModal2(this.TemplateRef2); 
                                this.LoadUsers();
                                this.formSubmitAttempt = false;
                            }
                            else {
                                this.msg = "There is some issue in saving records, please contact to system administrator!"
                            }

                            this.modalRef.hide();
                        },

                    );
                    break;
                case DBOperation.update:
                     
                    this._userService.put(Global.BASE_USERACCOUNT_UPDATE_ENDPOINT, formData.value.Id, formData.value, ).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "Data updated successfully.";
                                this.LoadUsers();
                                
                            }
                            else {
                                this.msg = "There is some issue in saving records, please contact to system administrator!"
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },

                    );
                    break;
                case DBOperation.delete:
                     ;
                    this._userService.delete(Global.BASE_USER_ENDPOINT, formData.value.UserId).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                this.msg = "Data successfully deleted.";
                                this.LoadUsers();
                            }
                            else {
                                this.msg = "There is some issue in saving records, please contact to system administrator!"
                            }
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        },
                    )
            }
        }

        else {
            this.validateAllFields(users);
        }
    }

    confirm(): void {
        this.modalRef2.hide();
    }

    reset() {
         ;
        let control = this.userFrm.controls['UserId'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.userFrm.reset();
        }
    }

    SetControlsState(isEnable: boolean) {
        isEnable ? this.userFrm.enable() : this.userFrm.disable();
    }
}