import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { Logro } from '../../models/usuario.models';

/**
 * Lista de logros del usuario.
 *
 * Distingue los logros conseguidos de los pendientes y cuenta cuántos se han
 * desbloqueado.
 *
 * @author Carlos Valentin Santamaria
 * @version 1.0
 */
@Component({
  // Selector usado en la plantilla del perfil.
  selector: 'app-lista-logros',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Plantilla HTML de la lista de logros.
  templateUrl: './lista-logros.html',
  // Hoja de estilos de la lista de logros.
  styleUrl: './lista-logros.css',
})
export class ListaLogros {
  /** Logros disponibles con su estado de consecución. */
  readonly logros = input.required<Logro[]>();

  /** Número de logros ya conseguidos. */
  readonly logrosConseguidos = computed(
    // Filtra los logros conseguidos y cuenta cuántos hay.
    () => this.logros().filter((logro) => logro.conseguido).length,
  );
}
