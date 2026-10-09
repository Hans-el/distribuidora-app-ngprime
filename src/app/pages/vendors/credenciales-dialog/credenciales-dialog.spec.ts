import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredencialesDialog } from './credenciales-dialog';

describe('CredencialesDialog', () => {
  let component: CredencialesDialog;
  let fixture: ComponentFixture<CredencialesDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredencialesDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredencialesDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
