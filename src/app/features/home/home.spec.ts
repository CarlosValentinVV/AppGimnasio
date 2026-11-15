import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeService } from '../../shared/services/theme.service';
import { HomeComponent } from './home';

/** Pruebas de la página de inicio: tema, filtrado de clases y categoría inicial. */
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    // Configura el entorno de pruebas con la página de inicio.
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    // Fuerza el modo claro antes de cada prueba.
    TestBed.inject(ThemeService).setDarkMode(false);

    // Crea la instancia del componente bajo prueba.
    fixture = TestBed.createComponent(HomeComponent);
    // Expone la clase TypeScript del componente.
    component = fixture.componentInstance;
    // Renderiza la vista por primera vez.
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    // Comprueba que el componente se ha creado correctamente.
    expect(component).toBeTruthy();
  });

  it('debe iniciar con el modo claro como predeterminado (isDarkMode = false)', () => {
    // El modo oscuro debe estar desactivado al inicio.
    expect(component.isDarkMode()).toBeFalsy();
  });

  it('debe iniciar con la categoría "todas"', () => {
    // El filtro debe empezar sin categoría seleccionada.
    expect(component.selectedCategory()).toBe('todas');
  });

  it('debe filtrar clases por categoría', () => {
    // Selecciona la categoría de fuerza.
    component.setCategory('fuerza');
    // Verifica que la categoría activa cambió.
    expect(component.selectedCategory()).toBe('fuerza');
    // Recupera las clases filtradas.
    const filtered = component.filteredClasses();
    // Todas las clases mostradas deben pertenecer a la categoría elegida.
    expect(filtered.every((c) => c.category === 'fuerza')).toBeTruthy();
  });

  it('debe alternar entre tema oscuro y claro', () => {
    // El modo oscuro debe estar desactivado al inicio.
    expect(component.isDarkMode()).toBeFalsy();
    // Al alternar, debe activarse.
    component.toggleTheme();
    expect(component.isDarkMode()).toBeTruthy();
    // Al alternar de nuevo, debe desactivarse.
    component.toggleTheme();
    expect(component.isDarkMode()).toBeFalsy();
  });
});
