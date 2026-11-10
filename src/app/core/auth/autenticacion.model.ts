/** Datos que introduce la persona en el formulario de registro (sin los campos de confirmación). */
export interface DatosRegistro {
  nombre: string;
  email: string;
  fechaNacimiento: string; // formato AAAA-MM-DD
  password: string;
}

/** Datos del usuario que la aplicación puede mostrar. Nunca incluye la contraseña ni su hash. */
export interface UsuarioPublico {
  nombre: string;
  email: string;
  fechaNacimiento: string;
}

/**
 * Contrato que debe cumplir cualquier sistema de autenticación de la aplicación.
 * Es asíncrono (Promise) para que valga igual con localStorage, una API REST o Firebase.
 * Los componentes dependen de este contrato, nunca de una implementación concreta.
 */
export interface ServicioAutenticacion {
  registrar(datos: DatosRegistro): Promise<UsuarioPublico>;
  iniciarSesion(email: string, password: string): Promise<UsuarioPublico>;
  cerrarSesion(): void;
  usuarioActual(): UsuarioPublico | null;
}

export type CodigoErrorAutenticacion =
  | 'EMAIL_YA_REGISTRADO'
  | 'CREDENCIALES_INVALIDAS'
  | 'ENTORNO_NO_SEGURO';

/** Error con un mensaje pensado para mostrarse en pantalla. */
export class ErrorAutenticacion extends Error {
  constructor(
    readonly codigo: CodigoErrorAutenticacion,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'ErrorAutenticacion';
  }
}
