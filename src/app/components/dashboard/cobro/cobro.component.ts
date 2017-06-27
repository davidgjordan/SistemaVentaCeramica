import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//services
import { PedidoService } from "../../../services/firebase-service/pedido.service";
import { TransaccionService } from "../../../services/firebase-service/transacciones.service";
//models
import { Transaccion } from "../../../models/Transaccion";
import { Pedido } from "../../../models/Pedido";
import { DespachoItems } from "../../../models/Despacho";


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
          })
            .catch((error) => ("fallo en la transaccion" + error));
        }).catch((error) => console.log("fallo venta exitosa" + error))
      } else {
        console.log("Fallo en la conexion de internet");

      }
    }, 1200);
  }

}
