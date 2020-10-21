"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var FileUploadComponent = /** @class */ (function () {
    // Constuctor
    function FileUploadComponent(fileUploadService) {
        this.fileUploadService = fileUploadService;
        this.fileToUpload = null;
        this.uploadProgress = 0;
        this.uploadComplete = false;
        this.uploadingProgressing = false;
        this.dropMessage = 'Drop or select a File.';
        var hj = [];
        var v = hj.pop();
        this.dropMessage = v && (v.length) > 30 ? v.slice(0, 30) + "..." : v || this.dropMessage;
    }
    /**
     * Overrides OnInit Lifecycle Hook
     */
    FileUploadComponent.prototype.ngOnInit = function () {
        this.initialiazeFileUploadForm();
    };
    /**
     * Initialiazes File Upload Form
     */
    FileUploadComponent.prototype.initialiazeFileUploadForm = function () {
        this.statusCreateForm = this.extraFormData;
    };
    /**
     * Overrides OnDestroy Lifecycle Hook
     */
    FileUploadComponent.prototype.ngOnDestroy = function () {
        if (this.fileUploadSub) {
            this.fileUploadSub.unsubscribe();
        }
    };
    /**
     * Handles file upload progress
     * @param event
     * @param resolve
     */
    FileUploadComponent.prototype.handleProgress = function (event, resolve) {
        if (event.type === http_1.HttpEventType.DownloadProgress) {
            this.uploadingProgressing = true;
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
        }
        if (event.type === http_1.HttpEventType.UploadProgress) {
            this.uploadingProgressing = true;
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
        }
        if (event.type === http_1.HttpEventType.Response) {
            this.uploadProgress = 100;
            this.uploadComplete = true;
            return resolve(event.body);
        }
    };
    /**
     * Handles file upload fuctionality
     * @return Promise
     */
    FileUploadComponent.prototype.handleFileUpload = function (extraData) {
        var _this = this;
        if (this.fileToUpload) {
            return new Promise(function (resolve) {
                _this.fileUploadSub = _this.fileUploadService.fileUpload(_this.uploadUrl, _this.fileToUpload, extraData)
                    .subscribe(function (data) { return resolve(data); }, function (error) { return console.log("Server error"); });
            });
        }
    };
    /**
     * Handles input files
     * @param files
     */
    FileUploadComponent.prototype.handleFileInput = function (files) {
        var newFileItem = files.item(0);
        this.dropMessage = (newFileItem.name.length) > 30 ? newFileItem.name.slice(0, 30) + "..." : newFileItem.name;
        this.fileToUpload = newFileItem;
        console.log("file input has changed. The file is", newFileItem);
    };
    /**
     * resets file input field
     */
    FileUploadComponent.prototype.resetFileInput = function () {
        console.log(this.fileInput.nativeElement.files);
        this.fileInput.nativeElement.value = "";
        console.log(this.fileInput.nativeElement.files);
    };
    /**
     * Reset all value and form data
     */
    FileUploadComponent.prototype.resetAll = function () {
        this.resetFileInput();
        this.initialiazeFileUploadForm();
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], FileUploadComponent.prototype, "fileInput", void 0);
    __decorate([
        core_1.Input('uploadUrl')
    ], FileUploadComponent.prototype, "uploadUrl", void 0);
    __decorate([
        core_1.Input('extraFormData')
    ], FileUploadComponent.prototype, "extraFormData", void 0);
    FileUploadComponent = __decorate([
        core_1.Component({
            selector: 'app-file-upload',
            templateUrl: './file-upload.component.html',
            styleUrls: ['./file-upload.component.scss']
        })
    ], FileUploadComponent);
    return FileUploadComponent;
}());
exports.FileUploadComponent = FileUploadComponent;
