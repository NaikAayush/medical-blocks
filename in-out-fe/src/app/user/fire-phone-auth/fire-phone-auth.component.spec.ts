import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirePhoneAuthComponent } from './fire-phone-auth.component';

describe('FirePhoneAuthComponent', () => {
  let component: FirePhoneAuthComponent;
  let fixture: ComponentFixture<FirePhoneAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirePhoneAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirePhoneAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
