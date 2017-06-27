import { Injectable } from "@angular/core";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Transaccion } from "../../models/Transaccion";


@Injectable()
export class TransaccionService {
    private transaccionPath: FirebaseListObservable<Transaccion[]>;

    constructor(private db: AngularFireDatabase) {
        this.transaccionPath = db.list('/transacciones/');
    }

    public addTransaccion(transaccion: Transaccion) {
        return this.transaccionPath.push(transaccion);
    }

    public updateTransacciones(transaccionKey: string, newTransaccion: Transaccion) {
        return this.transaccionPath.update(transaccionKey, newTransaccion);
    }

    public getTransaccionPorNit(nitCliente: number) {
        const transacciones = this.db.list('/transacciones', {
            query: {
                orderByChild: 'nitCliente',
                equalTo: nitCliente
            }
        });
        return transacciones;
    }


}