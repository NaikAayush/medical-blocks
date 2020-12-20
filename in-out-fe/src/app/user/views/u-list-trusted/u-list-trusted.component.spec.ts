import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UListTrustedComponent } from './u-list-trusted.component';

describe('UListTrustedComponent', () => {
  let component: UListTrustedComponent;
  let fixture: ComponentFixture<UListTrustedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UListTrustedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UListTrustedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
