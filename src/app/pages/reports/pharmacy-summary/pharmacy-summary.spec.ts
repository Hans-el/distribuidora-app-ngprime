import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacySummary } from './pharmacy-summary';

describe('PharmacySummary', () => {
  let component: PharmacySummary;
  let fixture: ComponentFixture<PharmacySummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacySummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacySummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
