import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class LeagueService {
    baseurl = "http://103.79.18.248:27019/api/Leagues/";
    constructor(private http: HttpClient) { }

    addLeague(payload) {
        return new Promise((resolve, reject) => {
            this.http.post(this.baseurl + "add", payload).subscribe(
                (x) => resolve(x),
                (err) => reject(err)
            );
        });
    }

    getLeague() {
        return new Promise((resolve, reject) => {
            this.http.get(this.baseurl + "getleagues").subscribe(
                (x) => resolve(x),
                (err) => reject(err)
            );
        });
    }

    postJoinLeague(id) {
        return new Promise((resolve, reject) => {
            this.http.post(this.baseurl + "join/" + id, {}).subscribe(
                (x) => resolve(x),
                (err) => reject(err)
            );
        });
    }

    getMyLeagues() {
        return new Promise((resolve, reject) => {
            this.http.get(this.baseurl + "getmyleagues").subscribe(
                (x) => resolve(x),
                (err) => reject(err)
            );
        });
    }

    getJoinedLeagues() {
        return new Promise((resolve, reject) => {
            this.http.get(this.baseurl + "getjoinedleagues").subscribe(
                (x) => resolve(x),
                (err) => reject(err)
            );
        });
    }

    addPoints(data) {
        return new Promise((resolve, reject) => {
            this.http.post("http://103.79.18.248:27019/api/Points/addBatch", data).subscribe(
                (x) => resolve(x),
                (err) => reject(err)
            );
        });
    }

    getLeaderboard(id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.baseurl+'getPoints/'+id).subscribe(
                (x) => resolve(x),
                (err) => reject(err)
            );
        });
    }
}
