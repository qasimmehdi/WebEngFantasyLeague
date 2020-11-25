import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashComponent } from './dash/dash.component';
import { AuthGuard } from '../auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatCardModule, MatPaginatorModule, MatSortModule, MatTableModule, MatTooltipModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
      path     : 'dashboard',
      component: DashComponent,
      canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatButtonModule
  ],
  declarations: [DashComponent]
})
export class DashboardModule { }
