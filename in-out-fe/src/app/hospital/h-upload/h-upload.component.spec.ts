import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HUploadComponent } from './h-upload.component';

describe('HUploadComponent', () => {
  let component: HUploadComponent;
  let fixture: ComponentFixture<HUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
