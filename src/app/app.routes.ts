import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { PantallaUsuario } from './features/pantalla-usuario/pantalla-usuario';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'perfil', component: PantallaUsuario },
];
