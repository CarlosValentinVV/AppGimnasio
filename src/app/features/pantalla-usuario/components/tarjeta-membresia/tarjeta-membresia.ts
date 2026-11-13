import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Membresia } from '../../models/usuario.models';

/**
 * Tarjeta de la membresía activa del usuario.
 *
 * Muestra el plan contratado, la antigüedad como miembro y el estado de la
 * membresía, con una acción para gestionarla.
 *
 * @author raulmoron
 * @version 1.0
 */
@Component({
  // Selector usado en la plantilla del perfil.
  selector: 'app-tarjeta-membresia',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML de la tarjeta de membresía.
  templateUrl: './tarjeta-membresia.html',
  // Hoja de estilos de la tarjeta de membresía.
  styleUrl: './tarjeta-membresia.css',
})
export class TarjetaMembresia {
  /** Nombre del plan de membresía contratado. */
  readonly plan = input.required<string>();
  /** Fecha en la que el usuario se hizo miembro. */
  readonly miembroDesde = input.required<string>();
  /** Detalles de la membresía activa. */
  readonly membresia = input.required<Membresia>();

  /** Se emite al pulsar el botón de gestión de la membresía. */
  readonly gestionar = output<void>();
}
