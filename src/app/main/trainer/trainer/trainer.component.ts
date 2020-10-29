import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { TrainerService } from '../trainer.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';
import { VerificationDialog } from './dialog/dialog.component';

@Component({
    selector: 'app-gym',
    templateUrl: './trainer.component.html',
    styleUrls: ['./trainer.component.scss'],
    animations: fuseAnimations
})

export class TrainerComponent implements OnInit, OnDestroy {

    moment = moment;
    gym: any;
    pageType: string;
    gymForm: FormGroup;
    stateInfo: any[] = [];
    cityInfo: any[] = [];
    gymUser: any;
    countrySelected: any;
    stateSelected: any;
    public reenableButton = new EventEmitter<boolean>(false);
    toppings = new FormControl();
    certifications = ["ACE", "ACE"];

    trainer: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    animal: string;
    name: string;

    constructor(
        private trainerService: TrainerService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private route: ActivatedRoute,
        public dialog: MatDialog
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to update product on changes
        this.trainerService.onItemChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(trainer => {
                this.trainer = this.trainerService.pageItem;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    showNotify(message): void {
        // Show the success message
        this._matSnackBar.open(message, 'OK', {
            verticalPosition: 'bottom',
            duration: 3000
        });
    }

    openVerificationDialog(): void {
        const dialogRef = this.dialog.open(VerificationDialog, {
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('The dialog was closed');
        });
    }
}

export const nameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }

    let name = control.parent.get('name').value;

    if (name.trim()) {
        return null;
    }

    return { 'blankName': true };
};