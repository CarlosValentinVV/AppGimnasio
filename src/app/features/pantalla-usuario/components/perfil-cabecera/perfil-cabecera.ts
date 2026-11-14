import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Usuario } from '../../models/usuario.models';

/**
 * Cabecera del perfil del usuario.
 *
 * Muestra el avatar, los datos principales y el progreso de nivel.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.1
 */
@Component({
  // Selector usado en la plantilla del perfil.
  selector: 'app-perfil-cabecera',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML de la cabecera del perfil.
  templateUrl: './perfil-cabecera.html',
  // Hoja de estilos de la cabecera del perfil.
  styleUrl: './perfil-cabecera.css',
})
export class PerfilCabecera {
  /** Datos del usuario que se muestran en la cabecera. */
  readonly usuario = input.required<Usuario>();
  /** Porcentaje de progreso hacia el siguiente nivel. */
  readonly porcentajeNivel = input.required<number>();
}
