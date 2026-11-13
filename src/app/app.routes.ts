import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home';
import { Login } from './features/login/login';
import { PantallaUsuario } from './features/pantalla-usuario/pages/pantalla-usuario';

/**
 * Definición de las rutas de la aplicación.
 *
 * - `/` muestra la página de inicio.
 * - `/perfil` muestra el perfil del usuario.
 * - `/login` muestra el acceso y el registro.
 * - Cualquier ruta desconocida redirige a la página de inicio.
 *
 * @author Todo el equipo
 * @version 1.0
 */
export const routes: Routes = [
  // Ruta principal: página de inicio.
  { path: '', component: HomeComponent },
  // Perfil del usuario autenticado.
  { path: 'perfil', component: PantallaUsuario },
  // Acceso y registro de usuarios.
  { path: 'login', component: Login },
  // Ruta comodín: cualquier URL desconocida vuelve al inicio.
  { path: '**', component: HomeComponent },
];
