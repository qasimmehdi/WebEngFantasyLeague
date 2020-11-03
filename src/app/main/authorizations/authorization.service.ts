import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthorizationPage } from './authorizationpage.model';
import { environment } from 'environments/environment';
import { FuseUtils } from '@fuse/utils';
import { Injectable } from '@angular/core';

// const API_URL = environment.apiUrl;
// const API_URL_ACCOUNT = environment.apiaccountUrl;
const BASE_URL = environment.baseUrl;

@Injectable()
export class AuthorizationService {

  entityNode = 'resetPassword';
  routeParams: any;
  item: any;
  pageItem: any;
  items: any[];
  onItemChanged: BehaviorSubject<any>;
  onPageItemChanged: BehaviorSubject<any>;
  onItemsChanged: BehaviorSubject<any>;

  constructor(
    private _httpClient: HttpClient,
    private http: Http,
  ) {
    // Set the defaults
    this.onItemChanged = new BehaviorSubject({});
    this.onPageItemChanged = new BehaviorSubject({});
    this.onItemsChanged = new BehaviorSubject({});
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getInit()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  forgetPassword(email): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${BASE_URL}/api/accountservice/v1/auth/forgetUserPassword`, { email })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  resetPassword(data, user: "trainers" | "clients"): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${BASE_URL}/api/accountservice/v1/${user}/resetPassword`, data)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getInit(): Promise<any> {
    return new Promise((resolve, reject) => {
      // console.log(this.routeParams.id);
      if (this.routeParams.id === undefined) {
        // this._httpClient.get(API_URL + '/' + this.entityNode)
        //   .subscribe((response: any) => {
        //     this.pageItem = new AuthorizationPage(response);
        //     this.onPageItemChanged.next(this.pageItem);
        //     resolve(response);
        //   }, reject);
        this.onItemChanged.next('bat_request');
        resolve('bat_request');
        // this._httpClient.get(API_URL + '/' + this.entityNode)
        // .subscribe((response: any) => {
        //   this.items = response;
        //   this.onItemsChanged.next(this.items);
        //   resolve(response);
        // }, reject);
      }
      else {
        // this._httpClient.get(API_URL + '/' + this.entityNode + '/' + this.routeParams.id)
        //   .subscribe((response: any) => {
        if (FuseUtils.isUUID(this.routeParams.id)) {
          this.item = this.routeParams.id;
          this.onItemChanged.next(this.item);
          resolve(this.routeParams.id);
        } else {
          this.onItemChanged.next('invalid_id');
          resolve('invalid_id');
        }
        // }, reject);
      }
    });
  }

  // getItem(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     if (this.routeParams.id === 'new') {
  //       this.onItemChanged.next(false);
  //       resolve(false);
  //     }
  //     else {
  //       this._httpClient.get(API_URL + '/' + this.entityNode + '/' + this.routeParams.id)
  //         .subscribe((response: any) => {
  //           this.item = response;
  //           this.onItemChanged.next(this.item);
  //           resolve(response);
  //         }, reject);
  //     }
  //   });
  // }

  // saveItem(item): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.put(API_URL + '/' + this.entityNode, item)
  //       .subscribe((response: any) => {
  //         resolve(response);
  //       }, reject);
  //   });
  // }

  // sendItem(item): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.post(API_URL_ACCOUNT + '/' + this.entityNode, item)
  //       .subscribe((response: any) => {
  //         resolve(response);
  //       }, reject);
  //   });
  // }

  // addListItem(Listitem): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.post(API_URL + '/' + this.entityNode + '/saveall', Listitem)
  //       .subscribe((response: any) => {
  //         resolve(response);
  //       }, reject);
  //   });
  // }

  // getItems(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.get(API_URL + '/' + this.entityNode)
  //       .subscribe((response: any) => {
  //         this.items = response;
  //         this.onItemsChanged.next(this.items);
  //         resolve(response);
  //       }, reject);
  //   });
  // }

  // getPageItem(page: number, size: number): Promise<any> {
  //   // ?page=0&size=20
  //   return new Promise((resolve, reject) => {
  //     this._httpClient.get(API_URL + '/' + this.entityNode + '?page=' + page + '&size=' + size)
  //       .subscribe((response: any) => {
  //         this.pageItem = new AuthorizationPage(response);
  //         this.onPageItemChanged.next(this.pageItem);
  //         resolve(response);
  //       }, reject);
  //   });
  // }

  // deleteItemById(itemId: number): any {
  //   return this._httpClient.delete(API_URL + '/' + this.entityNode + '/' + itemId);
  // }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
