import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { AUTENTICACION } from '../../core/auth/autenticacion.token';
import {
  DatosRegistro,
  ErrorAutenticacion,
  UsuarioPublico,
} from '../../core/auth/autenticacion.model';

/** Pestañas disponibles en la pantalla de acceso. */
type ModoAcceso = 'login' | 'registro';

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fecha de hoy en formato AAAA-MM-DD, según la hora local (el formato en-CA lo produce directamente). */
function hoyISO(): string {
  return new Date().toLocaleDateString('en-CA');
}

/** La fecha de nacimiento no puede ser posterior a hoy. */
function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value;
  return valor && valor > hoyISO() ? { fechaFutura: true } : null;
}

/** Valida a nivel de grupo que dos campos tengan el mismo valor. */
function coinciden(
  campo: string,
  confirmacion: string,
  error: string,
  normalizar: (valor: string) => string = (valor) => valor,
): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = normalizar(grupo.get(campo)?.value ?? '');
    const b = normalizar(grupo.get(confirmacion)?.value ?? '');
    return a && b && a !== b ? { [error]: true } : null;
  };
}

/**
 * Componente de acceso de la aplicación.
 * Permite alternar entre inicio de sesión y registro, valida los formularios
 * y delega el almacenamiento en el servicio inyectado con AUTENTICACION.
 * @author raulmoron
 * @version 1.0
 */
@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AUTENTICACION);
  private readonly cdr = inject(ChangeDetectorRef);

  modo: ModoAcceso = 'login';
  enviando = false;
  error: string | null = null;
  mensaje: string | null = null;
  usuarioActivo: UsuarioPublico | null = this.auth.usuarioActual();

  /** Fecha máxima del selector de fecha de nacimiento. */
  readonly hoy = hoyISO();

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
    password: ['', Validators.required],
  });

  readonly registroForm = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
      confirmarEmail: ['', Validators.required],
      fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required],
    },
    {
      validators: [
        coinciden('email', 'confirmarEmail', 'emailsDistintos', (v) => v.trim().toLowerCase()),
        coinciden('password', 'confirmarPassword', 'passwordsDistintas'),
      ],
    },
  );

  // Método público para alternar entre la pestaña de login y la de registro
  cambiarModo(nuevoModo: ModoAcceso): void {
    this.modo = nuevoModo;
    this.error = null;
    this.mensaje = null;
    this.cdr.markForCheck(); // OnPush (por defecto en Angular 22): avisa a Angular de que la vista ha cambiado
  }

  /** Un campo del registro se marca como inválido solo cuando ya se ha interactuado con él. */
  invalido(campo: string): boolean {
    const control = this.registroForm.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Lo mismo, para el formulario de inicio de sesión. */
  loginInvalido(campo: string): boolean {
    const control = this.loginForm.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /** Error de grupo (los dos valores no coinciden), mostrado una vez tocado el campo de confirmación. */
  noCoinciden(error: string, campoConfirmacion: string): boolean {
    return (
      this.registroForm.hasError(error) && !!this.registroForm.get(campoConfirmacion)?.touched
    );
  }

  // Método público que valida el formulario de registro y crea la cuenta
  async registrar(): Promise<void> {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const valores = this.registroForm.getRawValue();
    const datos: DatosRegistro = {
      nombre: valores.nombre.trim(),
      email: valores.email.trim().toLowerCase(),
      fechaNacimiento: valores.fechaNacimiento,
      password: valores.password,
    };

    this.error = null;
    this.mensaje = null;
    this.enviando = true;
    try {
      await this.auth.registrar(datos);
      this.registroForm.reset();
      this.loginForm.reset({ email: datos.email, password: '' });
      this.modo = 'login';
      this.mensaje = 'Cuenta creada. Ya puedes iniciar sesión.';
    } catch (e) {
      this.error = this.textoError(e);
    } finally {
      this.enviando = false;
      this.cdr.markForCheck(); // necesario si la app funciona sin zone.js
    }
  }

  // Método público que valida el formulario de login e inicia la sesión
  async iniciarSesion(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.error = null;
    this.mensaje = null;
    this.enviando = true;
    try {
      this.usuarioActivo = await this.auth.iniciarSesion(email, password);
      this.loginForm.reset();
    } catch (e) {
      this.error = this.textoError(e);
    } finally {
      this.enviando = false;
      this.cdr.markForCheck(); // necesario si la app funciona sin zone.js
    }
  }

  // Método público para cerrar la sesión activa
  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.usuarioActivo = null;
    this.modo = 'login';
    this.cdr.markForCheck();
  }

  // Método privado que traduce un error a un texto apto para mostrar en pantalla
  private textoError(e: unknown): string {
    return e instanceof ErrorAutenticacion
      ? e.message
      : 'No se ha podido completar la operación. Inténtalo de nuevo.';
  }
}
