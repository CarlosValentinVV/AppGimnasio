import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Footer } from './footer';

/** Pruebas del pie de página: marca, contacto, año actual y enlaces. */
describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    // Configura el entorno de pruebas con el pie de página y el router.
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    // Crea la instancia del componente bajo prueba.
    fixture = TestBed.createComponent(Footer);
    // Expone la clase TypeScript del componente.
    component = fixture.componentInstance;
    // Espera a que la vista termine de estabilizarse.
    await fixture.whenStable();
  });

  it('should create', () => {
    // Comprueba que el componente se ha creado correctamente.
    expect(component).toBeTruthy();
  });

  it('debe mostrar la marca, el contacto y el año actual', () => {
    // Recupera el elemento HTML renderizado.
    const compiled = fixture.nativeElement as HTMLElement;
    // Obtiene todo el texto visible del pie de página.
    const texto = compiled.textContent ?? '';

    // Verifica el nombre de la marca.
    expect(texto).toContain('JIMNASIO');
    // Verifica que se muestra la dirección de contacto.
    expect(texto).toContain('Calle del Hierro, 12');
    // Verifica que se muestra el año actual.
    expect(texto).toContain(String(new Date().getFullYear()));
  });

  it('debe incluir los enlaces a las secciones y al perfil', () => {
    // Recupera el elemento HTML renderizado.
    const compiled = fixture.nativeElement as HTMLElement;

    // Debe haber más de cinco enlaces en las columnas del pie.
    expect(compiled.querySelectorAll('.pie-columna a').length).toBeGreaterThan(5);
    // La zona social debe contener exactamente cuatro enlaces.
    expect(compiled.querySelector('.pie-social')?.querySelectorAll('a').length).toBe(4);
  });
});
