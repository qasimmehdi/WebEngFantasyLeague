import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { Subject, fromEvent } from 'rxjs';
import { ReportedService } from '../reported.service';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as moment from 'moment';
import { AuthService } from 'app/main/auth.service';

export interface gymsSort {
    name: string;
}

@Component({
    selector: 'reported-list',
    templateUrl: './reported-list.component.html',
    styleUrls: ['./reported-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})

export class ReportedListComponent implements OnInit {

    dialogRef: any;
    displayedColumns: string[] = [
        'name',
        'type',
        'comment',
        'status',
        'profile',
        'btns',
    ];
    filter = 'my_gyms';
    dataSource: MatTableDataSource<any>;
    limit: number = 20;
    skip: Number = 0;
    totalLength: Number = 0;
    pageIndex: Number = 0;
    pageLimit: Number[] = [5, 10, 25, 100];
    moment = moment;
    showSearchLoader: boolean = false;
    noUser: boolean = false;
    isSorted: boolean = false;
    sortSwitch: number = 0;
    unassignedGymOwner: boolean = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('SearchInput') SearchInput: ElementRef;

    private _unsubscribeAll: Subject<any>;
    /* reported = [{
        name: "qasim",
        emailAddress: "qasim_123@gmail.com",
        phone: "123456789011",
        createdAt: "10/12/1998"
    }] */

    constructor(
        private  reportedService: ReportedService,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar,
        public authService: AuthService
    ) {
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to update Items on changes
        this.reportedService.onPageItemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(gymPage => {
                console.log(gymPage);
                if (this.reportedService.pageItem && this.reportedService.pageItem.content.length == 0) {
                    this.noUser = true;
                }
                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(this.reportedService.pageItem.content);
                this.totalLength = this. reportedService.pageItem.totalElements;
                this.limit = this. reportedService.pageItem.size;
                this.pageIndex = this. reportedService.pageItem.number;
                this.dataSource.sort = this.sort;
            });
        this.subscribeSearch();
    }

    subscribeSearch() {
        fromEvent(this.SearchInput.nativeElement, 'keyup')
            .pipe(
                map((event: any) => {
                    return event.target.value.toLowerCase();
                }),
                debounceTime(1000),
                distinctUntilChanged()
            )
            .subscribe((text: string) => {
                console.log("Text Changing...", text)
            });
    }

    changePage = (event): void => {
        console.log(event.pageSize, event.pageIndex);
        this.reportedService.getPageItem(event.pageIndex, event.pageSize);
    };

    ngOnDestroy = (): void => {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    };

    setDataSource(source) {
        this.dataSource = new MatTableDataSource(source.content);
        this.totalLength = source.totalElements;
        this.limit = source.size;
        this.pageIndex = source.number;
        this.dataSource.sort = this.sort;
    }
}