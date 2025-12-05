import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { MapPageComponent } from '../../pages/map/map.component';

import { GraficasComponent } from '../../pages/graficas/graficas.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';

import { ComponentsModule } from 'src/app/components/components.module';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),   // ✔ SOLO ESTA LÍNEA MANEJA EL ROUTING
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ComponentsModule,                           // ✔ Aquí vienen sidebar, navbar, footer
    NgxEchartsModule.forRoot({ echarts })
  ],
  declarations: [
    DashboardComponent,
    MapPageComponent,
    GraficasComponent
  ]
})
export class AdminLayoutModule { }
