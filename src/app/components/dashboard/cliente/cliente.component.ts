import { Component, OnInit } from '@angular/core';
import { TransaccionService } from "../../../services/firebase-service/transacciones.service";
import { Transaccion } from "../../../models/Transaccion";
//pdf
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  providers: [TransaccionService]
})
export class ClienteComponent implements OnInit {

  private listaTransaccionesCliente: Transaccion[] = [];
  private pdf = new jsPDF();

  constructor(private transaccionS: TransaccionService) { }

  ngOnInit() {
  }

  buscarPorNit(nitClienteStr: number) {
    let transaccionesAux: Transaccion[] = [];
    let nitCliente: number = Number(nitClienteStr);
    if (nitCliente) {
      this.transaccionS.getTransaccionPorNit(nitCliente).subscribe((transacciones) => {
        transaccionesAux = transacciones;
      });

      setTimeout(() => {
        if (transaccionesAux.length > 0) {
          this.listaTransaccionesCliente = transaccionesAux;
        } else {
          this.listaTransaccionesCliente = [];
          console.log('no Existen transacciones del cliente');
        }
      }, 1200);
    }
  }


  generarPDFCliente() {
    if (this.listaTransaccionesCliente.length > 0) {

      this.listaTransaccionesCliente.forEach((transaccion, i) => {

        this.pdf.setFontSize(30);
        this.pdf.text(85, 30, "Transacción ");
        this.pdf.rect(30, 35, 150, 2);
        this.pdf.setFontSize(20);
        this.pdf.text(30, 50, `ID Vendedor:  ${transaccion.idUser}`);
        this.pdf.text(30, 65, `Nombre Cliente:  ${transaccion.nombreCliente}`);
        this.pdf.text(30, 80, `NIT Clliente:   ${transaccion.nitCliente}`);


        this.pdf.text(30, 95, `Total Inicial: ${transaccion.totalAnterior}`);
        this.pdf.text(30, 110, `Porcentaje Descuento: ${transaccion.porcentajeDescuento}%`);
        this.pdf.text(30, 125, `Total Final: ${transaccion.totalFinal}`);
        this.pdf.text(30, 140, `Detalle de la compra: ${transaccion.detalle}`);
        this.pdf.text(30, 165, `Fecha de la compra: ${transaccion.date}`);
        if( i < this.listaTransaccionesCliente.length -1){

          this.pdf.addPage();
        }
      });



      this.pdf.save(`Transaccion_Nit_Cliente_${this.listaTransaccionesCliente[0].nitCliente}.pdf`);

    }else{
      return;
    }

  }



}
