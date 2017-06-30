import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//services
import { PedidoService } from "../../../services/firebase-service/pedido.service";
import { TransaccionService } from "../../../services/firebase-service/transacciones.service";
//models
import { Transaccion } from "../../../models/Transaccion";
import { Pedido } from "../../../models/Pedido";
import { DespachoItems } from "../../../models/Despacho";
//pdf
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-cobro',
  templateUrl: './cobro.component.html',
  providers: [PedidoService, TransaccionService]
})
export class CobroComponent implements OnInit {

  private listaPedidos: Pedido[] = [];
  private pedidoKey: string = "";
  private listaDespachosItems: DespachoItems[] = [];
  @ViewChild('cerrarModalDescuentoPrecio') cerrarModalDescuentoPrecio: ElementRef;
  @ViewChild('cerrarModalVentaExitosa') cerrarModalVentaExitosa: ElementRef;
  private pedido: Pedido = new Pedido("", "", 0, this.listaDespachosItems, 0, 0, 0, false, false, false);
  private pdf = new jsPDF();


  constructor(private pedidoS: PedidoService, private transaccionS: TransaccionService) { }

  ngOnInit() {
    this.pedidoS.getAllPedido().subscribe((pedidos) => {
      this.listaPedidos = pedidos;
    });
  }

  setKeyPedido(pedidoKey: string) {
    this.pedidoKey = pedidoKey;
    this.pedidoS.getPedido(pedidoKey).subscribe((pedido) => {
      this.pedido = pedido;
    });
  }

  descontarPrecio(descuentoStr: number) {
    let descuento: number = Number(descuentoStr);
    let pedidoAux: Pedido;
    if (descuento > 0 && descuento < 90) {

      this.pedidoS.getPedido(this.pedidoKey).subscribe((pedido) => {
        pedidoAux = pedido;
      });

      setTimeout(() => {
        if (pedidoAux) {
          pedidoAux.descuento = descuento;
          pedidoAux.totalFinal = (pedidoAux.total) - ((pedidoAux.total * descuento) / 100);
          this.pedidoS.updatePedido(this.pedidoKey, pedidoAux).then(() => {
            console.log("descuento Exitoso");
            this.cerrarModalDescuentoPrecio.nativeElement.click();
          })
            .catch((error) => console.log("fallo al descontar" + error));
        } else {
          console.log("Fallo en la conexion de internet");

        }
      }, 1200)

    } else {
      console.log("datos descuentp invalidos invalidos");

      return;
    }
    console.log(descuento);
  }



  realizarVentaExitosa(detalle: string) {
    let pedidoAux: any;
    this.pedidoS.getPedido(this.pedidoKey).subscribe((pedido) => {
      pedidoAux = pedido;
    });

    setTimeout(() => {
      if (pedidoAux) {
        pedidoAux.ventaExitosa = true;
        this.pedidoS.updatePedido(this.pedidoKey, pedidoAux).then(() => {
          let date = new Date();

          let transaccion: Transaccion = new Transaccion(
            pedidoAux.$key,
            pedidoAux.idUser,
            pedidoAux.nombreCliente,
            pedidoAux.nitCliente,
            pedidoAux.total,
            pedidoAux.descuento,
            pedidoAux.totalFinal
            ,detalle,
            `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
          );

          this.transaccionS.addTransaccion(transaccion).then(() => {
            console.log("transaccion exitosa");
            //cerramos modal
            this.cerrarModalVentaExitosa.nativeElement.click();
            this.generarPDFCobro(transaccion, pedidoAux);
          })
            .catch((error) => ("fallo en la transaccion" + error));
        }).catch((error) => console.log("fallo venta exitosa" + error))
      } else {
        console.log("Fallo en la conexion de internet");

      }
    }, 1200);
  }




  generarPDFCobro(transaccion:Transaccion, pedido:Pedido) {

    this.pdf.setFontSize(30);
    this.pdf.text(85, 30, "Transacción ");
    this.pdf.rect(30, 35, 150, 2);
    this.pdf.setFontSize(20);
    this.pdf.text(30, 45, `ID Vendedor:  ${transaccion.idUser}`);
    this.pdf.text(30, 55, `Nombre Cliente:  ${transaccion.nombreCliente}`);
    this.pdf.text(30, 65, `NIT Clliente:   ${transaccion.nitCliente}`);


    this.pdf.text(30, 75, `Total Inicial: ${transaccion.totalAnterior}`);
    this.pdf.text(30, 85, `Porcentaje Descuento: ${transaccion.porcentajeDescuento}%`);
    this.pdf.text(30, 95, `Total Final:${transaccion.totalFinal}`);
    this.pdf.text(30, 105, `Detalle de la compra: ${transaccion.detalle}`);
    this.pdf.text(30, 115, `Fecha de la compra: ${transaccion.date}`);


    this.pdf.text(30, 125, `Productos del Pedido: `);
    this.pdf.text(45, 135, "Producto: ");
    this.pdf.text(120, 130, "Cantidad: ");

    let distancia: number = 140;
    this.pedido.despachoItems.forEach((despacho: DespachoItems) => {
      this.pdf.setFontSize(15);
      this.pdf.text(52, distancia, `${despacho.item.nombre}`);
      this.pdf.text(130, distancia, `${despacho.item.cantidad}`);
      distancia += 7;
    });

    
    this.pdf.save(`Transaccion_Nit_Cliente_${this.pedido.nitCliente}.pdf`);



  }

}
