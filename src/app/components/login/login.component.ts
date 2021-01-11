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
    filteredPermission =[];

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
        let  PermissionListAb=[];
        
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

            //     //breaking permissions  string to list
            //     PermissionList.forEach(x => {

            //         let y = x.split(':');
            //         if(y.length==2){
                        
            //             PermissionListAb.push(y[0]);
            //             PermissionListAb.push(x);

            //         }

            //         else if(y.length == 3){
                        
            //             PermissionListAb.push(y[0]);
            //             PermissionListAb.push(y[0]+':'+y[1]);
            //             PermissionListAb.push(x);
                        
            //         }
                    
            //     });



            //     let list=[]
            //     // //Splicing duplicate
            //     PermissionListAb.forEach(permission => {
                
            //         if(list.includes(permission)){
                        
            //         }else{
                        
            //             list.push(permission);
            //         }
                    
            //     });
            //         this.filteredPermission = list;            
            
            //     //todo splice and set
                                            
            //     localStorage.setItem('permissionList',JSON.stringify(this.filteredPermission));
                    
            //         this.router.navigate(["/dashboard"]);
                    
                    
            //         this.toastrService.success('You are successfully logged in!');
            //         window.location.reload();

                

               
    
            // },
            // error =>{
                
            // } );
            

                this.router.navigate(["/dashboard"]);
                this.toastrService.success('You are successfully logged in!');
            } else {
                this.toastrService.error('Login Failed!');
            }
        },
        error => {
            this.toastrService.error('Login Failed!');
            console.log(error);
        }
    );


    }

   }