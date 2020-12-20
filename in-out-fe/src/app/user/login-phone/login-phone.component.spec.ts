import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPhoneComponent } from './login-phone.component';

describe('LoginPhoneComponent', () => {
  let component: LoginPhoneComponent;
  let fixture: ComponentFixture<LoginPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPhoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
