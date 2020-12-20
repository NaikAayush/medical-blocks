import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HDashComponent } from './h-dash.component';

describe('HDashComponent', () => {
  let component: HDashComponent;
  let fixture: ComponentFixture<HDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
