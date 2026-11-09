import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallaUsuario } from './pantalla-usuario';

describe('PantallaUsuario', () => {
  let component: PantallaUsuario;
  let fixture: ComponentFixture<PantallaUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PantallaUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(PantallaUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
