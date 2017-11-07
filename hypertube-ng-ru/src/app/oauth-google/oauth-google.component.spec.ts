import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthGoogleComponent } from './oauth-google.component';

describe('OauthGoogleComponent', () => {
  let component: OauthGoogleComponent;
  let fixture: ComponentFixture<OauthGoogleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OauthGoogleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
