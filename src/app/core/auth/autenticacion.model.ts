/**
 * Modelos y contrato del sistema de autenticación.
 *
 * Define los datos que intercambian los formularios y el servicio, además del
 * error tipado que se muestra al usuario.
 *
 * @author raulmoron
 * @version 1.0
 */

/** Datos que introduce la persona en el formulario de registro (sin los campos de confirmación). */
export interface DatosRegistro {
  /** Nombre completo del usuario. */
  nombre: string;
  /** Correo electrónico usado como identificador de la cuenta. */
  email: string;
  /** Fecha de nacimiento en formato `AAAA-MM-DD`. */
  fechaNacimiento: string;
  /** Contraseña en texto plano; el servicio se encarga de derivar su hash. */
  password: string;
}

/** Datos del usuario que la aplicación puede mostrar. Nunca incluye la contraseña ni su hash. */
export interface UsuarioPublico {
  /** Nombre completo del usuario. */
  nombre: string;
  /** Correo electrónico de la cuenta. */
  email: string;
  /** Fecha de nacimiento en formato `AAAA-MM-DD`. */
  fechaNacimiento: string;
}

/**
 * Contrato que debe cumplir cualquier sistema de autenticación de la aplicación.
 *
 * Es asíncrono (`Promise`) para que valga igual con `localStorage`, una API REST
 * o Firebase. Los componentes dependen de este contrato, nunca de una
 * implementación concreta.
 */
export interface ServicioAutenticacion {
  /** Crea una cuenta nueva y devuelve sus datos públicos. */
  registrar(datos: DatosRegistro): Promise<UsuarioPublico>;

  /** Comprueba las credenciales, abre la sesión y devuelve el usuario. */
  iniciarSesion(email: string, password: string): Promise<UsuarioPublico>;

  /** Cierra la sesión activa, si existe. */
  cerrarSesion(): void;

  /** Devuelve el usuario de la sesión activa o `null` si no hay sesión. */
  usuarioActual(): UsuarioPublico | null;
}

/** Códigos internos de error que puede emitir el servicio de autenticación. */
export type CodigoErrorAutenticacion =
  // El correo ya pertenece a una cuenta registrada.
  | 'EMAIL_YA_REGISTRADO'
  // El correo o la contraseña no coinciden con ningún usuario.
  | 'CREDENCIALES_INVALIDAS'
  // El navegador no expone Web Crypto (contexto no seguro).
  | 'ENTORNO_NO_SEGURO';

/**
 * Error de autenticación con un mensaje pensado para mostrarse en pantalla.
 *
 * @author raulmoron
 * @version 1.0
 */
export class ErrorAutenticacion extends Error {
  /**
   * @param codigo Código interno que identifica la causa del error.
   * @param mensaje Mensaje legible para el usuario.
   */
  constructor(
    // Código que permite distinguir el tipo de fallo sin analizar el texto.
    readonly codigo: CodigoErrorAutenticacion,
    // Mensaje que se muestra directamente en la interfaz.
    mensaje: string,
  ) {
    // Inicializa la clase base `Error` con el mensaje recibido.
    super(mensaje);
    // Fija el nombre para que el error sea identificable en la consola.
    this.name = 'ErrorAutenticacion';
  }
}
