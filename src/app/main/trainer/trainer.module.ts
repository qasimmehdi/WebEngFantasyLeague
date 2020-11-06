import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerListComponent } from './trainer-list/trainer-list.component';
import { RouterModule, Routes } from '@angular/router';
import * as material from '@angular/material';
import { FuseConfirmDialogModule, FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { TrainerService } from './trainer.service';
import { TrainerComponent } from './trainer/trainer.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatToolbarModule, MatProgressSpinnerModule, MatDialogModule, MAT_HAMMER_OPTIONS } from '@angular/material';
import { AuthGuard } from '../auth-guard.service';
import { InterceptorService } from '../interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { VerificationDialog } from './trainer/dialog/dialog.component';
import { RejectConfirmDialog } from './trainer/reject-confirm/reject-confirm.component';
import { MatCardModule } from '@angular/material/card';
import { ImageModalModule } from '../shared/image-modal/image-modal.module';

const routes: Routes = [
    {
        path: 'trainers',
        component: TrainerListComponent,
        resolve: {
            data: TrainerService
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'trainers/:id',
        component: TrainerComponent,
        resolve: {
            data: TrainerService
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    declarations: [
        TrainerListComponent,
        TrainerComponent,
        VerificationDialog,
        RejectConfirmDialog
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        material.MatButtonModule,
        material.MatChipsModule,
        material.MatExpansionModule,
        material.MatFormFieldModule,
        material.MatIconModule,
        material.MatInputModule,
        material.MatPaginatorModule,
        material.MatRippleModule,
        material.MatSelectModule,
        material.MatSortModule,
        material.MatSnackBarModule,
        material.MatTableModule,
        material.MatTabsModule,
        material.MatAutocompleteModule,
        material.MatMenuModule,
        material.MatDialogModule,
        material.MatSlideToggleModule,
        material.MatTooltipModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatToolbarModule,
        FuseConfirmDialogModule,
        FuseSharedModule,
        FuseWidgetModule,
        MatDialogModule,
        ImageModalModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        },
        AuthGuard,
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        {
            provide: MAT_HAMMER_OPTIONS,
            useValue: {
              cssProps: {
                userSelect: true
              }
            },
          },
    ],
    exports: [
    ],
    entryComponents: [
        VerificationDialog,
        RejectConfirmDialog
    ],
})
export class GymsModule {
}
