import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeagueService } from '../../services/league.service';
import { Router } from '@angular/router';

const BASE_URL = environment.baseUrl;

@Component({
  selector: 'app-manage-league',
  templateUrl: './manage-league.component.html',
  styleUrls: ['./manage-league.component.scss'],
  animations: fuseAnimations
})

export class ManageLeagueComponent implements OnInit {

  leagueForm: FormGroup;
  sports = [
    'Racing',
    'Football',
    'Cricket',
    'Soccer',
    'Basketball',
    'Tennis',
    'Baseball',
    'Golf',
    'Running',
    'Volleyball',
    'Dadminton',
  ].sort();

  constructor(private router: Router,
    private _formBuilder: FormBuilder,
    private service: LeagueService,
    private _matSnackBar: MatSnackBar) { }

  ngOnInit() {
    this.leagueForm = this._formBuilder.group({
      Name: ['', [Validators.required]],
      maxParticipants: [2, [Validators.required, Validators.min(2)]],
      rules: ['', Validators.required]
    });
  }

  save() {
    this.service.addLeague(this.leagueForm.value).then(x => {
      console.log(x);
      this._matSnackBar.open('League created successfully', 'OK', {
        verticalPosition: 'bottom',
        duration: 3000
      });
      this.router.navigateByUrl('/dashboard');
    }).catch(err => {
      console.log(err);
      this._matSnackBar.open('Something went wrong', 'OK', {
        verticalPosition: 'bottom',
        duration: 3000
      });
    })
  }

}
