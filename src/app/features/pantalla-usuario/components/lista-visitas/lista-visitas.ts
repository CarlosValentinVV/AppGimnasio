import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { VisitaReciente } from '../../models/usuario.models';

/**
 * Lista de las visitas más recientes al gimnasio.
 *
 * Presenta cada visita con su fecha, hora y actividad realizada.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */
@Component({
  // Selector usado en la plantilla del perfil.
  selector: 'app-lista-visitas',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML de la lista de visitas.
  templateUrl: './lista-visitas.html',
  // Hoja de estilos de la lista de visitas.
  styleUrl: './lista-visitas.css',
})
export class ListaVisitas {
  /** Visitas recientes que se muestran en la lista. */
  readonly visitas = input.required<VisitaReciente[]>();
}
