import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMedRecordsComponent } from './user-med-records.component';

describe('UserMedRecordsComponent', () => {
  let component: UserMedRecordsComponent;
  let fixture: ComponentFixture<UserMedRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMedRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMedRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
