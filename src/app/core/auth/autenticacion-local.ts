import { DatosRegistro, ErrorAutenticacion, ServicioAutenticacion, UsuarioPublico } from './autenticacion.model';

/**
 * Estructura que realmente se guarda en `localStorage` por cada usuario.
 *
 * Nunca incluye la contraseña en texto plano, solo su sal y su hash derivado
 * con PBKDF2.
 */
interface UsuarioGuardado extends UsuarioPublico {
  /** Sal aleatoria en hexadecimal usada al derivar el hash. */
  sal: string;
  /** Hash PBKDF2 de la contraseña en hexadecimal. */
  hashPassword: string;
  /** Número de iteraciones empleadas al generar el hash. */
  iteraciones: number;
}

/** Clave de `localStorage` donde se guarda la lista de usuarios. */
const CLAVE_USUARIOS = 'app.usuarios';

/** Clave de `sessionStorage` donde se guarda la sesión activa. */
const CLAVE_SESION = 'app.sesion';

/** Número de iteraciones de PBKDF2; un valor alto dificulta los ataques por fuerza bruta. */
const ITERACIONES = 100_000;

/**
 * Normaliza un correo electrónico para compararlo de forma consistente.
 *
 * @param email Correo introducido por el usuario.
 * @returns El correo sin espacios y en minúsculas.
 */
function normalizarEmail(email: string): string {
  // Elimina los espacios de los extremos y pasa todo a minúsculas.
  return email.trim().toLowerCase();
}

/**
 * Convierte un array de bytes en una cadena hexadecimal.
 *
 * @param bytes Bytes a convertir.
 * @returns Representación hexadecimal en minúsculas.
 */
function aHex(bytes: Uint8Array): string {
  // Convierte cada byte a hexadecimal de dos dígitos y los une en una sola cadena.
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Convierte una cadena hexadecimal en un array de bytes.
 *
 * Se reserva un `ArrayBuffer` propio para que el resultado sea compatible con
 * `BufferSource` en las versiones modernas de TypeScript.
 *
 * @param hex Cadena hexadecimal a convertir.
 * @returns Bytes equivalentes; array vacío si la cadena no es válida.
 */
function aBytes(hex: string): Uint8Array<ArrayBuffer> {
  // Divide la cadena en pares de caracteres hexadecimales.
  const pares = hex.match(/.{2}/g) ?? [];
  // Reserva un búfer del tamaño exacto del número de pares.
  const buffer = new ArrayBuffer(pares.length);
  // Crea la vista de bytes sobre ese búfer.
  const bytes = new Uint8Array(buffer);
  // Convierte cada par hexadecimal en su valor numérico.
  pares.forEach((par, indice) => {
    bytes[indice] = parseInt(par, 16);
  });
  // Devuelve el array de bytes resultante.
  return bytes;
}

/**
 * Calcula el hash de la contraseña con PBKDF2 (Web Crypto).
 *
 * Solo funciona en contextos seguros (`localhost` o HTTPS), ya que el
 * navegador deshabilita `crypto.subtle` en conexiones no cifradas.
 *
 * @param password Contraseña en texto plano.
 * @param sal Sal aleatoria usada en la derivación.
 * @param iteraciones Número de iteraciones de PBKDF2.
 * @returns El hash resultante en hexadecimal.
 * @throws {ErrorAutenticacion} Si el navegador no soporta Web Crypto.
 */
async function derivarHash(
  password: string,
  sal: BufferSource,
  iteraciones: number,
): Promise<string> {
  // Comprueba que el navegador expone la API de criptografía.
  if (!globalThis.crypto?.subtle) {
    // Lanza un error tipado si el contexto no es seguro.
    throw new ErrorAutenticacion(
      'ENTORNO_NO_SEGURO',
      'Este navegador no permite el cifrado necesario. Abre la aplicación desde localhost o con HTTPS.',
    );
  }
  // Importa la contraseña como clave cruda para PBKDF2.
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  // Deriva 256 bits usando SHA-256 y la sal indicada.
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: iteraciones },
    material,
    256,
  );
  // Convierte los bits derivados a una cadena hexadecimal.
  return aHex(new Uint8Array(bits));
}

/**
 * Implementación de práctica que guarda los usuarios en el navegador
 * (`localStorage`).
 *
 * Sirve para aprender el flujo registro → login, pero NO es segura: cualquiera
 * con las herramientas de desarrollo puede ver y modificar los datos. En un
 * entorno real la autenticación debe resolverse en el servidor.
 *
 * @author raulmoron
 * @version 1.0
 */
export class AutenticacionLocal implements ServicioAutenticacion {
  /**
   * Crea una cuenta nueva y devuelve sus datos públicos.
   *
   * @param datos Datos introducidos en el formulario de registro.
   * @returns El usuario público recién creado.
   * @throws {ErrorAutenticacion} Si el correo ya está registrado o el entorno no es seguro.
   */
  async registrar(datos: DatosRegistro): Promise<UsuarioPublico> {
    // Normaliza el correo para compararlo sin ambigüedades.
    const email = normalizarEmail(datos.email);

    // Genera una sal aleatoria de 16 bytes.
    const sal = crypto.getRandomValues(new Uint8Array(16));
    // Deriva el hash de la contraseña con la sal y las iteraciones configuradas.
    const hashPassword = await derivarHash(datos.password, sal, ITERACIONES);

    // Lectura, comprobación y escritura juntas (sin await entre medias).
    const usuarios = this.leerUsuarios();
    // Comprueba si el correo ya existe en la lista.
    if (usuarios.some((u) => u.email === email)) {
      // Lanza un error tipado si la cuenta ya está registrada.
      throw new ErrorAutenticacion(
        'EMAIL_YA_REGISTRADO',
        'Ya existe una cuenta con ese correo electrónico.',
      );
    }

    // Construye el registro interno del nuevo usuario.
    const nuevo: UsuarioGuardado = {
      nombre: datos.nombre.trim(),
      email,
      fechaNacimiento: datos.fechaNacimiento,
      sal: aHex(sal),
      hashPassword,
      iteraciones: ITERACIONES,
    };
    // Añade el usuario a la lista en memoria.
    usuarios.push(nuevo);
    // Persiste la lista completa en localStorage.
    this.guardarUsuarios(usuarios);

    // Devuelve solo los datos públicos del usuario creado.
    return this.aPublico(nuevo);
  }

  /**
   * Comprueba las credenciales, abre la sesión y devuelve el usuario.
   *
   * @param email Correo introducido en el formulario de acceso.
   * @param password Contraseña introducida en el formulario de acceso.
   * @returns El usuario público autenticado.
   * @throws {ErrorAutenticacion} Si el correo no existe o la contraseña no coincide.
   */
  async iniciarSesion(email: string, password: string): Promise<UsuarioPublico> {
    // Normaliza el correo introducido.
    const correo = normalizarEmail(email);
    // Busca el usuario correspondiente en el almacenamiento.
    const usuario = this.leerUsuarios().find((u) => u.email === correo);
    // Prepara el error genérico para no revelar qué dato es incorrecto.
    const errorCredenciales = new ErrorAutenticacion(
      'CREDENCIALES_INVALIDAS',
      'Correo o contraseña incorrectos.',
    );

    // Si el correo no existe, lanza el error genérico.
    if (!usuario) {
      throw errorCredenciales;
    }

    // Deriva el hash de la contraseña introducida usando la sal guardada.
    const hash = await derivarHash(password, aBytes(usuario.sal), usuario.iteraciones);
    // Compara el hash calculado con el almacenado.
    if (hash !== usuario.hashPassword) {
      // Si no coinciden, lanza el error genérico.
      throw errorCredenciales;
    }

    // Proyecta el usuario almacenado a su versión pública.
    const publico = this.aPublico(usuario);
    // Guarda la sesión activa en sessionStorage.
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(publico));
    // Devuelve el usuario autenticado.
    return publico;
  }

  /**
   * Elimina la sesión activa de `sessionStorage`.
   */
  cerrarSesion(): void {
    // Borra la clave de sesión del almacenamiento de la pestaña.
    sessionStorage.removeItem(CLAVE_SESION);
  }

  /**
   * Devuelve el usuario de la sesión activa.
   *
   * @returns El usuario público guardado, o `null` si no hay sesión o los
   * datos almacenados no son válidos.
   */
  usuarioActual(): UsuarioPublico | null {
    try {
      // Recupera el texto de la sesión guardada.
      const texto = sessionStorage.getItem(CLAVE_SESION);
      // Parsea el JSON y lo devuelve, o `null` si no había sesión.
      return texto ? (JSON.parse(texto) as UsuarioPublico) : null;
    } catch {
      // Si el JSON está corrupto, se considera que no hay sesión.
      return null;
    }
  }

  /**
   * Lee la lista de usuarios almacenados.
   *
   * @returns Los usuarios guardados; array vacío si no hay datos o están corruptos.
   */
  private leerUsuarios(): UsuarioGuardado[] {
    try {
      // Recupera y parsea la lista; usa un array vacío por defecto.
      const datos = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) ?? '[]');
      // Solo devuelve el valor si realmente es un array.
      return Array.isArray(datos) ? datos : [];
    } catch {
      // Si el JSON está corrupto, devuelve una lista vacía.
      return [];
    }
  }

  /**
   * Persiste la lista completa de usuarios en `localStorage`.
   *
   * @param usuarios Usuarios que se quieren guardar.
   */
  private guardarUsuarios(usuarios: UsuarioGuardado[]): void {
    // Serializa y guarda la lista completa bajo la clave de usuarios.
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  }

  /**
   * Proyecta un usuario almacenado a su versión pública, sin datos sensibles.
   *
   * @param usuario Usuario tal y como está guardado.
   * @returns El usuario público equivalente.
   */
  private aPublico(usuario: UsuarioGuardado): UsuarioPublico {
    // Devuelve únicamente los campos que puede ver la aplicación.
    return {
      nombre: usuario.nombre,
      email: usuario.email,
      fechaNacimiento: usuario.fechaNacimiento,
    };
  }
}
