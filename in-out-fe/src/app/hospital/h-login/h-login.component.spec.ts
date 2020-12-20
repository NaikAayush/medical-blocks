import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HLoginComponent } from './h-login.component';

describe('HLoginComponent', () => {
  let component: HLoginComponent;
  let fixture: ComponentFixture<HLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
