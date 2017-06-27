export class Transaccion{

    constructor(public  idPedido:string
                , public  idUser:string
                , public  nombreCliente:string
                , public  nitCliente:string
                , public totalAnterior:number
                ,public porcentajeDescuento:number
                ,public totalFinal:number
                , public  detalle:string
                , public  date:string){

    }
    

}