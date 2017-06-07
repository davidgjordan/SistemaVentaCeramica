import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  perfil:Object;

  constructor(private _auth:Auth) {
    this.perfil = this._auth.getProfile();

    console.log(this.perfil);
   }

  ngOnInit() {
  }

}
