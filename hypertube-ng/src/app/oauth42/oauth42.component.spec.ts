import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Oauth42Component } from './oauth42.component';

describe('Oauth42Component', () => {
  let component: Oauth42Component;
  let fixture: ComponentFixture<Oauth42Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Oauth42Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Oauth42Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
