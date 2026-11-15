import { DATOS_PANTALLA_USUARIO } from './usuario.data';
import { calcularIniciales, construirPerfilDeUsuario, formatearFechaLarga } from './perfil-sesion';

/** Pruebas de la adaptación del perfil a los datos del usuario autenticado. */
describe('perfil-sesion', () => {
  describe('formatearFechaLarga', () => {
    it('debe escribir la fecha en español', () => {
      // El formato ISO corto se convierte al texto habitual en España.
      expect(formatearFechaLarga('1998-03-15')).toBe('15 de marzo de 1998');
    });

    it('debe devolver el texto original si la fecha no es válida', () => {
      // Una cadena sin el formato esperado no se altera.
      expect(formatearFechaLarga('sin-fecha')).toBe('sin-fecha');
    });
  });

  describe('calcularIniciales', () => {
    it('debe usar la primera letra del nombre y del primer apellido', () => {
      // Con nombre y dos apellidos se toman las dos primeras iniciales.
      expect(calcularIniciales('Izan García Iglesias')).toBe('IG');
    });

    it('debe usar una sola letra cuando solo hay un nombre', () => {
      // Sin apellidos solo se puede mostrar una inicial.
      expect(calcularIniciales('Madonna')).toBe('M');
    });

    it('debe devolver una cadena vacía si no hay nombre', () => {
      // Un nombre vacío no produce iniciales.
      expect(calcularIniciales('   ')).toBe('');
    });
  });

  describe('construirPerfilDeUsuario', () => {
    it('debe sustituir la identidad por la del usuario de la sesión', () => {
      // Perfil generado a partir de una sesión de prueba.
      const perfil = construirPerfilDeUsuario({
        nombre: 'Izan García Iglesias',
        email: 'izan@ejemplo.com',
        fechaNacimiento: '1998-03-15',
      });

      // La cabecera muestra el nombre y las iniciales del usuario.
      expect(perfil.usuario.nombre).toBe('Izan García Iglesias');
      expect(perfil.usuario.iniciales).toBe('IG');

      // Los datos personales se actualizan con los del registro.
      const valores = perfil.datosPersonales.map((dato) => dato.valor);
      expect(valores).toContain('Izan García Iglesias');
      expect(valores).toContain('izan@ejemplo.com');
      expect(valores).toContain('15 de marzo de 1998');
    });

    it('debe conservar las estadísticas y la membresía de ejemplo', () => {
      // Perfil generado a partir de una sesión de prueba.
      const perfil = construirPerfilDeUsuario({
        nombre: 'Izan García Iglesias',
        email: 'izan@ejemplo.com',
        fechaNacimiento: '1998-03-15',
      });

      // El resto de secciones no depende del registro y se mantiene igual.
      expect(perfil.estadisticas).toEqual(DATOS_PANTALLA_USUARIO.estadisticas);
      expect(perfil.membresia).toEqual(DATOS_PANTALLA_USUARIO.membresia);
    });

    it('debe devolver los datos de ejemplo si no hay sesión', () => {
      // Sin sesión se mantiene el perfil de partida.
      expect(construirPerfilDeUsuario(null)).toBe(DATOS_PANTALLA_USUARIO);
    });
  });
});
