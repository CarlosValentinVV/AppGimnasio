import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Usuario } from '../../models/usuario.models';

/**
 * Cabecera del perfil del usuario.
 *
 * Muestra el avatar, los datos principales, el progreso de nivel y los
 * botones para cambiar de tema o editar el perfil.
 *
 * @author raulmoron
 * @version 1.0
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
  /** Indica si el modo oscuro está activo. */
  readonly modoOscuro = input.required<boolean>();
  /** Porcentaje de progreso hacia el siguiente nivel. */
  readonly porcentajeNivel = input.required<number>();

  /** Se emite al pulsar el botón de cambio de tema. */
  readonly cambiarTema = output<void>();
  /** Se emite al pulsar el botón de edición del perfil. */
  readonly editar = output<void>();
}
