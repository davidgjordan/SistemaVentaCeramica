import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styles: []
})
export class ProduccionComponent implements OnInit {
  private agregarItemButton:boolean = false;
  private mostrarItemButton:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
