import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LeagueService } from 'app/services/league.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-points',
  templateUrl: './add-points.component.html',
  styleUrls: ['./add-points.component.scss']
})
export class AddpointsComponent implements OnInit {
  options = [];
  filteredOptions: Observable<any[]>;
  myControl: FormControl = new FormControl();
  pointsForm: FormGroup;
  selectedPlayerId: string = '';
  disableSave: boolean = false;
  idFromRoute$: Observable<Params>;
  leagueId: string;

  constructor(private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private service: LeagueService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.idFromRoute$ = this.route.params;
        this.idFromRoute$.subscribe(res => {
            console.log(res);
            this.leagueId = res.id;
        })

    this.pointsForm = this.formBuilder.group({
      runs: [0, [Validators.required]],
      fours: [0, [Validators.required]],
      sixes: [0, Validators.required],
      wickets: [0, [Validators.required]]
    });

    this.http
      .get("http://103.79.18.248:27019/api/Player/getall")
      .subscribe((x: any) => {
        this.options = x;
      });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map((val) => {
        return this.filter(val);
      })
    );
  }

  filter(val): any[] {
    return this.options.filter((option) => {
      console.log("filter");
      return option.name.toLowerCase().indexOf(val.toLowerCase()) === 0;
    });
  }

  playerSelected(option) {
    console.log(option);
    this.selectedPlayerId = option.id;
  }

  calculatePoints() {
    this.disableSave = true;
    console.log(this.pointsForm.value);
    const { runs, sixes, fours, wickets } = this.pointsForm.value;
    const totalPoints = runs + (sixes * 6) + (fours * 4) + (wickets * 10);
    console.log(totalPoints);
    const data = [{
      playerId: this.selectedPlayerId,
      leagueId: this.leagueId,
      points: totalPoints
    }]
    this.service.addPoints(data)
      .then(res => {
        console.log(res);
        this.options = this.options.filter(i => i.id !== this.selectedPlayerId);
        this.myControl.setValue('');
        this.pointsForm.setValue({runs: 0, fours: 0, sixes: 0, wickets: 0});
      })
      .catch(err => console.log(err))
      .finally(() => {
        this.disableSave = false;
      })
  }
}
