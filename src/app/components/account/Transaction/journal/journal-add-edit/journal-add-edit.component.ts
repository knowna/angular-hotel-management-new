import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { JournalVoucherService } from 'src/app/Service/journalVoucher.service';
import { AccountTransValuesService } from 'src/app/Service/accountTransValues.service';
import { DatePipe, Location } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FileService } from 'src/app/Service/file.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { EntityMock, Account } from 'src/app/Model/Account/account';
import { Observable } from 'rxjs';
import { Global } from 'src/app/Shared/global';
import { DBOperation } from 'src/app/Shared/enum';
import { AccountTrans } from 'src/app/Model/AccountTransaction/accountTrans';
import { DateFormatter } from 'angular-nepali-datepicker';

// Accessing global variable
type CSV = any[][];
declare var $: any;

@Component({
  selector: 'app-journal-add-edit',
  templateUrl: './journal-add-edit.component.html',
  styleUrls: ['./journal-add-edit.component.css']
})
export class JournalAddEditComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  dropMessage: string = "Upload Reference File";
  uploadUrl = Global.BASE_FILE_UPLOAD_ENDPOINT;
  fileUrl: string = '';
  
  public journalFrm: FormGroup;
  public account: Observable<Account>;
  public formSubmitAttempt: boolean;
  public buttonDisabled: boolean;
  public entityLists: EntityMock[];
  public fromDate: any;
  public toDate: any;
  public sfromDate: string;
  public stoDate: string;
  public currentYear: any = {};
  public currentUser: any = {};
  public company: any = {};
  dbops: DBOperation;

  public SourceAccountTypeId: string;
  public currentaccount: Account;
  public vdate: string;

  indLoading: boolean = false;

  mode: any;
  id : any;
  msg = '';

  modalTitle = '';

  modalBtnTitle = '';

  public voucherDateNepali: any;
  
  voucherDateFormatter: DateFormatter = (voucherDateNepali) => {
    console.log('the vouccc',voucherDateNepali )
    return `${ voucherDateNepali.year }.${ (voucherDateNepali.month*1 + 1) }.${ (voucherDateNepali.day) }`;
  }

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
    public datepipe: DatePipe,
    private _location: Location
  ) {
    this.currentYear = JSON.parse(localStorage.getItem('currentYear'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.company = JSON.parse(localStorage.getItem('company'));
    this.fromDate = this.currentYear['NepaliStartDate'];
    this.toDate = this.currentYear['NepaliEndDate'];
    this.entityLists = [
        { id: 0, name: 'Dr' },
        { id: 1, name: 'Cr' }
    ];
  }

  ngOnInit(): void {
    // Initialize reactive form 
    this.journalFrm = this.fb.group({
      Id: [''],
      Name: ['',],
      AccountTransactionDocumentId: [''],
      Description: [''],
      Amount: [''],
      Date: [''],
      drTotal: [''],
      crTotal: [''],
      AccountTransactionValues: this.fb.array([this.initAccountValue()]),
      FinancialYear: [''],
      UserName: [''],
      CompanyCode: ['']
    });

    // Load list of journal vouchers
    // this.loadAccounts();
    this.indLoading = true;
    this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT&AccountGeneral=AG')
      .subscribe(at => {
        this.account = at;
        this.route.params.subscribe(params => {
          this.mode = params['mode'];
          if(this.mode == 'add') {
            this.addJournalVoucher();
          }else{
            this.id = params['id'];
            this.editJournalVoucher(this.id);
          }
          console.log(params['mode']) //log the value of id
        });
      },
      error => this.msg = <any>error);
    
    // this.route.params.subscribe(params => {
    //   this.mode = params['mode'];
    //   if(this.mode == 'add') {
    //     this.addJournalVoucher();
    //   }else{
    //     this.id = params['id'];
    //     this.editJournalVoucher(this.id);
    //   }
    //   console.log(params['mode']) //log the value of id
    // });
  }
  

  /**
   * Load list of journal vouchers form the server
   */
  loadAccounts() {
    this._journalvoucherService.get(Global.BASE_ACCOUNT_ENDPOINT + '?AccountTypeId=AT&AccountGeneral=AG')
      .subscribe(at => {
          this.account = at;
      },
      error => this.msg = <any>error);
  }

  /**
   * Initializes Account values 
   */
  initAccountValue() {
    //initialize our vouchers
    return this.fb.group({
        entityLists: ['', Validators.required],
        AccountId: ['', Validators.required],
        Debit: ['', Validators.required],
        Credit: ['', Validators.required],
        Description: ['']
    });
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

  /**
   * Open Add New Journal Voucher Form Modal
   */
  addJournalVoucher() {
    this.dbops = DBOperation.create;
    this.SetControlsState(true);
    this.modalTitle = "Add Journal";
    this.modalBtnTitle = "Save";
    this.reset();
    this.journalFrm.controls['Name'].setValue("Journal");
    this.indLoading = false;
    console.log('currentYear', this.currentYear)
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
    this.indLoading = true;
    return this._journalvoucherService.get(Global.BASE_JOURNALVOUCHER_ENDPOINT + '?TransactionId=' + Id);
  }
  /**
 * Opens Edit Existing Journal Voucher Form Modal
 * @param Id {String} Voucher Id
 */ 
  editJournalVoucher(Id: number) {
    this.dbops = DBOperation.update;
    this.SetControlsState(true);
    this.modalTitle = "Edit Journal";
    this.modalBtnTitle = "Save";
    this.reset();
    this.getJournalVoucher(Id)
      .subscribe((journalVoucher: AccountTrans) => {
        if(journalVoucher.Id == 0) {
          this.toastrService.info('No record found!');
          this.router.navigate(['Account/journalVoucher']);
        }

        this.indLoading = false;
        let vocuherDateDetails = (journalVoucher.AccountTransactionValues[0]['NVDate']).split(".");
        this.voucherDateNepali = { 
          "year": vocuherDateDetails[0]*1, 
          "month": (vocuherDateDetails[1] *1 - 1), 
          "day": vocuherDateDetails[2]*1 
        }
        this.journalFrm.controls['Id'].setValue(journalVoucher.Id);
        // this.journalFrm.controls['Name'].setValue(journalVoucher.Name);
        this.journalFrm.controls['Name'].setValue(journalVoucher.Name);
        this.journalFrm.controls['Date'].setValue(journalVoucher.AccountTransactionValues[0]['NVDate']);
        this.journalFrm.controls['AccountTransactionDocumentId'].setValue(journalVoucher.AccountTransactionDocumentId);
        this.journalFrm.controls['Description'].setValue(journalVoucher.Description);
        this.journalFrm.controls['Amount'].setValue(journalVoucher.Amount);
        this.journalFrm.controls['drTotal'].setValue(journalVoucher.drTotal);
        this.journalFrm.controls['crTotal'].setValue(journalVoucher.crTotal);
        this.journalFrm.controls['AccountTransactionValues'] = this.fb.array([]);
        const control = <FormArray>this.journalFrm.controls['AccountTransactionValues'];

        for (let i = 0; i < journalVoucher.AccountTransactionValues.length; i++) {
            // this.currentaccount = this.account.filter(x => x.Id === journalVoucher.AccountTransactionValues[i]["AccountId"])[0];
            const account = this.account.find(x => x.Id === journalVoucher.AccountTransactionValues[i].AccountId);
            let valuesFromServer = journalVoucher.AccountTransactionValues[i];
            let instance = this.fb.group(valuesFromServer);
            console.log('accountis', account);
            // if (this.currentaccount !== undefined) {
                // instance.controls["AccountId"].setValue(this.currentaccount.Name);
                instance.controls["AccountId"].setValue(account);
            // }

            if (valuesFromServer['entityLists'] === "Dr") {
                instance.controls['Credit'].disable();
            }

            if (valuesFromServer['entityLists'] === "Cr") {
                instance.controls['Debit'].disable();
            }

            instance.controls["Debit"].setValue(journalVoucher.AccountTransactionValues[i].Debit);
            instance.controls["Credit"].setValue(journalVoucher.AccountTransactionValues[i].Credit);
            instance.controls["Description"].setValue(journalVoucher.AccountTransactionValues[i].Description);

            control.push(instance);
        }
      },
      error => this.msg = <any>error);
  }

  /**
   * Sets control's state
   * @param isEnable 
   */
  SetControlsState(isEnable: boolean) {
    isEnable ? this.journalFrm.enable() : this.journalFrm.disable();
  }

  /**
   * Enable or Disable the form fields
   * @param data 
   */
  enableDisable(data: any) {
    if (data.entityLists.value == 'Dr') {
      data.Debit.enable();
      data.Credit.disable();
      data.Credit.reset();
    } else if (data.entityLists.value == 'Cr') {
      data.Credit.enable();
      data.Debit.disable();
      data.Debit.reset();
    } else {
      data.Debit.enable();
      data.Credit.enable();
    }
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

    // console.log('the current date is', currentdate);
    // console.log('the voucher date', voucherDate)
    // console.log('the tomorrow date is', tomorrow);
    // console.log('the current year start date', currentYearStartDate);
    // console.log('the end year dateis', currentYearEndDate);

    // let voucherDateConverted = this. datepipe. transform(voucherDate, 'yyyy-MM-dd');
    // let currentYearStartDateConverted = this. datepipe. transform(currentYearStartDate, 'yyyy-MM-dd');
    // let currentYearEndDateConverted = this. datepipe. transform(currentYearEndDate, 'yyyy-MM-dd');
    // let tomorrowConverted = this. datepipe. transform(tomorrow, 'yyyy-MM-dd');

    if ((voucherDate < currentYearStartDate) || (voucherDate > currentYearEndDate) || voucherDate >= tomorrow) {
      alert("Date should be within current financial year's start date and end date inclusive");
      return false;
    }
    else {
        return true;
    }
    
  }


  onSubmit(formData: any, fileUpload: any) {
    // this.msg = "";
    let journal = this.journalFrm;
    console.log('the jounra', this.journalFrm)

    this.formSubmitAttempt = true;
    let voucherDateNepali = this.voucherDateNepali.year + '.' + (this.voucherDateNepali.month*1 + 1) + '.' + this.voucherDateNepali.day;

    if (!this.voucherDateValidator(voucherDateNepali)) {
        return false;
    }

    journal.get('FinancialYear').setValue(this.currentYear['Name'] || '');
    journal.get('UserName').setValue(this.currentUser && this.currentUser['UserName'] || '');
    journal.get('CompanyCode').setValue(this.company && this.company['BranchCode'] || '');

    journal.get('Date').setValue(voucherDateNepali);

    if (journal.valid) {
        let totalDebit = this.sumDebit();
        let totalCredit = this.sumCredit();

        if (totalDebit != totalCredit || totalDebit == 0 || totalCredit == 0) {
            alert("Debit and Credit are not Equal | Value must be greater than Amount Zero.");
            return;
        }
        const control = this.journalFrm.controls['AccountTransactionValues'].value;
        const controls = <FormArray>this.journalFrm.controls['AccountTransactionValues'];

        let accountList = [];
        control.forEach(account => {
            let Id = account.AccountId.Id;
            account.AccountId  = Id;

            accountList.push(account);
        });
        console.log('the list of the details are', accountList);
       
        let JournalObject = {
            Id: this.journalFrm.controls['Id'].value,
            Date: this.journalFrm.controls['Date'].value,
            Name: this.journalFrm.controls['Name'].value,
            AccountTransactionDocumentId: this.journalFrm.controls['AccountTransactionDocumentId'].value,
            Description: this.journalFrm.controls['Description'].value,
            Amount: this.journalFrm.controls['Amount'].value,
            drTotal: this.journalFrm.controls['drTotal'].value,
            crTotal: this.journalFrm.controls['crTotal'].value,
            FinancialYear: this.journalFrm.controls['FinancialYear'].value,
            UserName: this.journalFrm.controls['UserName'].value,
            CompanyCode: this.journalFrm.controls['CompanyCode'].value,
            // AccountTransactionValues: this.journalFrm.controls['AccountTransactionValues'].value
            AccountTransactionValues: accountList
        }
        switch (this.dbops) {
            case DBOperation.create:
                this._journalvoucherService.post(Global.BASE_JOURNALVOUCHER_ENDPOINT, JournalObject)
                    .subscribe(
                        async (data) => {
                            if (data > 0) {
                                // file upload stuff goes here
                                let upload = await fileUpload.handleFileUpload({
                                    'moduleName': 'JournalVoucher',
                                    'id': data
                                });

                                if (upload == 'error') {
                                    alert('There is error uploading file!');
                                }

                                if (upload == true || upload == false) {
                                    // this.modalRef.hide();
                                    this.formSubmitAttempt = false;
                                    this.reset();
                                }
                                alert('Data saved successfully!');
                                this.router.navigate(['Account/journalVoucher']);
                                // this.modalRef.hide();
                                // this.loadJournalVoucherList(this.fromDate, this.toDate);
                            } else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        });
                break;
            case DBOperation.update:
                this._journalvoucherService.put(Global.BASE_JOURNALVOUCHER_ENDPOINT, journal.value.Id, JournalObject).subscribe(
                    async (data) => {
                        if (data > 0) {
                            // file upload stuff goes here
                            let upload = await fileUpload.handleFileUpload({
                                'moduleName': 'JournalVoucher',
                                'id': data
                            });

                            if (upload == 'error') {
                                alert('There is error uploading file!');
                            }

                            if (upload == true || upload == false) {
                                // this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                // this.reset();
                            }
                            alert('Data updated successfully!');
                            this.router.navigate(['Account/journalVoucher']);
                            // this.modalRef.hide();
                            // this.loadJournalVoucherList(this.fromDate, this.toDate);
                        } else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    },
                );
                break;
            case DBOperation.delete:
                console.log(JournalObject);
                
                this._journalvoucherService.delete(Global.BASE_JOURNALVOUCHER_ENDPOINT, JournalObject).subscribe(
                    data => {
                        if (data == 1) {
                            alert("Data successfully deleted.");
                            // this.loadJournalVoucherList(this.fromDate, this.toDate);
                        } else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                        this.formSubmitAttempt = false;
                        this.journalFrm.reset();
                    },
                );
        }
    } else {
        this.validateAllFields(journal);
    }
  }

  // Push Account Values in row
  addAccountValues() {
    const control = <FormArray>this.journalFrm.controls['AccountTransactionValues'];
        const addJournalVoucher = this.initAccountValue();
        control.push(addJournalVoucher);
  }

  //remove the rows//
  removeAccount(i: number) {
      // updated one
      // let controls = <FormArray>this.journalFrm.controls['AccountTransactionValues'];
      // controls.removeAt(i);


      let controls = <FormArray>this.journalFrm.controls['AccountTransactionValues'];
      let controlToRemove = this.journalFrm.controls.AccountTransactionValues['controls'][i].controls;
      let selectedControl = controlToRemove.hasOwnProperty('Id') ? controlToRemove.Id.value : 0;

      let currentaccountid = controlToRemove.Id?.value ? controlToRemove.Id.value : 0;

      if (currentaccountid != "0") {
        this._accountTransValues.delete(Global.BASE_JOURNAL_ENDPOINT, currentaccountid)
          .subscribe(
              data => {   
                  (data == 1) && controls.removeAt(i);
                  this.toastrService.success('Data removed successfully!');
              }
          );
      } else {
          if (i >= 0) {
              controls.removeAt(i);
          } else {
              alert("Form requires at least one row");
          }
      }
  }


  //calulate the sum of debit columns//
  sumDebit() {
    let controls = this.journalFrm.controls.AccountTransactionValues.value;
    return controls.reduce(function (total: any, accounts: any) {
        return (accounts.Debit) ? (total + Math.round(accounts.Debit)) : total;
    }, 0);
  }

  //calculate the sum of credit columns//
  sumCredit() {
    let controls = this.journalFrm.controls.AccountTransactionValues.value;

    return controls.reduce(function (total: any, accounts: any) {
        return (accounts.Credit) ? (total + Math.round(accounts.Credit)) : total;
    }, 0);
  }

  /**
   * Validate fields
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

  /**
   * Resets the journal form
   */
  reset() {
    this.journalFrm.controls['Id'].reset();
    this.journalFrm.controls['Date'].reset();
    this.journalFrm.controls['drTotal'].reset();
    this.journalFrm.controls['crTotal'].reset();
    this.journalFrm.controls['Description'].reset();
    this.journalFrm.controls['AccountTransactionValues'] = this.fb.array([]);
    this.addAccountValues();
  }
  
  searchChange($event) {
    console.log($event);
  }
  config = {
      displayKey: 'Name', // if objects array passed which key to be displayed defaults to description
      search: true,
      limitTo: 1000,
      height: '200px'
  };
  DropdownChange($event, i: number) {
      var ii = i;
      console.log($event);
      if ($event != null) {
          this.account = $event;
          var s2name = $event.value.Id;
      }
  };

  cancel() {
    this.reset();
    this.router.navigate(['Account/journalVoucher'])
  }

  back() {
    this._location.back();
  }

}
