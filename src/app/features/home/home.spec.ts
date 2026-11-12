import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeService } from '../../shared/services/theme.service';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();

    TestBed.inject(ThemeService).setDarkMode(false);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe iniciar con el modo claro como predeterminado (isDarkMode = false)', () => {
    expect(component.isDarkMode()).toBeFalsy();
  });

  it('debe iniciar con la categoría "todas"', () => {
    expect(component.selectedCategory()).toBe('todas');
  });

  it('debe filtrar clases por categoría', () => {
    component.setCategory('fuerza');
    expect(component.selectedCategory()).toBe('fuerza');
    const filtered = component.filteredClasses();
    expect(filtered.every((c) => c.category === 'fuerza')).toBeTruthy();
  });

  it('debe alternar entre tema oscuro y claro', () => {
    expect(component.isDarkMode()).toBeFalsy();
    component.toggleTheme();
    expect(component.isDarkMode()).toBeTruthy();
    component.toggleTheme();
    expect(component.isDarkMode()).toBeFalsy();
  });
});
