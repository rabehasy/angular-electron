import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// import * as moment from "moment";

const endpoint = 'http://localhost:3008/api/user/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(endpoint).pipe(
      map(this.extractData));
  }

  getSingle(id): Observable<any> {
    return this.http.get(endpoint  + id).pipe(
      map(this.extractData));
  }

  add (data): Observable<any> {
    console.log(data);
    return this.http.post<any>(endpoint + 'products', JSON.stringify(data), httpOptions).pipe(
      tap((product) => console.log(`added data w/ id=${data.id}`)),
      catchError(this.handleError<any>('add'))
    );
  }

  update (id, data): Observable<any> {
    return this.http.put(endpoint + 'products/' + id, JSON.stringify(data), httpOptions).pipe(
      tap(_ => console.log(`updated data id=${id}`)),
      catchError(this.handleError<any>('update'))
    );
  }

  delete (id): Observable<any> {
    return this.http.delete<any>(endpoint + 'products/' + id, httpOptions).pipe(
      tap(_ => console.log(`deleted product id=${id}`)),
      catchError(this.handleError<any>('delete'))
    );
  }

  login (data): Observable<any> {
    // console.log(data);
    return this.http.post<any>(endpoint + 'login', data, httpOptions).pipe(
      tap((data) => {
        // console.log(data);
        this.setSession(data);
      }),
      catchError(this.handleError<any>('login'))
    );
  }

  private setSession(authResult) {

    console.log(authResult);
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem("expires_at", authResult.expires );
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  private setSession(authResult) {

    console.log(authResult);
    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem("expires_at", authResult.expires );
  }

  public isLoggedIn() {
    // return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    // return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    // return moment(expiresAt);
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
