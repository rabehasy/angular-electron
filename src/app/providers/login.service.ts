import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';
import { map, tap  } from "rxjs/operators";

import { AppConfig } from '../../environments/environment';

import { StorageService } from './storage.service';
import { ElectronService } from './electron.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public storage: StorageService;


  constructor(
    private http: HttpClient,
    private electron: ElectronService
  ) {
    this.electron = electron;
    this.storage = new StorageService(electron);
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.storage.get('user')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    console.log('this.currentUserSubject.value',this.currentUserSubject.value);
    return this.currentUserSubject.value;
  }

  login (data): Observable<any> {
    // console.log(data);
    return this.http.post<any>(`${AppConfig.apiUrl}/user/login`, data, httpOptions)
      .pipe(map(user => {
        console.log(user);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        this.storage.save('user', user);
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  getLoggedIn () {
    return this.storage.get('user');
  }

  logout() {
    // remove user from local storage to log user out
    this.storage.remove('user');
    this.currentUserSubject.next(null);
  }

  getAll(): Observable<any> {
    return this.http.get(`${AppConfig.apiUrl}/user/login`).pipe(
      map(this.extractData));
  }


  add (data): Observable<any> {
    console.log(data);
    return this.http.post<any>(`${AppConfig.apiUrl}/user/login`, JSON.stringify(data), httpOptions).pipe(
      tap((data) => console.log(`added data w/ id=${data.id}`))
    );
  }

  update (id, data): Observable<any> {
    return this.http.put(`${AppConfig.apiUrl}/user/login/${id}` , JSON.stringify(data), httpOptions).pipe(
      tap(_ => console.log(`updated data id=${id}`))
    );
  }

  delete (id): Observable<any> {
    return this.http.delete<any>(`${AppConfig.apiUrl}/user/login/${id}`, httpOptions).pipe(
      tap(_ => console.log(`deleted product id=${id}`))
    );
  }



  public getToken(): string {
    return this.storage.get('id_token');
  }




  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }
}
