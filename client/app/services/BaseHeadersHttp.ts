import { Headers, RequestOptions } from '@angular/http';

export class BaseHeadersHttp {
  constructor() {}

  public getRequestOptions (): RequestOptions {
     const token = localStorage.getItem('token');

     const headers = new Headers({ 'Content-Type': 'application/json',
                                   'charset': 'UTF-8',
                                   'Authorization': 'Bearer ' + token  });
     const requestOptions = new RequestOptions({ headers: headers });

     return requestOptions;

   }
}
