import { Item } from "./Item";
import { DespachoItems } from "./Despacho";

export class Pedido{

    constructor( public    idUser:string,
                 public     nombreCliente 
                , public  nitCliente:number
                , public  despachoItems:DespachoItems[]
                , public  total:number
                , public   descuento:number
                , public totalFinal:number
                , public  despachoExitoso:boolean
                , public   ventaExitosa:boolean
                , public  borrado:boolean){

    }  

}