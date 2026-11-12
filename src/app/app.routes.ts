import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { Login } from './features/login/login';
import { PantallaUsuario } from './features/pantalla-usuario/pages/pantalla-usuario';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'perfil', component: PantallaUsuario },
  { path: 'login', component: Login },
  { path: '**', component: HomeComponent },
];
