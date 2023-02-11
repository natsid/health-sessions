import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTimingComponent } from './session-timing.component';

describe('SessionTimingComponent', () => {
  let component: SessionTimingComponent;
  let fixture: ComponentFixture<SessionTimingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionTimingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTimingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
