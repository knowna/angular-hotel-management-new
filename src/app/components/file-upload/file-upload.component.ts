import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FileService } from '../../Service/file.service';

// Services
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {

  // Variable References
  @ViewChild('fileInput',{static:false}) fileInput: any;
  @Input('uploadUrl') uploadUrl: any;
  @Input('extraFormData') extraFormData: FormGroup;
  @Input('dropMessage') dropMessage: string;
  

  // In-Scope Variables
  public statusCreateForm: FormGroup;
  private fileToUpload: File = null;
  public uploadProgress: number = 0;
  public uploadComplete: boolean = false;
  private uploadingProgressing: boolean = false;
  private fileUploadSub: any;
  public currentFile: any;
  // public dropMessage: string = 'Drop or select a File.';

  // Constuctor
  constructor( private fileUploadService: FileService) {
    let hj = [];
    let v = hj.pop();

    this.dropMessage = v && (v.length) > 30 ? v.slice(0, 30) + "..." : v || this.dropMessage; 
  }

  /**
   * Overrides OnInit Lifecycle Hook
   */
  ngOnInit() {   
    this.initialiazeFileUploadForm();
  }

  /**
   * Initialiazes File Upload Form
   */
  initialiazeFileUploadForm () {
    this.statusCreateForm = this.extraFormData;
  }

  /**
   * Overrides OnDestroy Lifecycle Hook
   */
  ngOnDestroy() {
    if (this.fileUploadSub) {
      this.fileUploadSub.unsubscribe()
    }
  }

  /**
   * Handles file upload progress
   * @param event 
   * @param resolve
   */
  handleProgress(event, resolve) {
    if (event.type === HttpEventType.DownloadProgress) {
      this.uploadingProgressing = true;
      this.uploadProgress = Math.round(100 * event.loaded / event.total)
    }

    if (event.type === HttpEventType.UploadProgress) {
      this.uploadingProgressing = true;
      this.uploadProgress = Math.round(100 * event.loaded / event.total)
    }

    if (event.type === HttpEventType.Response) {
      this.uploadProgress = 100;
      this.uploadComplete = true;

      return resolve(event.body);
    }
  }

  /**
   * Handles file upload fuctionality
   * @return Promise
   */
  async handleFileUpload(extraData) {
      if (this.fileToUpload) {
         console.log(this.fileToUpload);
         
      let uploadStatus = await new Promise(resolve => {
        this.fileUploadSub = this.fileUploadService.fileUpload(this.uploadUrl, this.fileToUpload, extraData)
          .subscribe(
            data =>  resolve(data),
            error => console.log(error,"Server error")
          );
      });
       
      return uploadStatus;
    } else {
      return 0;
    }
  }

  /**
   * Handles input files
   * @param files 
   */
  handleFileInput(files: FileList) {
    let newFileItem = files.item(0);
    
    this.dropMessage = (newFileItem.name.length) > 30 ? newFileItem.name.slice(0, 30) + "..." : newFileItem.name;
    this.fileToUpload = newFileItem;
    console.log("file input has changed. The file is", newFileItem)
  }

  /**
   * resets file input field
   */
  resetFileInput() {
    console.log(this.fileInput.nativeElement.files);
    this.fileInput.nativeElement.value = "";
    console.log(this.fileInput.nativeElement.files);
  }

  /**
   * Reset all value and form data
   */
  resetAll () {
    this.resetFileInput();
    this.initialiazeFileUploadForm();
  }
}
