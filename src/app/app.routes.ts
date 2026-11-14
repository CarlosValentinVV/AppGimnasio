import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home';
import { Login } from './features/login/login';
import { PantallaUsuario } from './features/pantalla-usuario/pages/pantalla-usuario';

/**
 * Definición de las rutas de la aplicación.
 *
 * - `/` redirige a `/home`.
 * - `/home` muestra la página de inicio.
 * - `/perfil` muestra el perfil del usuario.
 * - `/login` muestra el acceso y el registro.
 * - Cualquier ruta desconocida redirige a la página de inicio.
 *
 * @author Todo el equipo
 * @version 1.1
 */
export const routes: Routes = [
  // Ruta raíz: redirige a la página de inicio.
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Página de inicio.
  { path: 'home', component: HomeComponent },
  // Perfil del usuario autenticado.
  { path: 'perfil', component: PantallaUsuario },
  // Acceso y registro de usuarios.
  { path: 'login', component: Login },
  // Ruta comodín: cualquier URL desconocida vuelve al inicio.
  { path: '**', redirectTo: 'home' }
];
