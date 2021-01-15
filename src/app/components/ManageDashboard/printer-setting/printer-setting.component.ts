import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IDepartment } from 'src/app/Model/Department';
import { PrinterSetting } from 'src/app/Model/printer-setting.model';
import { DepartmentService } from 'src/app/Service/Department.service';
import { Global } from 'src/app/Shared/global';
import { DBOperation } from '../../../Shared/enum';

@Component({
  selector: 'app-printer-setting',
  templateUrl: './printer-setting.component.html',
  styleUrls: ['./printer-setting.component.css']
})
export class PrinterSettingComponent implements OnInit {
  departments: IDepartment[];
  
  printerSettings: PrinterSetting[];
  tempPrinterSettings: PrinterSetting[];
  printerSetting: PrinterSetting;

  searchKeyword = '';

  msg: string;
  indLoading: boolean = false;
  public formSubmitAttempt: boolean;
  printerForm: FormGroup;
  dbops: DBOperation;
  modalTitle: string;
  modalBtnTitle: string;
  modalRef: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private _departmentService: DepartmentService, 
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.printerForm = this.fb.group({
      Id: [''],
      ShareName: ['', Validators.required],
      PrinterType: ['', Validators.required], 
      CodePage: ['', Validators.required], 
      CharsPerLine: ['', Validators.required], 
      PageHeight: ['', Validators.required], 
      CustomPrinterName: ['', Validators.required], 
      CustomPrinterData: ['', Validators.required],       
      DepartmentId: ['', Validators.required], 
    });

    this.LoadDepartment();
    this.LoadPrinterSetting();
  }

  LoadDepartment(): void {
    this._departmentService.get(Global.BASE_DEPARTMENT_ENDPOINT)
        .subscribe(departments => { 
            this.departments = departments; 
        },
        error => {
          console.error(error);
        });
  }


  LoadPrinterSetting(): void {
    this.indLoading = true;
    this._departmentService.get(Global.BASE_PRINTER_SETTING_ENDPOINT)
      .subscribe(
        data => { 
          this.printerSettings = data; 
          this.tempPrinterSettings = data;
          this.indLoading = false; 
      },
        error => {
          this.msg = <any>error;
          this.printerSettings = [];
          this.indLoading = false; 
        }
      );
  }


  openModal(template){
    this.dbops = DBOperation.create;
    this.SetControlsState(true);
    this.modalTitle = "Add Printer Setting";
    this.modalBtnTitle = "Save";
    this.printerForm.reset();
    this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false , class:'modal-lg'});
  }

  editPrinterSetting(id: number, template: TemplateRef<any>) {
    this.dbops = DBOperation.update;
    this.SetControlsState(true);
    this.modalTitle = "Edit Printer Setting";
    this.modalBtnTitle = "Save";
    this.printerSetting = this.printerSettings.filter(x => x.Id == id)[0];
    this.printerForm.controls.Id.setValue(this.printerSetting.Id);        
    this.printerForm.controls.ShareName.setValue(this.printerSetting.ShareName);
    this.printerForm.controls.PrinterType.setValue(this.printerSetting.PrinterType);
    this.printerForm.controls.CodePage.setValue(this.printerSetting.CodePage);
    this.printerForm.controls.CharsPerLine.setValue(this.printerSetting.CharsPerLine);
    this.printerForm.controls.PageHeight.setValue(this.printerSetting.PageHeight);
    this.printerForm.controls.CustomPrinterName.setValue(this.printerSetting.CustomPrinterName);
    this.printerForm.controls.CustomPrinterData.setValue(this.printerSetting.CustomPrinterData);
    this.printerForm.controls.DepartmentId.setValue(this.printerSetting.DepartmentId);
    this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class:'modal-lg' });
  }

  deletePrinterSetting(id: number, template: TemplateRef<any>) {
    this.dbops = DBOperation.delete;
    this.SetControlsState(true);
    this.modalTitle = "Confirm to Delete?";
    this.modalBtnTitle = "Delete";
    this.printerSetting = this.printerSettings.filter(x => x.Id == id)[0];
    this.printerForm.controls.Id.setValue(this.printerSetting.Id);        
    this.printerForm.controls.ShareName.setValue(this.printerSetting.ShareName);
    this.printerForm.controls.PrinterType.setValue(this.printerSetting.PrinterType);
    this.printerForm.controls.CodePage.setValue(this.printerSetting.CodePage);
    this.printerForm.controls.CharsPerLine.setValue(this.printerSetting.CharsPerLine);
    this.printerForm.controls.PageHeight.setValue(this.printerSetting.PageHeight);
    this.printerForm.controls.CustomPrinterName.setValue(this.printerSetting.CustomPrinterName);
    this.printerForm.controls.CustomPrinterData.setValue(this.printerSetting.CustomPrinterData);
    this.printerForm.controls.DepartmentId.setValue(this.printerSetting.DepartmentId);
    this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false, class:'modal-lg' });
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


  onSubmit(formData: any) {
    this.msg = "";
    this.formSubmitAttempt = true;
    let printerForm = this.printerForm;

    if (printerForm.valid) {
        switch (this.dbops) {
            case DBOperation.create:
                console.log(formData.value);
                
                this._departmentService.post(Global.BASE_PRINTER_SETTING_ENDPOINT, formData.value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            alert("Data successfully added.");
                            this.LoadPrinterSetting();
                            this.modalRef.hide();
                            this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
            case DBOperation.update:
                this._departmentService.put(Global.BASE_PRINTER_SETTING_ENDPOINT,  formData.value.Id, formData.value).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            alert("Data successfully updated.");
                            this.modalRef.hide();
                            this.LoadPrinterSetting();
                            this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
            case DBOperation.delete:
                this._departmentService.delete(Global.BASE_PRINTER_SETTING_ENDPOINT,  formData.value.Id).subscribe(
                    data => {
                        if (data == 1) //Success
                        {
                            alert("Printer Setting successfully deleted.");
                            this.modalRef.hide();
                            this.LoadPrinterSetting();
                            this.formSubmitAttempt = false;
                        }
                        else {
                            alert("There is some issue in saving records, please contact to system administrator!");
                        }
                    },
                    error => {
                        this.msg = error;
                    }
                );
                break;
        }
    }
    else {
        this.validateAllFields(printerForm);
    }
}

  SetControlsState(isEnable: boolean) {
    isEnable ? this.printerForm.enable() : this.printerForm.disable();
  }


  getDepartmentById(departments: IDepartment[], departmentId: number) {
    var departments: IDepartment[] = departments.filter((dep: IDepartment) => dep.Id === departmentId);
    // Return product
    return departments.length ? departments[0] : {};
  }

  searchItem(){
    this.searchKeyword = this.searchKeyword.trim();
    if(this.searchKeyword == '' || this.searchKeyword == null ){
        this.printerSettings = this.printerSettings;
    }

    let filteredPrinterSettings: any[] = [];

    filteredPrinterSettings = this.tempPrinterSettings.filter(
        printer =>{
            return (printer.CustomPrinterName.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) !== -1);
        }
    );
    this.printerSettings = filteredPrinterSettings;
  }
}
