
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

//importamos la proteccion
import { AuthGuardService } from './services/auth-guard.service';

const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },

  //esta es la pagina q se tiene q proteger
  { path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [ AuthGuardService ] },

  { path: '**', pathMatch:'full', redirectTo: 'home' },
];

export class NameRoutingModule { }

export const ROUTES_ROUTING = RouterModule.forRoot(ROUTES);