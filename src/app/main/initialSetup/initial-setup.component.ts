import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatHorizontalStepper, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { Store } from '@ngrx/store';
import { AppState } from 'app/app.state';
import { AuthService } from '../auth.service';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/internal/Subscription';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { InitialSetupService } from './initial-setup.service';

export interface ChipsArray {
    name: string;
}

@Component({
    selector: 'initial-setup',
    templateUrl: './initial-setup.component.html',
    styleUrls: ['./initial-setup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class InitialSetup implements OnInit, OnDestroy {
    settingsFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    associationsFormGroup: FormGroup;
    accountInfo: FormGroup;

    watcher: Subscription;
    activeMediaQuery = '';
    isSmallscreen: boolean = false;

    isLoading: boolean = true;
    //chips related
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    associationNames: ChipsArray[] = [];

    //request data
    trainingTypes: ChipsArray[] = [];
    trainingAssociations = [];
    initialResponse: any;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private store: Store<AppState>,
        private router: Router,
        private initialService: InitialSetupService,
        private _snackBar: MatSnackBar,
        private authService: AuthService,
        media: ObservableMedia
    ) {

        this.initialService.getInitialSetup()
            .then(
                (response) => {
                    const {
                        settings,
                        trainingTypes,
                        adminList,
                        trainingAssociations,
                        systemSetup
                    } = response;

                    //systemSetup ? this.router.navigateByUrl('login') : null;

                    this.initialResponse = response;

                    this.settingsFormGroup.setValue({ email: settings[0].appValue, phone: settings[1].appValue });
                    this.trainingTypes = trainingTypes.map((item) => (
                        { name: item.name }
                    ));
                    trainingAssociations.map((item) => {
                        this.trainingAssociations.push({ name: item.name, description: item.description });
                        this.associationNames.push({ name: `${item.name} - ${item.description}` });
                    });
                    this.accountInfo.setValue({
                        name: adminList[0].name,
                        email: adminList[0].email,
                        password: adminList[0].password,
                        dateOfBirth: `${adminList[0].dateOfBirth.split('/')[2]}-${adminList[0].dateOfBirth.split('/')[0]}-${adminList[0].dateOfBirth.split('/')[1]}`,
                        image: ''
                    });
                    this.associationsFormGroup.setValue({
                        name: trainingAssociations[0].name,
                        description: trainingAssociations[0].description
                    });

                    this.isLoading = false;
                }
            )
            .catch((err) => {
                this._snackBar.open("Unable to load data", 'Ok', {
                    duration: 2000,
                });
                //console.log(err);
            });

        this.watcher = media.subscribe((change: MediaChange) => {
            this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
            if (change.mqAlias == 'xs') {
                this.isSmallscreen = true;
            }
            else {
                this.isSmallscreen = false;
            }
        });
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    ngOnDestroy() {
        this.watcher.unsubscribe();
    }

    ngOnInit() {


        this.settingsFormGroup = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.pattern("[0-9]{12}")]]
        });
        this.associationsFormGroup = this._formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
        this.accountInfo = this._formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern(".{8,}")]],
            dateOfBirth: ['', [Validators.required]],
            image: ['']
        });

    }

    submitInitialSetup() {
        let data = {
            settings: this.initialResponse.settings,
            trainingTypes: this.trainingTypes,
            trainingAssociations: this.trainingAssociations,
            admin: this.accountInfo.value,
        };

        data.settings[0].appValue = this.settingsFormGroup.controls.email.value;
        data.settings[1].appValue = this.settingsFormGroup.controls.phone.value;

        const dateOfBirth = data.admin.dateOfBirth;
        data.admin.dateOfBirth = `${dateOfBirth.split('-')[1]}/${dateOfBirth.split('-')[2]}/${dateOfBirth.split('-')[0]}`
        //console.log(data);

        this.initialService.postInitialSetup(data)
            .then((resp) => {
                //console.log(resp);
                this._snackBar.open("Initial setup completed successfully", 'Ok', {
                    duration: 2000,
                });
                this.router.navigateByUrl('login');
            })
            .catch((err) => {
                this._snackBar.open("Unable to load data", 'Ok', {
                    duration: 2000,
                });
                console.log(err);
            });
    }




    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.trainingTypes.push({ name: value.trim() });
        }

        if (input) {
            input.value = '';
        }
    }

    remove(trainingTypes: ChipsArray): void {
        const index = this.trainingTypes.indexOf(trainingTypes);

        if (index >= 0) {
            this.trainingTypes.splice(index, 1);
        }
    }

    addAssociations(): void {
        //console.log(this.associationsFormGroup.value.name);
        const { name, description } = this.associationsFormGroup.value;

        const value = `${name} - ${description}`;

        if ((value || '').trim()) {
            this.associationNames.push({ name: value.trim() });
        }

        this.associationsFormGroup.setValue({ name: '', description: '' });
        this.trainingAssociations.push({ name, description });
        //console.log(this.trainingAssociations);
    }

    removeAssociations(associationNames: ChipsArray): void {
        const index = this.associationNames.indexOf(associationNames);

        if (index >= 0) {
            this.associationNames.splice(index, 1);
            this.trainingAssociations.splice(index, 1);
        }
    }



}
