import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPasswdComponent } from './create-new-passwd.component';

describe('CreateNewPasswdComponent', () => {
  let component: CreateNewPasswdComponent;
  let fixture: ComponentFixture<CreateNewPasswdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewPasswdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPasswdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
