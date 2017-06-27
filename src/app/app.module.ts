import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
//rutas
import { ROUTES_ROUTING } from './app.routes';

//services
import { Auth } from './services/auth.service';
import { SaveInstancePedido } from "./services/firebase-service/saveInstacePedido.service";
import { ItemService } from "./services/firebase-service/items.service";
//componentes
import { AuthGuardService } from './services/auth-guard.service';
import { MenuOpcionesComponent } from './components/dashboard/menu-opciones/menu-opciones.component';
import { PedidoComponent } from './components/dashboard/pedido/pedido.component';
import { DespachoComponent } from './components/dashboard/despacho/despacho.component';
import { PreciosComponent } from './components/dashboard/precios/precios.component';
import { ClienteComponent } from './components/dashboard/cliente/cliente.component';
import { ProduccionComponent } from './components/dashboard/produccion/produccion.component';
import { AlmacenComponent } from './components/dashboard/almacen/almacen.component';
import { CobroComponent } from './components/dashboard/cobro/cobro.component';

//cards
import {MdCardModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdGridListModule} from '@angular/material';
//firebase
import { AngularFireModule } from 'angularfire2';
import { firebase_config } from "./configuration/firebase-config";
import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    DashboardComponent,
    MenuOpcionesComponent,
    PedidoComponent,
    DespachoComponent,
    PreciosComponent,
    ClienteComponent,
    ProduccionComponent,
    AlmacenComponent,
    CobroComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ROUTES_ROUTING,
    MdCardModule,
    BrowserAnimationsModule,
    MdGridListModule,
    AngularFireDatabaseModule, 
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebase_config.firebase)
  ],
  providers: [
    Auth,
    AuthGuardService,
    SaveInstancePedido,
    ItemService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
