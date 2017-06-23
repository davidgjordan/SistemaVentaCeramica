
export class Item{




    constructor( public  nombre:string
                ,public  precio:number 
                ,public   alto:number
                ,public   ancho:number
                ,public   cantidad:number
                ,public   descripcion:string
                ,public   tipoAlmacen?:string
                ,public  imagen?:string
                ,public  borrado?:boolean){

    }
    
}
