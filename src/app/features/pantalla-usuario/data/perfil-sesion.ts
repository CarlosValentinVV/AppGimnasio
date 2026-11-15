import type { UsuarioPublico } from '../../../core/auth/autenticacion.model';
import type { DatoPersonal, PantallaUsuarioData, Usuario } from '../models/usuario.models';
import { DATOS_PANTALLA_USUARIO } from './usuario.data';

/**
 * Adapta los datos de ejemplo del perfil al usuario que tiene la sesión abierta.
 *
 * El perfil reutiliza las estadísticas, los logros y la membresía de ejemplo,
 * pero el nombre, las iniciales, el correo y la fecha de nacimiento se toman
 * del usuario autenticado para que cada persona vea sus propios datos.
 *
 * @author Izan García Iglesias
 * @version 1.0
 */

/** Meses del año en español, usados al formatear la fecha de nacimiento. */
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** Etiqueta del dato personal que muestra el nombre completo. */
const ETIQUETA_NOMBRE = 'Nombre completo';

/** Etiqueta del dato personal que muestra el correo electrónico. */
const ETIQUETA_EMAIL = 'Email';

/** Etiqueta del dato personal que muestra la fecha de nacimiento. */
const ETIQUETA_NACIMIENTO = 'Fecha de nacimiento';

/**
 * Convierte una fecha `AAAA-MM-DD` en un texto como `15 de marzo de 1998`.
 *
 * @param fechaISO Fecha en formato ISO corto.
 * @returns La fecha escrita en español; el texto original si no es válida.
 */
export function formatearFechaLarga(fechaISO: string): string {
  // Separa el año, el mes y el día de la fecha.
  const [anio, mes, dia] = fechaISO.split('-');
  // Traduce el número de mes a su nombre en español.
  const nombreMes = MESES[Number(mes) - 1];

  // Si la fecha no tiene el formato esperado, se devuelve tal cual.
  if (!anio || !nombreMes || !dia) {
    return fechaISO;
  }

  // Compone el texto final sin ceros a la izquierda en el día.
  return `${Number(dia)} de ${nombreMes} de ${anio}`;
}

/**
 * Obtiene las iniciales del nombre: la primera letra del nombre y del apellido.
 *
 * @param nombre Nombre completo de la persona.
 * @returns Una o dos letras en mayúscula; cadena vacía si no hay nombre.
 */
export function calcularIniciales(nombre: string): string {
  // Divide el nombre por los espacios y descarta los fragmentos vacíos.
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);

  // Sin palabras no hay iniciales que mostrar.
  if (palabras.length === 0) {
    return '';
  }

  // Con un solo nombre basta su primera letra.
  if (palabras.length === 1) {
    return palabras[0].charAt(0).toUpperCase();
  }

  // Con nombre y apellido se usan las dos primeras iniciales.
  return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase();
}

/**
 * Construye los datos de la pantalla de perfil para el usuario de la sesión.
 *
 * @param sesion Usuario autenticado, o `null` si no hay sesión abierta.
 * @param base Datos de partida; por defecto, los de ejemplo del módulo.
 * @returns Los datos del perfil con la identidad del usuario de la sesión.
 */
export function construirPerfilDeUsuario(
  sesion: UsuarioPublico | null,
  base: PantallaUsuarioData = DATOS_PANTALLA_USUARIO,
): PantallaUsuarioData {
  // Sin sesión se mantienen los datos de ejemplo. El guard de la ruta impide
  // llegar al perfil en ese caso, así que solo es una salvaguarda.
  if (!sesion) {
    return base;
  }

  // Sustituye el nombre y las iniciales de la cabecera.
  const usuario: Usuario = {
    ...base.usuario,
    nombre: sesion.nombre,
    iniciales: calcularIniciales(sesion.nombre),
  };

  // Reemplaza los datos personales que aporta el registro.
  const datosPersonales: DatoPersonal[] = base.datosPersonales.map((dato) => {
    switch (dato.etiqueta) {
      case ETIQUETA_NOMBRE:
        return { ...dato, valor: sesion.nombre };
      case ETIQUETA_EMAIL:
        return { ...dato, valor: sesion.email };
      case ETIQUETA_NACIMIENTO:
        return { ...dato, valor: formatearFechaLarga(sesion.fechaNacimiento) };
      default:
        return dato;
    }
  });

  // Devuelve el conjunto completo con la identidad ya actualizada.
  return { ...base, usuario, datosPersonales };
}
