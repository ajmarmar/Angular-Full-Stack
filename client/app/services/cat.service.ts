import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BaseHeadersHttp } from './BaseHeadersHttp';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CatService {

  private baseHeaderHttp: BaseHeadersHttp;

  constructor(private http: Http) {
  this.baseHeaderHttp = new BaseHeadersHttp();
  }

  getCats(): Observable<any> {
    return this.http.get('/api/cats',this.baseHeaderHttp.getRequestOptions()).map(res => res.json());
  }

  countCats(): Observable<any> {
    return this.http.get('/api/cats/count',this.baseHeaderHttp.getRequestOptions()).map(res => res.json());
  }

  addCat(cat): Observable<any> {
    return this.http.post('/api/cat', JSON.stringify(cat), this.baseHeaderHttp.getRequestOptions());
  }

  getCat(cat): Observable<any> {
    return this.http.get(`/api/cat/${cat._id}`,this.baseHeaderHttp.getRequestOptions()).map(res => res.json());
  }

  editCat(cat): Observable<any> {
    return this.http.put(`/api/cat/${cat._id}`, JSON.stringify(cat), this.baseHeaderHttp.getRequestOptions());
  }

  deleteCat(cat): Observable<any> {
    return this.http.delete(`/api/cat/${cat._id}`, this.baseHeaderHttp.getRequestOptions());
  }

}
