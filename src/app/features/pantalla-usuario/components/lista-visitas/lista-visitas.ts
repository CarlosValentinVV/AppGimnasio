import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { VisitaReciente } from '../../models/usuario.models';

@Component({
  selector: 'app-lista-visitas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-visitas.html',
  styleUrl: './lista-visitas.css',
})
export class ListaVisitas {
  readonly visitas = input.required<VisitaReciente[]>();
}
