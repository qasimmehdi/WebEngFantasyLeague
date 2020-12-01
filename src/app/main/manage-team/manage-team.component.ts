import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatOptionSelectionChange, MatTableDataSource } from "@angular/material";
import { fuseAnimations } from "@fuse/animations";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

const BASE_URL = environment.baseUrl;

@Component({
    selector: "app-manage-team",
    templateUrl: "./manage-team.component.html",
    styleUrls: ["./manage-team.component.scss"],
    animations: fuseAnimations,
})
export class ManageTeamComponent implements OnInit {
    displayedColumns: string[] = ["cricketer"];
    dataSource: MatTableDataSource<any>;
    noUser: boolean = false;


    data = [];

    myControl: FormControl = new FormControl();
    teamName: FormControl = new FormControl();

    options = [];

    filteredOptions: Observable<any[]>;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        //call api and fill options[]
        //call api and fill data[]
        this.http
            .get("http://103.79.18.248:27019/api/Teams/get")
            .subscribe((x: any) => {
                this.data = x;
                this.dataSource = new MatTableDataSource(this.data);
            });
        this.http
            .get("http://103.79.18.248:27019/api/Player/getall")
            .subscribe((x: any) => {
                this.options = x;
            });

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(""),
            map((val) => {
                if (val && val !== "") {
                    return this.filter(val);
                } else {
                    return this.options;
                }
            })
        );
        this.dataSource = new MatTableDataSource(this.data);
    }

    filter(val): any[] {
        return this.options.filter((option) => {
            console.log("filter");
            return option.name.toLowerCase().indexOf(val.toLowerCase()) === 0;
        });
    }

    playerSelected(event: MatOptionSelectionChange, option) {
        console.log('playerSelected');
        if (event.source.selected && !this.playerAlreadySelected(option.id)) {
            this.data.push(option);
            this.dataSource = new MatTableDataSource(this.data);
            this.options = this.options.filter(item => item.id !== option.id);
        }

        //this.myControl.setValue('', {emitEvent: false});
    }

    deletePlayer(i) {
        console.log(i);
        this.options.push(this.data[i]);
        this.data = this.data.filter((_, j) => j !== i);
        console.log(this.data);
        this.dataSource = new MatTableDataSource(this.data);
    }

    saveTeam() {
        console.log(this.teamName.value);
        console.log(this.data);
        this.http
            .post(
                "http://103.79.18.248:27019/api/Teams/addAll",
                this.data.map((x: any) => x.id)
            )
            .subscribe((x) => {
                console.log(x);
            });
    }

    playerAlreadySelected(id): boolean {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return true;
            }
        }
        return false;
    }
}
