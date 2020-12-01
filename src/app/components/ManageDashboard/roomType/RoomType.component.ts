import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Observable } from 'rxjs/Rx';
import { IRoomType } from 'src/app/Model/Room/Room';
import { RoomService } from 'src/app/Service/Inventory/room.service';
import { DBOperation } from 'src/app/Shared/enum';
import { Global } from 'src/app/Shared/global';

@Component({
    selector: 'my-roomtype-list',
    templateUrl: './roomtype.component.html'
})


export class RoomTypeComponent implements OnInit {
    roomtypes: IRoomType[];
    tempRoomtypes: IRoomType[];
    roomtype: IRoomType;
    msg: string;
    searchKeyword='';
    indLoading: boolean = false;
    private formSubmitAttempt: boolean;
    roomtypefrm: FormGroup;
    dbops: DBOperation;
    modalTitle: string;
    modalBtnTitle: string;
    modalRef: BsModalRef;

    constructor(private fb: FormBuilder, private _roomtypeService: RoomService, private modalService: BsModalService) { }

    ngOnInit(): void {
        this.roomtypefrm = this.fb.group({
            Id: [''],
            Name: ['', Validators.required]
        });
        this.Loadroomtype();
    }

    Loadroomtype(): void {
        this.indLoading = true;
        this._roomtypeService.get(Global.BASE_ROOMTYPE_ENDPOINT)
            .subscribe(roomtypes => {
                this.roomtypes = roomtypes;
                this.tempRoomtypes = roomtypes;
                 this.indLoading = false;
            },
            error => this.msg = <any>error);
    }
    openModal(template: TemplateRef<any>) {

        this.dbops = DBOperation.create;
        this.SetControlsState(true);
        this.modalTitle = "Add New Room";
        this.modalBtnTitle = "Save";
        this.roomtypefrm.reset();
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    editroomtype(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.update;
        this.SetControlsState(true);
        this.modalTitle = "Edit DepartmentName";
        this.modalBtnTitle = "Save";
        this.roomtype = this.roomtypes.filter(x => x.Id == id)[0];
        this.roomtypefrm.setValue(this.roomtype);
        this.modalRef = this.modalService.show(template, { backdrop: 'static', keyboard: false });
    }

    deleteroomtype(id: number, template: TemplateRef<any>) {
        this.dbops = DBOperation.delete;
        this.SetControlsState(true);
        this.modalTitle = "Confirm to Delete?";
        this.modalBtnTitle = "Delete";
        this.roomtype = this.roomtypes.filter(x => x.Id == id)[0];
        this.roomtypefrm.setValue(this.roomtype);
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

    onSubmit(formData: any) {
        this.msg = "";
        this.formSubmitAttempt = true;
        let roomtypefrm = this.roomtypefrm;

        if (roomtypefrm.valid) {
            switch (this.dbops) {
                case DBOperation.create:
                    this._roomtypeService.post(Global.BASE_ROOMTYPE_ENDPOINT, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully added.");
                                this.Loadroomtype();
                                this.formSubmitAttempt = false;
                                this.modalRef.hide();
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
                    this._roomtypeService.put(Global.BASE_ROOMTYPE_ENDPOINT, formData.value.Id, formData.value).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Data successfully updated.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.Loadroomtype();
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
                    this._roomtypeService.delete(Global.BASE_ROOMTYPE_ENDPOINT, formData.value.Id).subscribe(
                        data => {
                            if (data == 1) //Success
                            {
                                alert("Department successfully deleted.");
                                this.modalRef.hide();
                                this.formSubmitAttempt = false;
                                this.Loadroomtype();
                            }
                            else {
                                alert("There is some issue in saving records, please contact to system administrator!");
                            }

                            //this.modal.dismiss();
                        },
                        error => {
                            this.msg = error;
                        }
                    );
                    break;
            }
        }
        else {
            this.validateAllFields(roomtypefrm);
        }
    }
    SetControlsState(isEnable: boolean) {
        isEnable ? this.roomtypefrm.enable() : this.roomtypefrm.disable();
    }

    searchItem(){
        this.searchKeyword =this.searchKeyword.trim();
        if(this.searchKeyword=='' || this.searchKeyword==null ){
            this.roomtypes = this.roomtypes;
        }

        let filteredMenus: any[] = [];

       filteredMenus = this.tempRoomtypes.filter(
           room=>
          {
              
           return (room.Name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) !== -1);
          }
          
       );
     
       this.roomtypes = filteredMenus;
     
    }

    reset() {
        this.roomtypefrm.reset();
    }

    CloseForm() {
        this.reset();
        this.modalRef.hide();
        // this.router.navigate(["InventoryDashboard/inventory"]);
    }

}
