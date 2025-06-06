import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bola } from './bola';

describe('Bola', () => {
  let component: Bola;
  let fixture: ComponentFixture<Bola>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bola]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bola);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
