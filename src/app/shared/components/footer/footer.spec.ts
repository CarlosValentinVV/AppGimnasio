import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar la marca, el contacto y el año actual', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const texto = compiled.textContent ?? '';

    expect(texto).toContain('JIMNASIO');
    expect(texto).toContain('Calle del Hierro, 12');
    expect(texto).toContain(String(new Date().getFullYear()));
  });

  it('debe incluir los enlaces a las secciones y al perfil', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.pie-columna a').length).toBeGreaterThan(5);
    expect(compiled.querySelector('.pie-social')?.querySelectorAll('a').length).toBe(4);
  });
});
