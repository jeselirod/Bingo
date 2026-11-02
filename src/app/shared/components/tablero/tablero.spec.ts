import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BingoService } from '../../../services/bingo.service';

import { Tablero } from './tablero';

describe('Tablero', () => {
  let component: Tablero;
  let fixture: ComponentFixture<Tablero>;
  const drawnNumbers = signal<number[]>([]);

  beforeEach(async () => {
    drawnNumbers.set([]);

    await TestBed.configureTestingModule({
      imports: [Tablero],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: BingoService,
          useValue: {
            numbersBingo: 90,
            drawnNumbers
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tablero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applies consistent colors to drawn, latest, and remaining numbers', () => {
    drawnNumbers.set([4, 8]);
    fixture.detectChanges();

    const cells = Array.from(fixture.nativeElement.querySelectorAll('.grid > div')) as HTMLElement[];
    const drawnCell = cells.find(cell => cell.textContent?.trim() === '4')!;
    const latestCell = cells.find(cell => cell.textContent?.trim() === '8')!;
    const remainingCell = cells.find(cell => cell.textContent?.trim() === '9')!;

    expect(drawnCell.classList).toContain('bg-green-500');
    expect(drawnCell.classList).toContain('text-gray-900');
    expect(drawnCell.classList).not.toContain('text-white');
    expect(drawnCell.classList).not.toContain('bg-red-600');

    expect(latestCell.classList).toContain('bg-red-600');
    expect(latestCell.classList).toContain('text-white');
    expect(latestCell.classList).toContain('animate-pulse');
    expect(latestCell.classList).not.toContain('bg-green-500');

    expect(remainingCell.classList).toContain('bg-gray-200');
    expect(remainingCell.classList).toContain('text-gray-700');
    expect(remainingCell.classList).not.toContain('text-gray-900');
    expect(remainingCell.classList).not.toContain('text-white');
  });

  it('keeps drawn number colors in the extracted-balls view', () => {
    fixture.componentRef.setInput('orden', true);
    drawnNumbers.set([4, 8]);
    fixture.detectChanges();

    const cells = Array.from(fixture.nativeElement.querySelectorAll('.grid > div')) as HTMLElement[];

    expect(cells.length).toBe(2);
    const drawnCell = cells.find(cell => cell.textContent?.trim() === '4')!;
    const latestCell = cells.find(cell => cell.textContent?.trim() === '8')!;

    expect(drawnCell.classList).toContain('bg-green-500');
    expect(drawnCell.classList).toContain('text-gray-900');
    expect(drawnCell.classList).not.toContain('text-white');
    expect(latestCell.classList).toContain('bg-red-600');
    expect(latestCell.classList).toContain('text-white');
  });
});
