import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { param } from 'jquery';

/* Naming NOTE
  The API's file field is `fileItem` thus, we name it the same below
  it's like saying <input type='file' name='fileItem' /> 
  on a standard file field
*/


@Injectable()
export class FileService {

  // Variables
  private accessToken: string;
  
  constructor(private http: HttpClient) {}

  /**
   * Upload file to the server
   * 
   * @param fileItem 
   * @param extraData 
   */
  fileUpload(url: string, fileItem: File, extraData?: object): any {
    let apiEndpoint = url;
    const formData: FormData = new FormData();

    console.log('in service file', fileItem)

    formData.append('newFileItem', fileItem);
    // formData.append("moduleName", extraData['moduleName']);
    // formData.append('id', extraData['id'])

    const params = new HttpParams()
      .set('moduleName', extraData['moduleName'].toString())
      .set('id', extraData['id'].toString());

    return this.http.post(apiEndpoint, formData, {params});

    // const req = new HttpRequest('POST', apiEndpoint, formData, { responseType: "json" });
    // return this.http.request(req);
  }
}
