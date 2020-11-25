import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

const BASE_URL = environment.baseUrl;
const BASE_URL_APP = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  baseurl = "https://localhost:44305/api/Register/login"

  Login(payload){
    return new Promise((resolve,reject) => {
      this.http.post(this.baseurl,payload).subscribe(x => {
        resolve(x);
      },error => {
        reject(error);
      })
    }) 
  }

}
