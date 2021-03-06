import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

// ngrx
import { select, Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { LOG_OUT, LOG_IN } from '../../store/actions/user.actions';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { regexes } from '../shared/regexes';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isLogginIn: boolean = false;
    user$: Observable<object>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private store: Store<AppState>,
        private router: Router,
        private loginService: LoginService,
        private _snackBar: MatSnackBar,
        private authService: AuthService
    ) {
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

    ngOnInit() {
        this.loginForm = this._formBuilder.group({
            Email: ['', [Validators.required, Validators.pattern(regexes.email)]],
            Password: ['', [Validators.required]]
        });
        if (this.authService.isUserLoggedIn()) {
            this.router.navigateByUrl('dashboard')
        }
        //just for test
        //localStorage.removeItem('access_token');
    }

    login() {
       this.loginService.Login(this.loginForm.value).then((x: any) => {
           localStorage.setItem('access_token', x.token);
           this.router.navigateByUrl('/dashboard');
       }).catch(err => {
           console.log(err);
       })
    }

}
