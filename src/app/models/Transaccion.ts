export class Transaccion{

    constructor(private idTransaccion:string
                , private idPedido:string
                , private idUser:string 
                , private nitCliente:string
                , private detalle:string
                , private date:Date){

    }
    public getIdTransaccion() : string {
        return this.idTransaccion;
    }
    public getIdPedido() : string {
        return this.idPedido;
    }
    
    public getIdUsero() : string {
        return this.idUser;
    }
    public getNitCliente() : string {
        return this.nitCliente;
    }
    public getDetalle() : string {
        return this.detalle;
    }
    
    public getDate() : string {
        let date:Date = new Date();
        let res: string = `Año: ${date.getFullYear()}
                           Mes: ${date.getMonth()+1}
                           Dia: ${date.getDate()}
                           Hora: ${date.getHours()}`;
        return res;
    }

}