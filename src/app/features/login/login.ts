import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { AUTENTICACION } from '../../core/auth/autenticacion.token';
import { DatosRegistro, ErrorAutenticacion, UsuarioPublico } from '../../core/auth/autenticacion.model';
import { ThemeService } from '../../shared/services/theme.service';

/** Pestañas disponibles en la pantalla de acceso. */
type ModoAcceso = 'login' | 'registro';

/** Expresión regular mínima para validar direcciones de correo electrónico. */
const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fecha de hoy en formato AAAA-MM-DD, según la hora local (el formato en-CA lo produce directamente). */
function hoyISO(): string {
  // Convierte la fecha actual al formato ISO local sin hora.
  return new Date().toLocaleDateString('en-CA');
}

/** La fecha de nacimiento no puede ser posterior a hoy. */
function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  // Recupera el valor del control como texto.
  const valor: string = control.value;
  // Devuelve un error si la fecha es posterior a hoy; si no, es válida.
  return valor && valor > hoyISO() ? { fechaFutura: true } : null;
}

/** Valida a nivel de grupo que dos campos tengan el mismo valor. */
function coinciden(
  campo: string,
  confirmacion: string,
  error: string,
  normalizar: (valor: string) => string = (valor) => valor,
): ValidatorFn {
  // Devuelve la función validadora que usará el formulario.
  return (grupo: AbstractControl): ValidationErrors | null => {
    // Obtiene y normaliza el valor del primer campo.
    const a = normalizar(grupo.get(campo)?.value ?? '');
    // Obtiene y normaliza el valor del campo de confirmación.
    const b = normalizar(grupo.get(confirmacion)?.value ?? '');
    // Solo falla si ambos campos tienen valor y son distintos.
    return a && b && a !== b ? { [error]: true } : null;
  };
}

/**
 * Componente de acceso de la aplicación.
 *
 * Permite alternar entre inicio de sesión y registro, valida los formularios y
 * delega el almacenamiento en el servicio inyectado con AUTENTICACION. Cuando
 * hay una sesión activa, en lugar de los formularios muestra los datos del
 * usuario que ha accedido o acaba de registrarse.
 *
 * @author Raúl Morón Chantal
 * @version 1.1
 */
@Component({
  // Selector usado en las plantillas para insertar la pantalla de acceso.
  selector: 'app-login',
  // Componente independiente, sin necesidad de declararlo en un módulo.
  standalone: true,
  // Optimiza el renderizado comprobando cambios solo cuando se notifican.
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Módulos necesarios para las directivas comunes y los formularios reactivos.
  imports: [CommonModule, ReactiveFormsModule],
  // Plantilla HTML del componente.
  templateUrl: './login.html',
  // Hoja de estilos del componente.
  styleUrl: './login.css',
  host: {
    '[class.modo-oscuro]': 'isDarkMode()',
    '[class.modo-claro]': '!isDarkMode()',
  },
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AUTENTICACION);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly themeService = inject(ThemeService);

  readonly isDarkMode = this.themeService.isDarkMode;

  modo: ModoAcceso = 'login';
  /** Indica si hay una operación de autenticación en curso. */
  enviando = false;
  /** Mensaje de error mostrado al usuario, o `null` si no hay ninguno. */
  error: string | null = null;
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Formulario reactivo de inicio de sesión (correo y contraseña). */
  readonly loginForm = this.fb.nonNullable.group({
    // Correo obligatorio con formato válido.
    email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
    // Contraseña obligatoria.
    password: ['', Validators.required],
  });
  /** Formulario reactivo de registro con validaciones a nivel de campo y de grupo. */
  readonly registroForm = this.fb.nonNullable.group(
    {
      // Nombre obligatorio de al menos 3 caracteres.
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      // Correo obligatorio con formato válido.
      email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
      // Repetición del correo para evitar erratas.
      confirmarEmail: ['', Validators.required],
      // Fecha de nacimiento obligatoria y no futura.
      fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
      // Contraseña obligatoria de al menos 8 caracteres.
      password: ['', [Validators.required, Validators.minLength(8)]],
      // Repetición de la contraseña para evitar erratas.
      confirmarPassword: ['', Validators.required],
    },
    {
      // Validaciones que comparan varios campos entre sí.
      validators: [
        // Los correos deben coincidir ignorando mayúsculas y espacios.
        coinciden('email', 'confirmarEmail', 'emailsDistintos', (v) => v.trim().toLowerCase()),
        // Las contraseñas deben coincidir exactamente.
        coinciden('password', 'confirmarPassword', 'passwordsDistintas'),
      ],
    },
  );
  /** Servicio de autenticación inyectado mediante el token AUTENTICACION. */
  private readonly auth = inject(AUTENTICACION);
  /** Router usado para entrar en el perfil en cuanto hay sesión. */
  private readonly router = inject(Router);

  /** Fecha máxima del selector de fecha de nacimiento. */
  readonly hoy = hoyISO();
  /** Usuario autenticado actualmente, o `null` si no hay sesión activa. */
  usuarioActivo: UsuarioPublico | null = this.auth.usuarioActual();
  /** Referencia al detector de cambios para notificar actualizaciones con OnPush. */
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Fecha de nacimiento del usuario activo en formato `DD/MM/AAAA`.
   *
   * Devuelve una cadena vacía si no hay sesión, para que la plantilla pueda
   * ocultar la línea con un simple `*ngIf`.
   */
  get fechaNacimientoLegible(): string {
    // Recupera la fecha guardada del usuario activo, si existe.
    const fecha = this.usuarioActivo?.fechaNacimiento;
    // Sin fecha no hay nada que mostrar.
    if (!fecha) {
      return '';
    }
    // Separa el formato ISO (`AAAA-MM-DD`) en sus tres partes.
    const [anio, mes, dia] = fecha.split('-');
    // Reordena las partes al formato habitual en España.
    return `${dia}/${mes}/${anio}`;
  }

  /** Alterna entre la pestaña de inicio de sesión y la de registro. */
  cambiarModo(nuevoModo: ModoAcceso): void {
    // Actualiza la pestaña activa.
    this.modo = nuevoModo;
    // Limpia cualquier error previo.
    this.error = null;
    // Avisa a Angular de que la vista ha cambiado (necesario con OnPush).
    this.cdr.markForCheck();
  }

  /** Un campo del registro se marca como inválido solo cuando ya se ha interactuado con él. */
  invalido(campo: string): boolean {
    // Obtiene el control indicado del formulario de registro.
    const control = this.registroForm.get(campo);
    // Considera inválido solo si existe, es inválido y ya fue tocado o modificado.
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Lo mismo, para el formulario de inicio de sesión. */
  loginInvalido(campo: string): boolean {
    // Obtiene el control indicado del formulario de login.
    const control = this.loginForm.get(campo);
    // Considera inválido solo si existe, es inválido y ya fue tocado o modificado.
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Error de grupo (los dos valores no coinciden), mostrado una vez tocado el campo de confirmación. */
  noCoinciden(error: string, campoConfirmacion: string): boolean {
    return this.registroForm.hasError(error) && !!this.registroForm.get(campoConfirmacion)?.touched;
  }

  /** Valida el formulario de registro, crea la cuenta e inicia la sesión si es correcto. */
  async registrar(): Promise<void> {
    // Si el formulario no es válido, marca todos los campos y detiene el registro.
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    // Recupera los valores actuales del formulario.
    const valores = this.registroForm.getRawValue();
    // Prepara los datos que espera el servicio de autenticación.
    const datos: DatosRegistro = {
      nombre: valores.nombre.trim(),
      email: valores.email.trim().toLowerCase(),
      fechaNacimiento: valores.fechaNacimiento,
      password: valores.password,
    };

    // Limpia errores anteriores.
    this.error = null;
    // Marca la operación como en curso.
    this.enviando = true;
    // Indica si la cuenta se ha creado correctamente.
    let autenticado = false;
    try {
      // Crea la cuenta y abre su sesión en el servicio de autenticación.
      this.usuarioActivo = await this.auth.registrar(datos);
      // Vacía el formulario de registro.
      this.registroForm.reset();
      // Deja limpio el formulario de acceso para cuando se cierre la sesión.
      this.loginForm.reset();
      // La cuenta se ha creado y la sesión está abierta.
      autenticado = true;
    } catch (e) {
      // Traduce el error a un texto apto para la interfaz.
      this.error = this.textoError(e);
    } finally {
      // La operación ha terminado, haya éxito o error.
      this.enviando = false;
      // Notifica el cambio si la aplicación funciona sin zone.js.
      this.cdr.markForCheck();
    }

    // Con la cuenta creada se entra directamente en el perfil del usuario.
    if (autenticado) {
      await this.router.navigateByUrl('/perfil');
    }
  }

  /** Valida el formulario de inicio de sesión e inicia la sesión si es correcto. */
  async iniciarSesion(): Promise<void> {
    // Si el formulario no es válido, marca todos los campos y detiene el acceso.
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Extrae el correo y la contraseña introducidos.
    const { email, password } = this.loginForm.getRawValue();

    // Limpia errores anteriores.
    this.error = null;
    // Marca la operación como en curso.
    this.enviando = true;
    // Indica si el acceso se ha completado correctamente.
    let autenticado = false;
    try {
      // Autentica al usuario y guarda su sesión.
      this.usuarioActivo = await this.auth.iniciarSesion(email, password);
      // Vacía el formulario tras un acceso correcto.
      this.loginForm.reset();
      // Las credenciales eran correctas y la sesión está abierta.
      autenticado = true;
    } catch (e) {
      // Traduce el error a un texto apto para la interfaz.
      this.error = this.textoError(e);
    } finally {
      // La operación ha terminado, haya éxito o error.
      this.enviando = false;
      // Notifica el cambio si la aplicación funciona sin zone.js.
      this.cdr.markForCheck();
    }

    // Con el acceso correcto se entra directamente en el perfil del usuario.
    if (autenticado) {
      await this.router.navigateByUrl('/perfil');
    }
  }

  /** Cierra la sesión activa y restablece el estado del componente. */
  cerrarSesion(): void {
    // Elimina la sesión del servicio de autenticación.
    this.auth.cerrarSesion();
    // Marca que ya no hay usuario activo.
    this.usuarioActivo = null;
    // Vuelve a la pestaña de inicio de sesión.
    this.modo = 'login';
    // Notifica el cambio a Angular.
    this.cdr.markForCheck();
  }

  /** Traduce un error capturado a un texto apto para mostrar en pantalla. */
  private textoError(e: unknown): string {
    // Usa el mensaje del error de autenticación o un texto genérico.
    return e instanceof ErrorAutenticacion
      ? e.message
      : 'No se ha podido completar la operación. Inténtalo de nuevo.';
  }
}
