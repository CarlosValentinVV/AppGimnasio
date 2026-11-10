import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ThemeService } from '../../../shared/services/theme.service';
import { AnilloObjetivo } from '../components/anillo-objetivo/anillo-objetivo';
import { EstadisticasPerfil } from '../components/estadisticas-perfil/estadisticas-perfil';
import { GraficoAsistencia } from '../components/grafico-asistencia/grafico-asistencia';
import { ListaDatos } from '../components/lista-datos/lista-datos';
import { ListaLogros } from '../components/lista-logros/lista-logros';
import { ListaVisitas } from '../components/lista-visitas/lista-visitas';
import { PerfilCabecera } from '../components/perfil-cabecera/perfil-cabecera';
import { TarjetaMembresia } from '../components/tarjeta-membresia/tarjeta-membresia';
import datosPantalla from '../data/usuario.json';
import {
  AsistenciaDia,
  DatoPersonal,
  EstadisticaUsuario,
  Logro,
  Membresia,
  ObjetivoMensual,
  PantallaUsuarioData,
  Pestana,
  Usuario,
  VisitaReciente,
} from '../models/usuario.models';

@Component({
  selector: 'app-pantalla-usuario',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AnilloObjetivo,
    EstadisticasPerfil,
    GraficoAsistencia,
    ListaDatos,
    ListaLogros,
    ListaVisitas,
    PerfilCabecera,
    TarjetaMembresia,
  ],
  templateUrl: './pantalla-usuario.html',
  styleUrl: './pantalla-usuario.css',
  host: {
    '[class.modo-oscuro]': 'isDarkMode()',
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class PantallaUsuario {
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode = this.themeService.isDarkMode;
  readonly pestanaActiva = signal<Pestana>('resumen');
  readonly porcentajeNivel = computed(() => {
    const siguiente = this.usuario().puntosSiguienteNivel;
    if (!siguiente) return 0;
    return Math.round((this.usuario().puntosNivel / siguiente) * 100);
  });
  // Ajuste para importar JSON correctamente en entornos modernos
  private readonly datos: PantallaUsuarioData = datosPantalla as unknown as PantallaUsuarioData;
  readonly usuario = signal<Usuario>(this.datos.usuario);
  readonly estadisticas = signal<EstadisticaUsuario[]>(this.datos.estadisticas);
  readonly asistenciasSemana = signal<AsistenciaDia[]>(this.datos.asistenciasSemana);
  readonly objetivo = signal<ObjetivoMensual>(this.datos.objetivoMensual);
  readonly visitasRecientes = signal<VisitaReciente[]>(this.datos.visitasRecientes);
  readonly logros = signal<Logro[]>(this.datos.logros);
  readonly datosPersonales = signal<DatoPersonal[]>(this.datos.datosPersonales);
  readonly membresia = signal<Membresia>(this.datos.membresia);

  setPestana(pestana: Pestana): void {
    this.pestanaActiva.set(pestana);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
