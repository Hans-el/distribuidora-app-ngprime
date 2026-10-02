import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyForm } from './pharmacy-form';

describe('PharmacyForm', () => {
  let component: PharmacyForm;
  let fixture: ComponentFixture<PharmacyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
