import { ComponentFixture, TestBed } from '@angular/core/testing';

import { URecordRequestAccessComponent } from './u-record-request-access.component';

describe('URecordRequestAccessComponent', () => {
  let component: URecordRequestAccessComponent;
  let fixture: ComponentFixture<URecordRequestAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ URecordRequestAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(URecordRequestAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
