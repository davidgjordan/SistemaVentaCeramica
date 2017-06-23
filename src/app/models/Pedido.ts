import { Item } from "./Item";
import { DespachoItems } from "./Despacho";

export class Pedido{

    constructor(public    idUser:string 
                , public  nitCliente:string
                , public  despachoItems:DespachoItems[]
                , public  total:number
                , public  exitoso:boolean
                , public  borrado?:boolean){

    }  

}