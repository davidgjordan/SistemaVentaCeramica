// app/auth.service.ts

import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';


// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {

  opciones: Object;


  userProfile: Object = {
    allowedConnections: ["Username-Password-Authentication"],
    rememberLastLogin: false,
    socialButtonStyle: "small",
    theme: { "primaryColor": "#3499D8" },
    languageDictionary: { "title": "Ceramicas Bol" },
    language: "es",
    additionalSignUpFields: [{
      name: "tipoUser",
      placeholder: "ingrese el tipo de usuario",
      //icon: "../../assets/img/planeacion.jpg",
      validator: function (direccion) {
        return {
          valid: direccion.length >= 3,
          hint: "la direcion debe ser mayor a 10 caracteres"
        };
      }
    },
    //{
    //  name: "full_name",
    //  placeholder: "ingrese su nombre"
    //},
    {
     name: "apodo",
      placeholder: "ingrese su nombre"
    }]
  }

  // Configure Auth0
  lock = new Auth0Lock('516eOEjvKacxWNLD6BcAC4GYgoOhzCbg', 'davidgjcbba.auth0.com', this.userProfile);






  constructor(private router: Router) {
    // Add callback for lock `authenticated` event
    this.lock.on("authenticated", (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      // Fetch profile information obetenmos y lo almacenamos en local storag
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }

        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
      });

    });
  }


  //metodo q devuleve la informacion del perfil
  public getProfile() {
    if (this.authenticated()) {
      //retornamos un objeto en json
      return JSON.parse(localStorage.getItem('profile'));
    } else {
      //si no retornas un objeto vacio
      return {};
    }
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired('id_token');
  }

  public logout() {

    //acemos algo cuando la persona  llame a esta funcion le redirigimos a a la pagina loguin
    //principalmente tenemos q remover el token
    this.router.navigate(['/home']);

    // Remove token from localStorage
    localStorage.removeItem('id_token');

    //tambien removemos el profile
    localStorage.removeItem('profile');


  }
}
