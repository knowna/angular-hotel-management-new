import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UnitType } from '../../../Model/Inventory/UnitType';
import { DBOperation } from '../../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../../Shared/global';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DatePipe } from '@angular/common';
import { AccountTransactionTypeService } from 'src/app/Service/Inventory/account-trans-type.service';

@Component({
    templateUrl: './UnitType.Component.html'
})

export class UnitTypeComponent implements OnInit {
    modalRef: BsModalRef;
    modalRef2: BsModalRef;
    unitTypes: UnitType[];
    unitType: UnitType;
    public unittype: Observable<UnitType>;
    msg: string;
    indLoading: boolean = false;
    unitTypeFrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    private formSubmitAttempt: boolean;
    private buttonDisabled: boolean;

    constructor(private fb: FormBuilder, private acctransTypeService: AccountTransactionTypeService, private date: DatePipe, private modalService: BsModalService) {
        this.acctransTypeService.getAccountTypes().subscribe(data => { this.unittype = data })
    }

    ngOnInit(): void {
        this.unitTypeFrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });

        this.LoadUnitTypes();
    }

    LoadUnitTypes(): void {
        this.indLoading = true;
        this.acctransTypeService.get(Global.BASE_UNITTYPE_ENDPOINT)
            .subscribe(unittypess => { this.unitTypes = unittypess; this.indLoading = false; },
                error => this.msg = <any>error);
    }

    exportTableToExcel(tableID, filename = '') {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var clonedtable = $('#' + tableID);
        var clonedHtml = clonedtable.clone();
        $(clonedtable).find('.export-no-display').remove();
        var tableSelect = document.getElementById(tableID);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        $('#' + tableID).html(clonedHtml.html());

        // Specify file name
        filename = filename ? filename + '.xls' : 'Unit Type of ' + this.date.transform(new Date, 'dd-MM-yyyy') + '.xls';

        // Create download link element
        downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }
    }

    addUnitType(template: TemplateRef<any>) {
        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add Unit Type";
        this.modalBtnTitle = "Save";
        this.unitTypeFrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }
    editUnitType(Id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit Unit Type";
        this.modalBtnTitle = "Save";
        this.unitType = this.unitTypes.filter(x => x.Id == Id)[0];
        this.unitTypeFrm.setValue(this.unitType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteUnitType(id: number, template: TemplateRef<any>) {
        debugger;
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete Unit Type?";
        this.modalBtnTitle = "Delete";
        this.unitType = this.unitTypes.filter(x => x.Id == id)[0];
        this.unitTypeFrm.setValue(this.unitType);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
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

    //displays the confirm popup-window
    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this.modalService.show(template, { class: 'modal-sm' });
    }

    //Submit the Form
    onSubmit() {
        debugger;
        this.msg = "";
        let unitType = this.unitTypeFrm
        this.formSubmitAttempt = true;

        if (unitType.valid) {
            switch (this.dbops) {
                case DBOperation.create:

                    this.acctransTypeService.post(Global.BASE_UNITTYPE_ENDPOINT, unitType.value).subscribe(
                        data => {

                            if (data == 1) //Success
                            {
                                debugger;
                                this.LoadUnitTypes();
                                this.formSubmitAttempt = false;
                                this.modalRef.hide();
                            }
                            else {
                                // this.modal.backdrop;
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                    );
                    break;
                case DBOperation.update:

                    this.acctransTypeService.put(Global.BASE_UNITTYPE_ENDPOINT, unitType.value.Id, unitType.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                debugger;
                                this.LoadUnitTypes();
                                this.formSubmitAttempt = false;
                                this.modalRef.hide();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },

                    );
                    break;
                case DBOperation.delete:
                    debugger;
                    this.acctransTypeService.delete(Global.BASE_UNITTYPE_ENDPOINT, unitType.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data deleted sucessfully");
                                this.LoadUnitTypes();
                                this.formSubmitAttempt = false;
                                this.modalRef.hide();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }
                        },
                    );
            }
        }
        else {
            this.validateAllFields(unitType);
        }
    }


    confirm(): void {
        this.modalRef2.hide();
        this.formSubmitAttempt = false;
    }


    reset() {
        //debugger;
        let control = this.unitTypeFrm.controls['Id'].value;
        if (control > 0) {
            this.buttonDisabled = true;
        }
        else {
            this.unitTypeFrm.reset();
            this.formSubmitAttempt = false;
        }

    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.unitTypeFrm.enable() : this.unitTypeFrm.disable();
    }
}