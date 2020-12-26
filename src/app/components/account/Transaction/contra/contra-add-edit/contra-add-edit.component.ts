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
  selector: 'app-contra-add-edit',
  templateUrl: './contra-add-edit.component.html',
  styleUrls: ['./contra-add-edit.component.css']
})

export class ContraAddEditComponent implements OnInit{
  @ViewChild('template') TemplateRef: TemplateRef<any>;
  @ViewChild('templateNested') TemplateRef2: TemplateRef<any>;
  @ViewChild('fileInput') fileInput: ElementRef;

  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  paymentList: AccountTrans[];
  paymentLists: AccountTrans;
  dbops: DBOperation;
  msg: string;
  public vdate: string;
  public currentvdate: string;
  modalTitle: string;
  modalBtnTitle: string;
  indLoading: boolean = false;
  formattedDate: any;
  public buttonDisabled: boolean;
  public formSubmitAttempt: boolean;
  public account: Account[] = [];
  public contraForm: FormGroup;
  dropMessage: string = "Upload Reference File";
  uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
  fileUrl: string = '';

  public SourceAccountTypeId: string;
  public currentaccount: Account;
  public fromDate: any;
  public toDate: any;
  public sfromDate: string;
  public stoDate: string;
  public currentYear: any = {};
  public currentUser: any = {};
  public company: any = {};

  toExportFileName: string = 'Bank-Cash Report -' + this.date.transform(new Date, "yyyy-MM-dd") + '.xlsx';
  toPdfFileName: string = 'Bank-Cash Report -' + this.date.transform(new Date, "yyyy-MM-dd") + '.pdf';

  mode : any;
  id : any;

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
   * Overrides the ngOnInit
   */
  ngOnInit(): void {
      this.contraForm = this.fb.group({
          Id: [''],
          Name: [''],
          AccountTransactionDocumentId: [''],
          Description: [''],
          Amount: [''],
          Date: ['', Validators.compose([Validators.required, this.nepaliDateValidator])],
          drTotal: [''],
          crTotal: [''],
          SourceAccountTypeId: [''],
          AccountTransactionValues: this.fb.array([this.initAccountValue()]),
          FinancialYear: [''],
          UserName: [''],
          CompanyCode: ['']
      });
      // this.loadContraList(this.fromDate, this.toDate);

      this.indLoading = true;
      this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT')
        .subscribe(at => {
          this.account = at;
          if(this.account) {
            this.route.params.subscribe(params => {
              this.mode = params['mode'];
                if(this.mode == 'add') {
                  this.addPayment();
                }else{
                  this.id = params['id'];
                  this.editPayment(this.id);
                }
            });
          }
        },
        error => this.msg = <any>error);
  }

  viewFile(fileUrl, template: TemplateRef<any>) {
      this.fileUrl = fileUrl;
      this.modalTitle = "View Attachment";
      this.modalRef = this.modalService.show(template, { keyboard: false, class: 'modal-lg' });
  }

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

      if ((voucherDate < currentYearStartDate) || (voucherDate > currentYearEndDate) || voucherDate >= tomorrow ) {
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
   * Load Contra List
   */
  loadContraList(sfromdate: string, stodate: string) {
      this.indLoading = true;
      if (sfromdate == "undefined" || sfromdate == null) {
          alert("Enter Start Date");
          return false;
      }
      if (stodate == "undefined" || stodate == null) {
          alert("Enter End Date");
          return false;
      }
      if (this.nepaliDateStringValidator(stodate) === false) {
          alert("Enter Valid End Date");
          return false;
      }
      if (this.nepaliDateStringValidator(sfromdate) === false) {
          alert("Enter Valid Start Date");
          return false;
      }

      this.fromDate = sfromdate;
      this.toDate = stodate;
      this.sfromDate = sfromdate;
      this.stoDate = stodate;

      this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT')
          .subscribe(at => {
              this.account = at;
          },
              error => this.msg = <any>error);

      this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?fromDate=' + this.fromDate + '&toDate=' + this.toDate + '&TransactionTypeId=' + 13)
          .subscribe(
          paymentList => {
              paymentList.map((pay) => pay['File'] = Global.BASE_HOST_ENDPOINT + Global.BASE_FILE_UPLOAD_ENDPOINT + '?Id=' + pay.Id + '&ApplicationModule=JournalVoucher');
              this.paymentList = paymentList;
              this.indLoading = false;
          },
          error => this.msg = <any>error);
  }

  /**
   * Add Payment
   */
  addPayment() {
      this.dbops = DBOperation.create;
      this.SetControlsState(true);
      this.modalTitle = "Add Cash/Bank";
      this.modalBtnTitle = "Save";
      this.reset();
      this.contraForm.controls['Name'].setValue('Contra');
      this.indLoading = false;
      // this.modalRef = this.modalService.show(this.TemplateRef, {
      //     backdrop: 'static',
      //     keyboard: false,
      //     class: 'modal-lg'
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
   * Edit the contra
   * @param Id 
   */
  editPayment(Id: number) {
      this.reset();
      this.dbops = DBOperation.update;
      this.SetControlsState(true);
      this.modalTitle = "Edit Cash/Bank";
      this.modalBtnTitle = "Save";
      this.getJournalVoucher(Id)
          .subscribe((contra: AccountTrans) => {
              // console.log('the contra is', contra)
              if(contra.Id == 0) {
                this.toastrService.info('No record found!');
                this.router.navigate(['Account/contra']);
              }
              this.indLoading = false;
              this.contraForm.controls['Id'].setValue(contra.Id);
              this.contraForm.controls['Name'].setValue(contra.Name);
              this.contraForm.controls['AccountTransactionDocumentId'].setValue(contra.AccountTransactionDocumentId);
              this.currentaccount = this.account.filter(x => x.Id === contra.SourceAccountTypeId)[0];
              if (this.currentaccount!== undefined) {
                  this.contraForm.controls['SourceAccountTypeId'].setValue(this.currentaccount);
              }
              this.contraForm.controls['Description'].setValue(contra.Description);
              this.contraForm.controls['Date'].setValue(contra.AccountTransactionValues[0]['NVDate']);

              this.contraForm.controls['AccountTransactionValues'] = this.fb.array([]);
              const control = <FormArray>this.contraForm.controls['AccountTransactionValues'];


              for (var i = 0; i < contra.AccountTransactionValues.length; i++) {
                  const account = this.account.find(x => x.Id === contra.AccountTransactionValues[i].AccountId);
                  let currentaccountvoucher = contra.AccountTransactionValues[i];
                  let instance = this.fb.group(currentaccountvoucher);
                  instance.controls["AccountId"].setValue(account);
                  instance.controls["Debit"].setValue(contra.AccountTransactionValues[i].Debit);
                  instance.controls["Credit"].setValue(contra.AccountTransactionValues[i].Credit);
                  instance.controls["Description"].setValue(contra.AccountTransactionValues[i].Description);

                  control.push(instance);
              }




              // for (var i = 0; i < contra.AccountTransactionValues.length; i++) {
              //     this.currentaccount = this.account.filter(x => x.Id === contra.AccountTransactionValues[i]["AccountId"])[0];
              //     if (this.currentaccount !== undefined) {
              //         let currentaccountvoucher = contra.AccountTransactionValues[i];
              //         let instance = this.fb.group(currentaccountvoucher);
              //         instance.controls["AccountId"].setValue(this.currentaccount.Name);
              //         control.push(instance);
              //     }
              // }
              // this.modalRef = this.modalService.show(this.TemplateRef, {
              //     backdrop: 'static',
              //     keyboard: false,
              //     class: 'modal-lg'
              // });
          },
          error => this.msg = <any>error);
  }

  /**
   *  Deletes the given contra
   * @param Id 
   */
  deletePayment(Id: number) {
      this.dbops = DBOperation.delete;
      this.SetControlsState(true);
      this.modalTitle = "Delete Cash/Bank";
      this.modalBtnTitle = "Delete";
      this.getJournalVoucher(Id)
          .subscribe((contra: AccountTrans) => {
              this.indLoading = false;
              this.contraForm.controls['Id'].setValue(contra.Id);
              this.contraForm.controls['Name'].setValue(contra.Name);
              this.contraForm.controls['AccountTransactionDocumentId'].setValue(contra.AccountTransactionDocumentId);
              this.currentaccount = this.account.filter(x => x.Id === contra.SourceAccountTypeId)[0];
              if (this.currentaccount !== undefined) {
                  this.contraForm.controls['SourceAccountTypeId'].setValue(this.currentaccount);
              }
              this.contraForm.controls['Description'].setValue(contra.Description);
              this.contraForm.controls['Date'].setValue(contra.AccountTransactionValues[0]['NVDate']);

              this.contraForm.controls['AccountTransactionValues'] = this.fb.array([]);
              const control = <FormArray>this.contraForm.controls['AccountTransactionValues'];


              for (var i = 0; i < contra.AccountTransactionValues.length; i++) {
                  const account = this.account.find(x => x.Id === contra.AccountTransactionValues[i].AccountId);
                  let currentaccountvoucher = contra.AccountTransactionValues[i];
                  let instance = this.fb.group(currentaccountvoucher);
                  instance.controls["AccountId"].setValue(account);
                  instance.controls["Debit"].setValue(contra.AccountTransactionValues[i].Debit);
                  instance.controls["Credit"].setValue(contra.AccountTransactionValues[i].Credit);
                  instance.controls["Description"].setValue(contra.AccountTransactionValues[i].Description);

                  control.push(instance);
              }


              // for (var i = 0; i < contra.AccountTransactionValues.length; i++) {
              //     this.currentaccount = this.account.filter(x => x.Id === contra.AccountTransactionValues[i]["AccountId"])[0];
              //     if (this.currentaccount !== undefined) {
              //         let currentaccountvoucher = contra.AccountTransactionValues[i];
              //         let instance = this.fb.group(currentaccountvoucher);
              //         instance.controls["AccountId"].setValue(this.currentaccount.Name);
              //         control.push(instance);
              //     }
              // }
              // this.modalRef = this.modalService.show(this.TemplateRef, {
              //     backdrop: 'static',
              //     keyboard: false,
              //     class: 'modal-lg'
              // });
          },
          error => this.msg = <any>error);
  }

  /**
   * Initialises the account values
   */
  initAccountValue() {
      //initialize our vouchers
      return this.fb.group({
          AccountId: ['', Validators.required],
          Debit: ['', Validators.required],
          Credit: [''],
          Description: ['']
      });
  }

  //Push the Account Values in row//
  addAccountValues() {
      const control = <FormArray>this.contraForm.controls['AccountTransactionValues'];
      const addPayment = this.initAccountValue();
      control.push(addPayment);
  }

  //remove the rows//
  removeAccount(i: number) {
      let controls = <FormArray>this.contraForm.controls['AccountTransactionValues'];
      let controlToRemove = this.contraForm.controls.AccountTransactionValues['controls'][i].controls;
      let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

      // let currentaccountid = controlToRemove.Id.value;
      let currentaccountid = controlToRemove.Id?.value ? controlToRemove.Id.value : 0;

      if (currentaccountid != "0") {
          this._accountTransValues.delete(Global.BASE_JOURNAL_ENDPOINT, currentaccountid).subscribe(data => {
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

  //Calculate the sum of debit columns//
  sumDebit() {
      let controls = this.contraForm.controls.AccountTransactionValues.value;

      return controls.reduce(function (total: any, accounts: any) {

          return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
      }, 0);
  }

  //Calculate the sum of credit columns//
  sumCredit() {
      let controls = this.contraForm.controls.AccountTransactionValues.value;

      return controls.reduce(function (total: any, accounts: any) {

          return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
      }, 0);
  }

  /**
   * Validates the fields
   * @param formGroup 
   */
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

  //Submits the form//
  onSubmit(formData: any, fileUpload: any) {
      this.msg = "";
      let contra = this.contraForm;
      this.formSubmitAttempt = true;

      if (!this.voucherDateValidator(contra.get('Date').value)) {
          return false;
      }

      contra.get('FinancialYear').setValue(this.currentYear['Name'] || '');
      contra.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
      contra.get('CompanyCode').setValue(this.currentUser && this.company['BranchCode'] || '');

      if (contra.valid) {
          const control = this.contraForm.controls['AccountTransactionValues'].value;
          const controls = <FormArray>this.contraForm.controls['AccountTransactionValues'];

          let accountList = [];
          control.forEach(account => {
              let Id = account.AccountId.Id;
              account.AccountId  = Id;

              accountList.push(account);
          });
          // for (var i = 0; i < control.length; i++) {
          //     let Id = control[i]['Id'];
          //     if (Id > 0) {
          //         let CurrentAccount = control[i]['AccountId'];
          //         this.currentaccount = this.account.filter(x => x.Name === CurrentAccount)[0];
          //         let CurrentAccountId = this.currentaccount.Id;
          //         let currentaccountvoucher = control[i];
          //         let instance = this.fb.group(currentaccountvoucher);
          //         instance.controls["AccountId"].setValue(CurrentAccountId);
          //         controls.push(instance);
          //     }
          //     else {
          //         let xcurrentaccountvoucher = control[i]['AccountId'];
          //         let currentaccountvoucher = control[i];
          //         let instance = this.fb.group(currentaccountvoucher);
          //         this.currentaccount = this.account.filter(x => x.Name === xcurrentaccountvoucher.Name)[0];
          //         instance.controls["AccountId"].setValue(this.currentaccount.Id.toString());
          //         controls.push(instance);
          //     }
          // }


          let CurrentAccount = contra.get('SourceAccountTypeId').value;
          let currentaccount = this.account.find(x => x.Id === CurrentAccount.Id);
          this.SourceAccountTypeId = currentaccount.Id.toString();

          // let Id = contra.get('Id').value;
          // if (Id > 0) {
          //     let CurrentAccount = contra.get('SourceAccountTypeId').value;
          //     this.currentaccount = this.account.filter(x => x.Name === CurrentAccount)[0];
          //     this.SourceAccountTypeId = this.currentaccount.Id.toString();
          //     contra.get('SourceAccountTypeId').setValue(this.SourceAccountTypeId);
          // }
          // else {
          //     let CurrentAccount = contra.get('SourceAccountTypeId').value;
          //     this.SourceAccountTypeId = CurrentAccount.Id;
          //     contra.get('SourceAccountTypeId').setValue(this.SourceAccountTypeId);
          // }

          let paymentObject = {
              Id: this.contraForm.controls['Id'].value,
              Date: this.contraForm.controls['Date'].value,
              Name: this.contraForm.controls['Name'].value,
              SourceAccountTypeId: this.SourceAccountTypeId,
              AccountTransactionDocumentId: this.contraForm.controls['AccountTransactionDocumentId'].value,
              Description: this.contraForm.controls['Description'].value,
              FinancialYear: this.contraForm.controls['FinancialYear'].value,
              UserName: this.contraForm.controls['UserName'].value,
              CompanyCode: this.contraForm.controls['CompanyCode'].value,
              // AccountTransactionValues: <FormArray>this.contraForm.controls['AccountTransactionValues'].value
              AccountTransactionValues: accountList
              
          }

          console.log('the payment ', paymentObject)
          switch (this.dbops) {
              case DBOperation.create:
                  this._journalvoucherService.post(Global.BASE_JOURNALVOUCHER_ENDPOINT, paymentObject).subscribe(
                      async (data) => {
                          if (data > 0) {
                              await fileUpload.handleFileUpload({
                                  'moduleName': 'JournalVoucher',
                                  'id': data
                              });
                              alert("Data successfully added.");
                              // this.loadContraList(this.fromDate, this.toDate);
                              // this.modalRef.hide();
                              this.formSubmitAttempt = false;
                              this.router.navigate(['Account/contra'])

                          } else {
                              alert("There is some issue in saving records, please contact to system administrator!");
                          }
                      }
                  );
                  break;
              case DBOperation.update:
                  this._journalvoucherService.put(Global.BASE_JOURNALVOUCHER_ENDPOINT, contra.value.Id, paymentObject).subscribe(
                      async (data) => {
                          if (data > 0) {
                              // file upload stuff goes here
                              await fileUpload.handleFileUpload({
                                  'moduleName': 'JournalVoucher',
                                  'id': data
                              });
                              alert("Data successfully updated.");
                              // this.loadContraList(this.fromDate, this.toDate);
                              // this.modalRef.hide();
                              this.formSubmitAttempt = false;
                              this.router.navigate(['Account/contra'])
                          } else {
                              alert("There is some issue in saving records, please contact to system administrator!");
                          }
                      },
                  );
                  break;
              case DBOperation.delete:
                  this._journalvoucherService.delete(Global.BASE_JOURNALVOUCHER_ENDPOINT, paymentObject).subscribe(
                      data => {
                          if (data == 1) //Success
                          {
                              alert("Data successfully deleted.");
                              this.loadContraList(this.fromDate, this.toDate);
                          }
                          else {
                              alert("There is some issue in saving records, please contact to system administrator!");
                          }
                          // this.modalRef.hide();
                          // this.formSubmitAttempt = false;
                          this.reset();
                          this.router.navigate(['Account/contra'])
                      },

                  );
          }
      }
      else {
          this.validateAllFields(contra);
      }
  }

  confirm(): void {
      this.modalRef2.hide();
      this.formSubmitAttempt = false;
  }

  reset() {
      this.contraForm.controls['AccountTransactionDocumentId'].reset();
      this.contraForm.controls['Date'].reset();
      this.contraForm.controls['Description'].reset();
      this.contraForm.controls['SourceAccountTypeId'].reset();
      this.contraForm.controls['AccountTransactionValues'] = this.fb.array([]);
      this.addAccountValues();
  }

  SetControlsState(isEnable: boolean) {
      isEnable ? this.contraForm.enable() : this.contraForm.disable();
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
  onFilterDateSelect(selectedDate) {
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
  onBlurVoucherDateValidation(currentdate) {
      alert(currentdate);
  } 

  cancel() {
    this.reset();
    this.router.navigate(['Account/contra'])
  }


  back() {
    this._location.back();
  }
}
