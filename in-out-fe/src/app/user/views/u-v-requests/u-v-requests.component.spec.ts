import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UVRequestsComponent } from './u-v-requests.component';

describe('UVRequestsComponent', () => {
  let component: UVRequestsComponent;
  let fixture: ComponentFixture<UVRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UVRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UVRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
