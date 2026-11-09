import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EstadisticaUsuario } from '../../models/usuario.models';

@Component({
  selector: 'app-estadisticas-perfil',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './estadisticas-perfil.html',
  styleUrl: './estadisticas-perfil.css',
})
export class EstadisticasPerfil {
  readonly estadisticas = input.required<EstadisticaUsuario[]>();
}
