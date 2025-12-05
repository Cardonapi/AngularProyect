import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { MapPageComponent } from '../../pages/map/map.component';
import { GraficasComponent } from '../../pages/graficas/graficas.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'maps',           component: MapPageComponent  },
    { path: 'graficas',       component: GraficasComponent }
];
