import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MatTableDataSource } from '@angular/material';
import { LeagueService } from 'app/services/league.service';

const BASE_URL = environment.baseUrl;

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
  animations: fuseAnimations
})

export class DashComponent implements OnInit {

  displayedColumns: string[] = [
    'league',
    'players',
    'info',
    'more'
  ];
  myLeagues: MatTableDataSource<any>;
  joinedLeagues: MatTableDataSource<any>;

  noMyLaegues: boolean = true;
  noJoinedLeagues: boolean = true;



  constructor(private service: LeagueService) { }

  ngOnInit() {
    this.service.getMyLeagues()
      .then((res: any) => {
        console.log(res);
        this.noMyLaegues = res.length > 0 ? false : true;
        this.myLeagues = new MatTableDataSource(res);
      })
      .catch(err => console.log(err));

    this.service.getJoinedLeagues()
      .then((res: any) => {
        console.log(res);
        this.noJoinedLeagues = res.length > 0 ? false : true;
        this.joinedLeagues = new MatTableDataSource(res);
      })
      .catch(err => console.log(err));

  }

  showRules(id){

  }

}
