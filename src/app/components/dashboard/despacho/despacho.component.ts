import { Component, OnInit } from '@angular/core';
//servicios
import { PedidoService } from "../../../services/firebase-service/pedido.service";
//models
import { Pedido } from "../../../models/Pedido";
@Component({
  selector: 'app-despacho',
  templateUrl: './despacho.component.html',
  providers: [PedidoService]
})
export class DespachoComponent implements OnInit {
  private listaPedidos: Pedido[] = [];
  constructor(private pedidoS: PedidoService) { }

  ngOnInit() {
    this.pedidoS.getAllPedido().subscribe((pedidos: Pedido[]) => {
      this.listaPedidos = pedidos;
    });
  }

  aprobarPedido(pedidokey: string, despacho: boolean) {
    let pedidoAux: Pedido;
    this.pedidoS.getPedido(pedidokey).subscribe((pedido) => {
      pedidoAux = pedido;
    });
    setTimeout(() => {
      pedidoAux.despachoExitoso = despacho;
      this.pedidoS.updatePedido(pedidokey, pedidoAux).then(() => console.log("Pedido Exitoso")).catch((error) => console.log("error actualiozacion pedido" + error));
    }, 1100);
  }

  eliminarPedido(pedidoKey: string) {
    let pedidAux: Pedido;
    this.pedidoS.getPedido(pedidoKey).subscribe((pedido) => {
      pedidAux = pedido;
    });
    setTimeout(() => {
      pedidAux.despachoExitoso = false;
      pedidAux.borrado = true;

      this.pedidoS.cancelarPedido(pedidAux.despachoItems);
      this.pedidoS.updatePedido(pedidoKey, pedidAux).then(() => console.log("Pedido Exitoso")).catch((error) => console.log("error actualiozacion pedido" + error));


    }, 1100);

  }

}
