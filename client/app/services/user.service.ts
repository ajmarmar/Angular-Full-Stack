import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BaseHeadersHttp } from './BaseHeadersHttp';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService  {

  private baseHeaderHttp: BaseHeadersHttp;
  constructor(private http: Http) {

    this.baseHeaderHttp = new BaseHeadersHttp();
  }

  register(user): Observable<any> {
    return this.http.post('/api/user/register', JSON.stringify(user), this.baseHeaderHttp.getRequestOptions());
  }

  login(credentials): Observable<any> {
    return this.http.post('/api/login', JSON.stringify(credentials), this.baseHeaderHttp.getRequestOptions());
  }

  getUsers(): Observable<any> {
    return this.http.get('/api/users', this.baseHeaderHttp.getRequestOptions()).map(res => res.json());
  }

  countUsers(): Observable<any> {
    return this.http.get('/api/users/count', this.baseHeaderHttp.getRequestOptions()).map(res => res.json());
  }

  addUser(user): Observable<any> {
    return this.http.post('/api/user', JSON.stringify(user), this.baseHeaderHttp.getRequestOptions());
  }

  getUser(user): Observable<any> {
    return this.http.get(`/api/user/${user._id}`, this.baseHeaderHttp.getRequestOptions()).map(res => res.json());
  }

  editUser(user): Observable<any> {
    return this.http.put(`/api/user/${user._id}`, JSON.stringify(user), this.baseHeaderHttp.getRequestOptions());
  }

  deleteUser(user): Observable<any> {
    return this.http.delete(`/api/user/${user._id}`, this.baseHeaderHttp.getRequestOptions());
  }

  logout(): Observable<any> {
    // return this.http.get('/api/logout',this.baseHeaderHttp.getRequestOptions()).map(res => res.json());
    return this.http.post('/api/logout', '', this.baseHeaderHttp.getRequestOptions());
  }

}
