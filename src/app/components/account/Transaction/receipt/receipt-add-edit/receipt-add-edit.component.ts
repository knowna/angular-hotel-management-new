import { DatePipe, Location } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Account } from 'src/app/Model/Account/account';
import { AccountTrans } from 'src/app/Model/AccountTransaction/accountTrans';
import { AccountTransValuesService } from 'src/app/Service/accountTransValues.service';
import { FileService } from 'src/app/Service/file.service';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { DBOperation } from 'src/app/Shared/enum';
import { Global } from 'src/app/Shared/global';

@Component({
  selector: 'app-receipt-add-edit',
  templateUrl: './receipt-add-edit.component.html',
  styleUrls: ['./receipt-add-edit.component.css']
})

export class ReceiptAddEditComponent implements OnInit {
  @ViewChild('template') TemplateRef: TemplateRef<any>;
  @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
  @ViewChild('fileInput') fileInput: ElementRef;

  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  dbops: DBOperation;
  receiptList: AccountTrans[];
  receiptLists: AccountTrans;
  msg: string;
  modalTitle: string;
  modalBtnTitle: string;
  formattedDate: any;
  public account: Account[] = [];
  public accountcashbank: Account[] = [];
  public receiptFrm: FormGroup;
  public formSubmitAttempt: boolean;
  public buttonDisabled: boolean;
  indLoading: boolean = false;
  public fromDate: any;
  public toDate: any;
  public sfromDate: string;
  public stoDate: string;
  public currentYear: any = {};
  public currentUser: any = {};
  public company: any = {};
  dropMessage: string = "Upload Reference File";
  uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
  fileUrl: string = '';
  file: any[] = [];
  settings = {
  bigBanner: false,
  timePicker: false,
  format: 'dd/MM/yyyy',
  defaultOpen: false
  };

  public SourceAccountTypeId: string;
  public currentaccount: Account;
  public vdate: string;
  public currentvdate: string;

  toExportFileName: string = 'Receipt Report -' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
  toPdfFileName: string = 'Receipt Report -' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

  mode : any;
  id : any;

  /**
   * Receipt Constructor
   * 
   * @param fb 
   * @param _journalvoucherService 
   * @param _accountTransValues 
   * @param date 
   * @param modalService 
   */
  constructor(
    private fb: FormBuilder, 
    private _journalvoucherService: JournalVoucherService, 
    private _accountTransValues: AccountTransValuesService, 
    private date: DatePipe, 
    private modalService: BsModalService,
    private fileService: FileService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.company = JSON.parse(localStorage.getItem('company'));
    this.fromDate = this.currentYear['NepaliStartDate'];
    this.toDate = this.currentYear['NepaliEndDate'];
  }

  /**
   * Overrides OnInit component
   */
  ngOnInit(): void {
    this.receiptFrm = this.fb.group({
      Id: [''],
      Name: [''],
      AccountTransactionDocumentId: ['' ],
      Description: [''],
      Amount: [''],
      Date: ['', Validators.compose([Validators.required, this.nepaliDateValidator])],
      drTotal: [''],
      crTotal: [''],
      SourceAccountTypeId: ['' ],
      AccountTransactionValues: this.fb.array([this.initAccountValue()]),
      FinancialYear: [''],
      UserName: [''],
      CompanyCode: ['']
    });

    // this.loadReceiptList();
    this.indLoading = true;
    this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT&AccountGeneral=AG')
      .subscribe(at => {
        this.account = at;
        if(this.account) {
          this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT')
            .subscribe(at => {
              this.accountcashbank = at;
                if(this.accountcashbank) {
                  this.route.params.subscribe(params => {
                    this.mode = params['mode'];
                      if(this.mode == 'add') {
                        this.addReceipt();
                      }else{
                        this.id = params['id'];
                        this.editReceipt(this.id);
                      }
                  });
                }
            },
            error => this.msg = <any>error);
        }
      },
      error => this.msg = <any>error);

    
  }

  /**
   * Display file in modal
   * @param fileUrl 
   * @param template 
   */
  viewFile(fileUrl, template: TemplateRef<any>) {
    this.fileUrl = fileUrl;
    this.modalTitle = "View Attachment";
    this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-lg' });
  }

  /**
   * Validate date input
   * @param control 
   */
  voucherDateValidator(currentdate: string) {
    if (currentdate == "") {
      alert("Please enter the voucher date");
      return false;
    }
    let today = new Date;
    this._journalvoucherService.get(Global.BASE_NEPALIMONTH_ENDPOINT + '?NDate=' + currentdate)
      .subscribe(SB => {
          this.vdate = SB;
      },
          error => this.msg = <any>error);
    if (this.vdate === "undefined") {
      alert("Please enter the voucher valid date");
      return false;
    }
    let voucherDate = new Date(this.vdate);

    let tomorrow = new Date(today.setDate(today.getDate() + 1));

    let currentYearStartDate = new Date(this.currentYear.StartDate);
    let currentYearEndDate = new Date(this.currentYear.EndDate);

    if ((voucherDate < currentYearStartDate) || (voucherDate > currentYearEndDate) || voucherDate >= tomorrow) {
      alert("Date should be within current financial year's start date and end date inclusive");
      return false;
    }
    else {
      return true;
    }
  }
  /**
   * Gets Englishdate
   * @param Id 
   */
  getVoucherDate(currentdate: string) {
    this.indLoading = true;
    return this._journalvoucherService.get(Global.BASE_NEPALIMONTH_ENDPOINT + '?NDate=' + currentdate)
      .subscribe(SB => {
        this.vdate = SB; this.indLoading = false;
      },
      error => this.msg = <any>error);
  }
  /**
   * Loads receipt list
   */
  loadReceiptList() {
    this.indLoading = true;
    
    this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT&AccountGeneral=AG')
      .subscribe(at => {
        this.account = at;
      },
      error => this.msg = <any>error);

    this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT')
      .subscribe(at => {
        this.accountcashbank = at;
      },
      error => this.msg = <any>error);

  }


  /**
   * Opens add receipt modal form
   */
  addReceipt() {
    this.reset();
    this.dbops = DBOperation.create;
    this.SetControlsState(true);
    this.modalTitle = "Add Receipt";
    this.modalBtnTitle = "Save";
    this.receiptFrm.controls['Name'].setValue('Receipt');
    this.indLoading = false;
    // this.modalRef = this.modalService.show(this.TemplateRef, {
    //     backdrop: 'static',
    //     keyboard: false,
    //     class: 'modal-xl'
    // });
  }
  
  /**
   * Gets individual journal voucher
   * @param Id 
   */
  getJournalVoucher(Id: number) {
    // this.indLoading = true;
    return this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?TransactionId=' + Id);
  }

  /**
   * Opens the receipt in edit form
   * @param Id 
   */
  editReceipt(Id: number) {
    this.reset();
    this.dbops = DBOperation.update;
    // this.SetControlsState(true);
    this.modalTitle = "Edit Recepit";
    this.modalBtnTitle = "Save";
    this.getJournalVoucher(Id)
      .subscribe((receipt: AccountTrans) => {
        // console.log('the receipt is', receipt)
        if(receipt.Id == 0) {
          this.toastrService.info('No record found!');
          this.router.navigate(['Account/receipt']);
        }
        this.indLoading = false;
        this.receiptFrm.controls['Id'].setValue(receipt.Id);
        this.receiptFrm.controls['Name'].setValue(receipt.Name);
        this.receiptFrm.controls['AccountTransactionDocumentId'].setValue(receipt.AccountTransactionDocumentId);
        this.currentaccount = this.accountcashbank.filter(x => x.Id === receipt.SourceAccountTypeId)[0];
        if (this.currentaccount !== undefined) {
            this.receiptFrm.controls['SourceAccountTypeId'].setValue(this.currentaccount);
        }
        this.receiptFrm.controls['Description'].setValue(receipt.Description);
        this.receiptFrm.controls['Date'].setValue(receipt.AccountTransactionValues[0]['NVDate']);

        this.receiptFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        const control = <FormArray>this.receiptFrm.controls['AccountTransactionValues'];

        for (var i = 0; i < receipt.AccountTransactionValues.length; i++) {
            this.currentaccount = this.account.filter(x => x.Id === receipt.AccountTransactionValues[i]["AccountId"])[0];
            if (this.currentaccount !== undefined) {
                let currentaccountvoucher = receipt.AccountTransactionValues[i];
                let instance = this.fb.group(currentaccountvoucher);
                instance.controls["AccountId"].setValue(this.currentaccount);
                control.push(instance);
            }
        }

        this.SetControlsState(true);
        
        // this.modalRef = this.modalService.show(this.TemplateRef, {
        //     backdrop: 'static',
        //     keyboard: false,
        //     class: 'modal-xl'
        // });
      },
      error => this.msg = <any>error);
  }

  deleteReceipt(Id: number) {
    this.dbops = DBOperation.delete;
    this.SetControlsState(true);
    this.modalTitle = "Delete Receipt";
    this.modalBtnTitle = "Delete";
    this.getJournalVoucher(Id)
      .subscribe((receipt: AccountTrans) => {
          this.indLoading = false;
          this.receiptFrm.controls['Id'].setValue(receipt.Id);
          this.receiptFrm.controls['Name'].setValue(receipt.Name);
          this.receiptFrm.controls['AccountTransactionDocumentId'].setValue(receipt.AccountTransactionDocumentId);
          this.currentaccount = this.accountcashbank.filter(x => x.Id === receipt.SourceAccountTypeId)[0];
          if (this.currentaccount !== undefined) {
              this.receiptFrm.controls['SourceAccountTypeId'].setValue(this.currentaccount);
          }
          this.receiptFrm.controls['Description'].setValue(receipt.Description);
          this.receiptFrm.controls['Date'].setValue(receipt.AccountTransactionValues[0]['NVDate']);

          this.receiptFrm.controls['AccountTransactionValues'] = this.fb.array([]);
          const control = <FormArray>this.receiptFrm.controls['AccountTransactionValues'];

          for (var i = 0; i < receipt.AccountTransactionValues.length; i++) {
              this.currentaccount = this.account.filter(x => x.Id === receipt.AccountTransactionValues[i]["AccountId"])[0];
              if (this.currentaccount !== undefined) {
                  let currentaccountvoucher = receipt.AccountTransactionValues[i];
                  let instance = this.fb.group(currentaccountvoucher);
                  instance.controls["AccountId"].setValue(this.currentaccount);
                  control.push(instance);
              }
          }

          this.modalRef = this.modalService.show(this.TemplateRef, {
              backdrop: 'static',
              keyboard: false,
              class: 'modal-xl'
          });
      },
      error => this.msg = <any>error);
  }

  initAccountValue() {
    //initialize our vouchers
    return this.fb.group({
      AccountId: ['', Validators.required],
      Debit: [''],
      Credit: ['', Validators.required],
      Description: ['']
    });
  }

  addAccountValues() {
    const control = <FormArray>this.receiptFrm.controls['AccountTransactionValues'];
    const addReceipt = this.initAccountValue();
    control.push(addReceipt);
  }

  //remove the rows//
  removeAccount(i: number) {
    let controls = <FormArray>this.receiptFrm.controls['AccountTransactionValues'];
    let controlToRemove = this.receiptFrm.controls.AccountTransactionValues['controls'][i].controls;
    let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

    // let currentaccountid = controlToRemove.Id.value;
    let currentaccountid = controlToRemove.Id?.value ? controlToRemove.Id.value : 0;

    if (currentaccountid != "0") {
        this._accountTransValues.delete(Global.BASE_JOURNAL_ENDPOINT, currentaccountid)
            .subscribe(data => {
                (data == 1) && controls.removeAt(i);
                this.toastrService.success('Data removed successfully!');
            });
    } else {
        if (i >= 0) {
            controls.removeAt(i);
        } else {
            alert("Form requires at least one row");
        }
    }
  }

  sumDebit() {
    let controls = this.receiptFrm.controls.AccountTransactionValues.value;

    return controls.reduce(function (total: any, accounts: any) {
        return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
    }, 0);
  }

  sumCredit() {
    let controls = this.receiptFrm.controls.AccountTransactionValues.value;

    return controls.reduce(function (total: any, accounts: any) {
        return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
    }, 0);
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

  //opens the confirmation window  modal
  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
  }

  onSubmit(formData: any, fileUpload: any) {
    this.msg = "";
    this.formSubmitAttempt = true;
    let receipt = this.receiptFrm;

    let currentdate = receipt.get('Date').value;
    if(currentdate == "") {
      alert("Please enter the voucher date");
    }else{
      let today = new Date;
      this._journalvoucherService.get(Global.BASE_NEPALIMONTH_ENDPOINT + '?NDate=' + currentdate)
        .subscribe(SB => {
            this.vdate = SB;
            if(this.vdate === "undefined") {
              alert("Please enter the voucher valid date");
            }else{
              let voucherDate = new Date(this.vdate);
              let tomorrow = new Date(today.setDate(today.getDate() + 1));
              let currentYearStartDate = new Date(this.currentYear.StartDate);
              let currentYearEndDate = new Date(this.currentYear.EndDate);

              if ((voucherDate < currentYearStartDate) || (voucherDate > currentYearEndDate) || voucherDate >= tomorrow) {
                alert("Date should be within current financial year's start date and end date inclusive");
              }
              else {
                receipt.get('FinancialYear').setValue(this.currentYear['Name'] || '');
                receipt.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
                receipt.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');
            
                if (receipt.valid) {
                  const control = this.receiptFrm.controls['AccountTransactionValues'].value;
                  const controls = <FormArray>this.receiptFrm.controls['AccountTransactionValues'];
            
                  let accountList = [];
                  control.forEach(account => {
                      let Id = account.AccountId.Id;
                      account.AccountId  = Id;
            
                      accountList.push(account);
                  });
            
            
                  let CurrentAccount = receipt.get('SourceAccountTypeId').value;
                  let currentaccount = this.accountcashbank.find(x => x.Id === CurrentAccount.Id);
                  this.SourceAccountTypeId = currentaccount.Id.toString();
            
                  let receiptObj = {
                      Id: this.receiptFrm.controls['Id'].value,
                      Date: this.receiptFrm.controls['Date'].value,
                      Name: this.receiptFrm.controls['Name'].value,
                      SourceAccountTypeId: this.SourceAccountTypeId,
                      AccountTransactionDocumentId: this.receiptFrm.controls['AccountTransactionDocumentId'].value,
                      Description: this.receiptFrm.controls['Description'].value,
                      FinancialYear: this.receiptFrm.controls['FinancialYear'].value,
                      UserName: this.receiptFrm.controls['UserName'].value,
                      CompanyCode: this.receiptFrm.controls['CompanyCode'].value,
                      // AccountTransactionValues: this.receiptFrm.controls['AccountTransactionValues'].value
                      AccountTransactionValues: accountList
                  }
            
                  switch (this.dbops) {
                      case DBOperation.create:
                          this._journalvoucherService.post(Global.BASE_JOURNALVOUCHER_ENDPOINT, receiptObj).subscribe(
                              async (data) => {
                                  if (data > 0) {
                                      // file upload stuff goes here
                                      let upload = await fileUpload.handleFileUpload({
                                        'moduleName': 'JournalVoucher',
                                        'id': data
                                      });
            
                                      if (upload == 'error' ) {
                                          alert('There is error uploading file!');
                                      } 
                                      
                                      if (upload == true || upload == false) {
                                        this.formSubmitAttempt = false;
                                        this.reset();
                                      }
                                      alert("Data successfully added.");
                                      this.router.navigate(['Account/receipt']);
                                      // this.modalRef.hide();
                                  } else {
                                      alert("There is some issue in saving records, please contact to system administrator!");
                                  }
                              },
                          );
                          break;
                      case DBOperation.update:
                          this._journalvoucherService.put(Global.BASE_JOURNALVOUCHER_ENDPOINT, receipt.value.Id, receiptObj).subscribe(
                              async (data) => {
                                  if (data > 0) {
                                    // file upload stuff goes here
                                    let upload = await fileUpload.handleFileUpload({
                                        'moduleName': 'JournalVoucher',
                                        'id': data
                                    });
            
                                    if (upload == 'error' ) {
                                        alert('There is error uploading file!');
                                    } 
                                    
                                    if (upload == true || upload == false) {
                                        this.formSubmitAttempt = false;
                                        this.reset();
                                    }
                                    alert("Data successfully updated.");
                                    this.router.navigate(['Account/receipt']);
                                    // this.modalRef.hide();
                                  } else {
                                      alert("There is some issue in saving records, please contact to system administrator!");
                                  }
                              },
                          );
                          break;
                      case DBOperation.delete:
                          // let receiptObject= {
                          //     Id: this.receiptFrm.controls['Id'].value,
                          //     Date: this.receiptFrm.controls['Date'].value,
                          //     Name: this.receiptFrm.controls['Name'].value,
                          //     SourceAccountTypeId: this.receiptFrm.controls['SourceAccountTypeId'].value,
                          //     AccountTransactionDocumentId: this.receiptFrm.controls['AccountTransactionDocumentId'].value,
                          //     Description: this.receiptFrm.controls['Description'].value,
                          //     FinancialYear: this.receiptFrm.controls['FinancialYear'].value,
                          //     UserName: this.receiptFrm.controls['UserName'].value,
                          //     CompanyCode: this.receiptFrm.controls['CompanyCode'].value,
                          //     AccountTransactionValues: this.receiptFrm.controls['AccountTransactionValues'].value
                          // }
                          this._journalvoucherService.delete(Global.BASE_JOURNALVOUCHER_ENDPOINT,  receiptObj).subscribe(
                            data => {
                                if (data == 1) //Success
                                {
                                  alert("Data successfully deleted.");
                                }
                                else {
                                  alert("There is some issue in saving records, please contact to system administrator!");
                                }
            
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.reset();
                            },
            
                          );
                  }
                }
                else {
                  this.validateAllFields(receipt);
                }
              }
            }
        },
        error => {
          this.msg = <any>error
        });
    }
  }

  // onSubmit(formData: any, fileUpload: any) {
  //   this.msg = "";
  //   this.formSubmitAttempt = true;
  //   let receipt = this.receiptFrm;

  //   if (!this.voucherDateValidator(receipt.get('Date').value)) {
  //     return false;
  //   }

  //   receipt.get('FinancialYear').setValue(this.currentYear['Name'] || '');
  //   receipt.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
  //   receipt.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');

  //   if (receipt.valid) {
  //     const control = this.receiptFrm.controls['AccountTransactionValues'].value;
  //     const controls = <FormArray>this.receiptFrm.controls['AccountTransactionValues'];

  //     let accountList = [];
  //     control.forEach(account => {
  //         let Id = account.AccountId.Id;
  //         account.AccountId  = Id;

  //         accountList.push(account);
  //     });

  //     // for (var i = 0; i < control.length; i++) {
  //     //     let Id = control[i]['Id'];
  //     //     if (Id > 0) {
  //     //         let CurrentAccount = control[i]['AccountId'];
  //     //         this.currentaccount = this.account.filter(x => x.Name === CurrentAccount)[0];
  //     //         let CurrentAccountId = this.currentaccount.Id;
  //     //         let currentaccountvoucher = control[i];
  //     //         let instance = this.fb.group(currentaccountvoucher);
  //     //         instance.controls["AccountId"].setValue(CurrentAccountId);
  //     //         controls.push(instance);
  //     //     }
  //     //     else {
  //     //         let xcurrentaccountvoucher = control[i]['AccountId'];
  //     //         let currentaccountvoucher = control[i];
  //     //         let instance = this.fb.group(currentaccountvoucher);
  //     //         this.currentaccount = this.account.filter(x => x.Name === xcurrentaccountvoucher.Name)[0];
  //     //         instance.controls["AccountId"].setValue(this.currentaccount.Id.toString());
  //     //         controls.push(instance);
  //     //     }
  //     // }

  //     let CurrentAccount = receipt.get('SourceAccountTypeId').value;
  //     let currentaccount = this.accountcashbank.find(x => x.Id === CurrentAccount.Id);
  //     this.SourceAccountTypeId = currentaccount.Id.toString();

  //     // let Id = receipt.get('Id').value;
  //     // if (Id > 0) {
  //     //     let CurrentAccount = receipt.get('SourceAccountTypeId').value;
  //     //     this.currentaccount = this.accountcashbank.filter(x => x.Name === CurrentAccount)[0];
  //     //     this.SourceAccountTypeId = this.currentaccount.Id.toString();
  //     //     receipt.get('SourceAccountTypeId').setValue(this.SourceAccountTypeId);
  //     // }
  //     // else {
  //     //     let CurrentAccount = receipt.get('SourceAccountTypeId').value;
  //     //     this.SourceAccountTypeId = CurrentAccount.Id;
  //     //     receipt.get('SourceAccountTypeId').setValue(this.SourceAccountTypeId);
  //     // }

  //     let receiptObj = {
  //         Id: this.receiptFrm.controls['Id'].value,
  //         Date: this.receiptFrm.controls['Date'].value,
  //         Name: this.receiptFrm.controls['Name'].value,
  //         SourceAccountTypeId: this.SourceAccountTypeId,
  //         AccountTransactionDocumentId: this.receiptFrm.controls['AccountTransactionDocumentId'].value,
  //         Description: this.receiptFrm.controls['Description'].value,
  //         FinancialYear: this.receiptFrm.controls['FinancialYear'].value,
  //         UserName: this.receiptFrm.controls['UserName'].value,
  //         CompanyCode: this.receiptFrm.controls['CompanyCode'].value,
  //         // AccountTransactionValues: this.receiptFrm.controls['AccountTransactionValues'].value
  //         AccountTransactionValues: accountList
  //     }

  //     switch (this.dbops) {
  //         case DBOperation.create:
  //             this._journalvoucherService.post(Global.BASE_JOURNALVOUCHER_ENDPOINT, receiptObj).subscribe(
  //                 async (data) => {
  //                     if (data > 0) {
  //                         // file upload stuff goes here
  //                         let upload = await fileUpload.handleFileUpload({
  //                           'moduleName': 'JournalVoucher',
  //                           'id': data
  //                         });

  //                         if (upload == 'error' ) {
  //                             alert('There is error uploading file!');
  //                         } 
                          
  //                         if (upload == true || upload == false) {
  //                           this.formSubmitAttempt = false;
  //                           this.reset();
  //                         }
  //                         alert("Data successfully added.");
  //                         this.router.navigate(['Account/receipt']);
  //                         // this.modalRef.hide();
  //                     } else {
  //                         alert("There is some issue in saving records, please contact to system administrator!");
  //                     }
  //                 },
  //             );
  //             break;
  //         case DBOperation.update:
  //             this._journalvoucherService.put(Global.BASE_JOURNALVOUCHER_ENDPOINT, receipt.value.Id, receiptObj).subscribe(
  //                 async (data) => {
  //                     if (data > 0) {
  //                       // file upload stuff goes here
  //                       let upload = await fileUpload.handleFileUpload({
  //                           'moduleName': 'JournalVoucher',
  //                           'id': data
  //                       });

  //                       if (upload == 'error' ) {
  //                           alert('There is error uploading file!');
  //                       } 
                        
  //                       if (upload == true || upload == false) {
  //                           this.formSubmitAttempt = false;
  //                           this.reset();
  //                       }
  //                       alert("Data successfully updated.");
  //                       this.router.navigate(['Account/receipt']);
  //                       // this.modalRef.hide();
  //                     } else {
  //                         alert("There is some issue in saving records, please contact to system administrator!");
  //                     }
  //                 },
  //             );
  //             break;
  //         case DBOperation.delete:
  //             // let receiptObject= {
  //             //     Id: this.receiptFrm.controls['Id'].value,
  //             //     Date: this.receiptFrm.controls['Date'].value,
  //             //     Name: this.receiptFrm.controls['Name'].value,
  //             //     SourceAccountTypeId: this.receiptFrm.controls['SourceAccountTypeId'].value,
  //             //     AccountTransactionDocumentId: this.receiptFrm.controls['AccountTransactionDocumentId'].value,
  //             //     Description: this.receiptFrm.controls['Description'].value,
  //             //     FinancialYear: this.receiptFrm.controls['FinancialYear'].value,
  //             //     UserName: this.receiptFrm.controls['UserName'].value,
  //             //     CompanyCode: this.receiptFrm.controls['CompanyCode'].value,
  //             //     AccountTransactionValues: this.receiptFrm.controls['AccountTransactionValues'].value
  //             // }
  //             this._journalvoucherService.delete(Global.BASE_JOURNALVOUCHER_ENDPOINT,  receiptObj).subscribe(
  //               data => {
  //                   if (data == 1) //Success
  //                   {
  //                     alert("Data successfully deleted.");
  //                   }
  //                   else {
  //                     alert("There is some issue in saving records, please contact to system administrator!");
  //                   }

  //                   this.modalRef.hide();
  //                   this.formSubmitAttempt = false;
  //                   this.reset();
  //               },

  //             );
  //     }
  //   }

  //   else {
  //       this.validateAllFields(receipt);
  //   }
  // }

  confirm(): void {
    this.modalRef2.hide();
    this.formSubmitAttempt = false;
  }

  reset() {
    this.receiptFrm.controls['AccountTransactionDocumentId'].reset();
    this.receiptFrm.controls['Date'].reset();
    this.receiptFrm.controls['SourceAccountTypeId'].reset();
    this.receiptFrm.controls['AccountTransactionValues'] = this.fb.array([]);
    this.addAccountValues();
  }

  SetControlsState(isEnable: boolean) {
    isEnable ? this.receiptFrm.enable() : this.receiptFrm.disable();
  }

  onFilterDateSelect (selectedDate) {
    let currentYearStartDate = new Date(this.currentYear.StartDate);
    let currentYearEndDate = new Date(this.currentYear.EndDate);

    if (selectedDate < currentYearStartDate) {
        this.fromDate = currentYearStartDate;
        alert("Date should not be less than current financial year's start date");
    }

    if (selectedDate > currentYearEndDate) {
        this.toDate = currentYearEndDate;
        alert("Date should not be greater than current financial year's end date");
    }
  }
  searchChange($event) {
    console.log($event);
  }
  searchChangeAccountId($event) {
    console.log($event);
  }
  config = {
    displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 1000,
    height: '200px'
  };

  configAccount = {
    displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 1000,
    height: '200px'
  };

  nepaliDateValidator(control: FormControl) {
    let nepaliDate = control.value;
    let pattern = new RegExp(/(^[0-9]{4})\.([0-9]{2})\.([0-9]{2})/g);
    let isValid = pattern.test(nepaliDate);
    if (!isValid) {
        return {
            InvaliDate: 'The date is not valid'
        }
    }
    return null;
  }
  nepaliDateStringValidator(control: string) {
    let pattern = new RegExp(/(^[0-9]{4})\.([0-9]{2})\.([0-9]{2})/g);
    let isValid = pattern.test(control);
    if (!isValid) {
        return false;
    }
    else {
        return true;
    }
  }

  cancel() {
    this.reset();
    this.router.navigate(['Account/receipt'])
  }


  back() {
    this._location.back();
  }
}
