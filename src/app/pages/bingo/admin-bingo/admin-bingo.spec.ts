import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBingo } from './admin-bingo';

describe('AdminBingo', () => {
  let component: AdminBingo;
  let fixture: ComponentFixture<AdminBingo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBingo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBingo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
