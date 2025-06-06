import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bombo } from './bombo';

describe('Bombo', () => {
  let component: Bombo;
  let fixture: ComponentFixture<Bombo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bombo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bombo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
