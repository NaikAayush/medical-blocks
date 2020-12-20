import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HViewWithAccessComponent } from './h-view-with-access.component';

describe('HViewWithAccessComponent', () => {
  let component: HViewWithAccessComponent;
  let fixture: ComponentFixture<HViewWithAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HViewWithAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HViewWithAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
