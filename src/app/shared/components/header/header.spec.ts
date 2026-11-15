import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { Header } from './header';

/** Pruebas de la cabecera: marca, navegación, menú móvil y tema compartido. */
describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    // Configura el entorno de pruebas con el componente y el router.
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    // Crea la instancia del componente bajo prueba.
    fixture = TestBed.createComponent(Header);
    // Expone la clase TypeScript del componente.
    component = fixture.componentInstance;
    // Espera a que la vista termine de estabilizarse.
    await fixture.whenStable();
  });

  it('should create', () => {
    // Comprueba que el componente se ha creado correctamente.
    expect(component).toBeTruthy();
  });

  it('debe mostrar la marca y los enlaces principales', () => {
    // Recupera el elemento HTML renderizado.
    const compiled = fixture.nativeElement as HTMLElement;

    // Verifica el nombre de la marca.
    expect(compiled.querySelector('.marca-texto')?.textContent).toContain('JIMNASIO');
    // Verifica que se muestran los cinco enlaces principales.
    expect(compiled.querySelectorAll('.navegacion-desktop .nav-enlace').length).toBe(5);
  });

  it('debe alternar el menú móvil', () => {
    // El menú debe empezar cerrado.
    expect(component.mobileMenuOpen()).toBeFalsy();
    // Al alternar, debe abrirse.
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBeTruthy();
    // Al cerrar, debe volver a ocultarse.
    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBeFalsy();
  });

  it('debe alternar el tema compartido', () => {
    // Obtiene el servicio de tema compartido.
    const themeService = TestBed.inject(ThemeService);
    // Fuerza el modo claro antes de la prueba.
    themeService.setDarkMode(false);

    // El modo oscuro debe estar desactivado inicialmente.
    expect(component.isDarkMode()).toBeFalsy();
    // Al alternar, debe activarse.
    component.toggleTheme();
    expect(component.isDarkMode()).toBeTruthy();
    // Al alternar de nuevo, debe desactivarse.
    component.toggleTheme();
    expect(component.isDarkMode()).toBeFalsy();
  });
});
