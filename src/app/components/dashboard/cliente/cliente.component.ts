import { Component, OnInit } from '@angular/core';
import { TransaccionService } from "../../../services/firebase-service/transacciones.service";
import { Transaccion } from "../../../models/Transaccion";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  providers: [TransaccionService]
})
export class ClienteComponent implements OnInit {

  private listaTransaccionesCliente:Transaccion[]=[];
  constructor(private transaccionS: TransaccionService) { }

  ngOnInit() {
  }

  buscarPorNit(nitClienteStr: number) {
    let nitCliente: number = Number(nitClienteStr);
    let transaccionesAux: Transaccion[] = [];
    if (nitCliente) {
      this.transaccionS.getTransaccionPorNit(nitCliente).subscribe((transacciones) => {
        transaccionesAux = transacciones;
      });

      setTimeout(() => {
        if(transaccionesAux.length>0){
          this.listaTransaccionesCliente = transaccionesAux;
        }else{
          console.log('no Existen transacciones del cliente');
        }
      }, 1200);
    }
  }

}
