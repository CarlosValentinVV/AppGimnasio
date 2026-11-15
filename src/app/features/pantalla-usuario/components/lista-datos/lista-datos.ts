import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DatoPersonal } from '../../models/usuario.models';

/**
 * Lista de datos personales del usuario.
 *
 * Muestra cada dato con su etiqueta y valor en formato de lista de definición.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */
@Component({
  // Selector usado en la plantilla del perfil.
  selector: 'app-lista-datos',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML de la lista de datos.
  templateUrl: './lista-datos.html',
  // Hoja de estilos de la lista de datos.
  styleUrl: './lista-datos.css',
})
export class ListaDatos {
  /** Datos personales que se muestran en la lista. */
  readonly datos = input.required<DatoPersonal[]>();
}
