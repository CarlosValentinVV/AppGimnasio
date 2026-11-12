import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar la marca y los enlaces principales', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.marca-texto')?.textContent).toContain('JIMNASIO');
    expect(compiled.querySelectorAll('.navegacion-desktop .nav-enlace').length).toBe(5);
  });

  it('debe alternar el menú móvil', () => {
    expect(component.mobileMenuOpen()).toBe(false);
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(true);
    component.closeMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('debe alternar el tema compartido', () => {
    const themeService = TestBed.inject(ThemeService);
    themeService.setDarkMode(false);

    expect(component.isDarkMode()).toBe(false);
    component.toggleTheme();
    expect(component.isDarkMode()).toBe(true);
    component.toggleTheme();
    expect(component.isDarkMode()).toBe(false);
  });
});
