import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyHistory } from './pharmacy-history';

describe('PharmacyHistory', () => {
  let component: PharmacyHistory;
  let fixture: ComponentFixture<PharmacyHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
