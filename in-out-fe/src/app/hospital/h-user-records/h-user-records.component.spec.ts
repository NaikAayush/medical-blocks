import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HUserRecordsComponent } from './h-user-records.component';

describe('HUserRecordsComponent', () => {
  let component: HUserRecordsComponent;
  let fixture: ComponentFixture<HUserRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HUserRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HUserRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
