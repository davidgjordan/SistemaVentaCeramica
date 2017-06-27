import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Cliente } from "../../models/Cliente";

@Injectable()

export class ClienteService {

    private clientePath: FirebaseListObservable<Cliente[]>;

    constructor(private db: AngularFireDatabase) {
        this.clientePath = db.list("/clientes");
    }


    public addCliente(cliente: Cliente) {


        const r = this.db.list("/clientes/", {
            query: {
                orderByChild: 'nit',
                equalTo: cliente.nit,
            }
        });
        r.subscribe((listaClientesNit) => {
            if (listaClientesNit.length < 1) {
                console.log("cliente pusheando");
                return this.clientePath.push(cliente);
            }else{
                console.log("Cliente nada");                
                return;
            }
        });


    }



    public getAllCliente() {
        return this.clientePath;
    }


}