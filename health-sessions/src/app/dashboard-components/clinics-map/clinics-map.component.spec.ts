import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicsMapComponent } from './clinics-map.component';

describe('ClinicsMapComponent', () => {
  let component: ClinicsMapComponent;
  let fixture: ComponentFixture<ClinicsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicsMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Add tests
});
