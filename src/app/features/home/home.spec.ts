import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con el modo claro como predeterminado (isDarkMode = false)', () => {
    expect(component.isDarkMode()).toBeFalse();
  });

  it('debe iniciar con la categoría "todas"', () => {
    expect(component.selectedCategory()).toBe('todas');
  });

  it('debe filtrar clases por categoría', () => {
    component.setCategory('fuerza');
    expect(component.selectedCategory()).toBe('fuerza');
    const filtered = component.filteredClasses();
    expect(filtered.every((c) => c.category === 'fuerza')).toBeTrue();
  });

  it('debe alternar el menú móvil', () => {
    expect(component.mobileMenuOpen()).toBeFalse();
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBeTrue();
    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBeFalse();
  });

  it('debe alternar entre tema oscuro y claro', () => {
    expect(component.isDarkMode()).toBeFalse();
    component.toggleTheme();
    expect(component.isDarkMode()).toBeTrue();
    component.toggleTheme();
    expect(component.isDarkMode()).toBeFalse();
  });
});
