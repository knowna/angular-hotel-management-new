import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../Service/authentication.service';
import { LoginService } from '../../Service/login.service';
import { DBOperation } from '../../Shared/enum';
import { Global } from '../../Shared/global';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from 'src/app/Service/user.service';


@Component({
    selector:'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    msg: string;
    returnUrl: string;
    dbops: DBOperation;
    form: FormGroup;
    private formSubmitAttempt: boolean;
    showPassword = false;

    company:any;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private authenticationSevice: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private authService:AuthenticationService,
        private toastrService: ToastrService,
        private _userService: UsersService,
      
    ) { }

    ngOnInit() {
        this.company = JSON.parse(localStorage.getItem("company"));
        this.form = this.fb.group({
            UserName: ['', Validators.required],
            Password: ['', Validators.required],
            Remember: ['']
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
    onSubmit() {
        let loginfrm = this.form;
        
        this.authenticationSevice.login(Global.BASE_LOGIN_ENDPOINT, loginfrm.value).subscribe(
                (data) => {
                    
                    if (data!= null ) {
                        localStorage.setItem("userInformation",JSON.stringify(data));
                        localStorage.setItem("userToken",data.Token);
                        this.authService.authenticate();



                        // this._userService.getById(Global.BASE_ROLE_ENDPOINT,data.RoleName)
                        // .subscribe(data => { 
                        //     let PermissionList=data[0].PermissionList.split(',');
                        //     if(PermissionList.includes('')){
                        //         let index = PermissionList.indexOf('');
                        //         PermissionList.splice(index,1);
                        //     }
                            
                        //     localStorage.setItem('permissionList',PermissionList);
                        //     if(PermissionList.length>0){

                        //         this.router.navigate(["/dashboard"]);
                        //         this.toastrService.success('You are successfully logged in!');
                        //     }
                            
                
                        // },
                        // error =>{
                           
                        // } );
                    

                        // this.getPermissionByRoleId(data.RoleName);
                        // window.location.reload();
                        this.router.navigate(["/dashboard"]);
                        this.toastrService.success('You are successfully logged in!');
                        // window.location.reload();
                    } else {
                        // alert("Login failed no data");
                        this.toastrService.error('Login Failed!');
                    }
                },
                error => {
                    // alert("Login failed");
                    this.toastrService.error('Login Failed!');
                    console.log(error);
                }
            );


    }

    getPermissionByRoleId(RoleId){
        
        this._userService.getById(Global.BASE_ROLE_ENDPOINT,RoleId)
        .subscribe(data => { 
            console.log(data.PermissionList);
            let PermissionList=data.PerPermissionList.split(',');
            if(PermissionList.includes('')){
                let index = PermissionList.indexOf('');
                PermissionList.splice(index,1);
            }
            localStorage.setItem('permissionList',PermissionList);
            console.log(localStorage.getItem('permissionList'));
            

        },
        error =>{
           
        } );
    
    }
}