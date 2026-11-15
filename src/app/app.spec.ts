import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

/** Pruebas del componente raíz `App`: creación y composición header/contenido/footer. */
describe('App', () => {
  beforeEach(async () => {
    // Configura el entorno de pruebas con el componente raíz y el router.
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    // Crea la instancia del componente raíz.
    const fixture = TestBed.createComponent(App);
    // Expone la clase TypeScript del componente.
    const app = fixture.componentInstance;
    // Comprueba que el componente se ha creado correctamente.
    expect(app).toBeTruthy();
  });

  it('debe renderizar el header, el contenido y el footer', async () => {
    // Crea la instancia y espera a que la vista se estabilice.
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    // Recupera el elemento HTML renderizado.
    const compiled = fixture.nativeElement as HTMLElement;

    // Verifica que se muestra la cabecera.
    expect(compiled.querySelector('app-header')).toBeTruthy();
    // Verifica que se muestra el contenido enrutado.
    expect(compiled.querySelector('.app-contenido router-outlet')).toBeTruthy();
    // Verifica que se muestra el pie de página.
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
