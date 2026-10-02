import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyList } from './pharmacy-list';

describe('PharmacyList', () => {
  let component: PharmacyList;
  let fixture: ComponentFixture<PharmacyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmacyList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
