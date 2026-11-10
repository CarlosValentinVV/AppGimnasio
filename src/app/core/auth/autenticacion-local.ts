import {
  DatosRegistro,
  ErrorAutenticacion,
  ServicioAutenticacion,
  UsuarioPublico,
} from './autenticacion.model';

/** Lo que realmente se guarda en localStorage: nunca la contraseña, solo su hash. */
interface UsuarioGuardado extends UsuarioPublico {
  sal: string;
  hashPassword: string;
  iteraciones: number;
}

const CLAVE_USUARIOS = 'app.usuarios';
const CLAVE_SESION = 'app.sesion';
const ITERACIONES = 100_000;

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

function aHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function aBytes(hex: string) {
  return Uint8Array.from(hex.match(/.{2}/g) ?? [], (h) => parseInt(h, 16));
}

/** Calcula el hash de la contraseña con PBKDF2 (Web Crypto). Solo funciona en localhost o HTTPS. */
async function derivarHash(
  password: string,
  sal: BufferSource,
  iteraciones: number,
): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new ErrorAutenticacion(
      'ENTORNO_NO_SEGURO',
      'Este navegador no permite el cifrado necesario. Abre la aplicación desde localhost o con HTTPS.',
    );
  }
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: iteraciones },
    material,
    256,
  );
  return aHex(new Uint8Array(bits));
}

/**
 * Implementación de práctica: guarda los usuarios en el navegador (localStorage).
 * Sirve para aprender el flujo registro -> login, pero NO es segura:
 * cualquiera con las herramientas de desarrollo puede ver y modificar los datos.
 */
export class AutenticacionLocal implements ServicioAutenticacion {
  async registrar(datos: DatosRegistro): Promise<UsuarioPublico> {
    const email = normalizarEmail(datos.email);

    const sal = crypto.getRandomValues(new Uint8Array(16));
    const hashPassword = await derivarHash(datos.password, sal, ITERACIONES);

    // Lectura, comprobación y escritura juntas (sin await entre medias).
    const usuarios = this.leerUsuarios();
    if (usuarios.some((u) => u.email === email)) {
      throw new ErrorAutenticacion(
        'EMAIL_YA_REGISTRADO',
        'Ya existe una cuenta con ese correo electrónico.',
      );
    }

    const nuevo: UsuarioGuardado = {
      nombre: datos.nombre.trim(),
      email,
      fechaNacimiento: datos.fechaNacimiento,
      sal: aHex(sal),
      hashPassword,
      iteraciones: ITERACIONES,
    };
    usuarios.push(nuevo);
    this.guardarUsuarios(usuarios);

    return this.aPublico(nuevo);
  }

  async iniciarSesion(email: string, password: string): Promise<UsuarioPublico> {
    const correo = normalizarEmail(email);
    const usuario = this.leerUsuarios().find((u) => u.email === correo);
    const errorCredenciales = new ErrorAutenticacion(
      'CREDENCIALES_INVALIDAS',
      'Correo o contraseña incorrectos.',
    );

    if (!usuario) {
      throw errorCredenciales;
    }

    const hash = await derivarHash(password, aBytes(usuario.sal), usuario.iteraciones);
    if (hash !== usuario.hashPassword) {
      throw errorCredenciales;
    }

    const publico = this.aPublico(usuario);
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(publico));
    return publico;
  }

  cerrarSesion(): void {
    sessionStorage.removeItem(CLAVE_SESION);
  }

  usuarioActual(): UsuarioPublico | null {
    try {
      const texto = sessionStorage.getItem(CLAVE_SESION);
      return texto ? (JSON.parse(texto) as UsuarioPublico) : null;
    } catch {
      return null;
    }
  }

  private leerUsuarios(): UsuarioGuardado[] {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) ?? '[]');
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }

  private guardarUsuarios(usuarios: UsuarioGuardado[]): void {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  }

  private aPublico(usuario: UsuarioGuardado): UsuarioPublico {
    return {
      nombre: usuario.nombre,
      email: usuario.email,
      fechaNacimiento: usuario.fechaNacimiento,
    };
  }
}
