import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EstadisticaUsuario } from '../../models/usuario.models';

/**
 * Rejilla de tarjetas con las estadísticas principales del perfil.
 *
 * Recibe una lista de métricas ya calculadas y las presenta visualmente.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */
@Component({
  // Selector usado en la plantilla del perfil.
  selector: 'app-estadisticas-perfil',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML de la rejilla de estadísticas.
  templateUrl: './estadisticas-perfil.html',
  // Hoja de estilos de la rejilla de estadísticas.
  styleUrl: './estadisticas-perfil.css',
})
export class EstadisticasPerfil {
  /** Estadísticas que se muestran en la rejilla. */
  readonly estadisticas = input.required<EstadisticaUsuario[]>();
}
