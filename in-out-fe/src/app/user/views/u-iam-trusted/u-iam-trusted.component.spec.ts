import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UIamTrustedComponent } from './u-iam-trusted.component';

describe('UIamTrustedComponent', () => {
  let component: UIamTrustedComponent;
  let fixture: ComponentFixture<UIamTrustedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UIamTrustedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UIamTrustedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
