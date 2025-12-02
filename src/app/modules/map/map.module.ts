import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapPageComponent } from '../../pages/map/map.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MapPageComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    MapRoutingModule
  ]
})
export class MapModule { }
