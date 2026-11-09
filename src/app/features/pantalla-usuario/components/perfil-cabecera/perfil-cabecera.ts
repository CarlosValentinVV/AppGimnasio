import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Usuario } from '../../models/usuario.models';

@Component({
  selector: 'app-perfil-cabecera',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './perfil-cabecera.html',
  styleUrl: './perfil-cabecera.css',
})
export class PerfilCabecera {
  readonly usuario = input.required<Usuario>();
  readonly modoOscuro = input.required<boolean>();
  readonly porcentajeNivel = input.required<number>();

  readonly cambiarTema = output<void>();
  readonly editar = output<void>();
}
