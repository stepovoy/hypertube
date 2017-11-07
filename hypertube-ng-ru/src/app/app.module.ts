import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CardPreviewComponent } from './card-preview/card-preview.component';
import { GalleryPreviewComponent } from './gallery-preview/gallery-preview.component';
import { PreviewsService } from './services/previews.service';
import { WatchPageComponent } from './watch-page/watch-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MyProfilePageComponent } from './my-profile-page/my-profile-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HttpModule} from '@angular/http';
import { DataService } from './services/data.service';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EditProfileFormComponent } from './edit-profile-form/edit-profile-form.component';
import {LoginValidationService} from './services/login.validation.service';
import {EmailValidationService} from './services/email-validation.service';
import {UserService} from './services/user.service';
import {ImageUploadModule} from 'angular2-image-upload';
import {EmailConfirmService} from './services/email-confirm.service';
import {AuthService} from './services/auth.service';
import {AppErrorHandler} from './app-error-handler';
import {AuthGuardService} from './services/auth-guard.service';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { Oauth42Component } from './oauth42/oauth42.component';
import {Oauth42Service} from './services/oauth42.service';
import { OauthGoogleComponent } from './oauth-google/oauth-google.component';
import {OauthGoogleService} from './services/oauth-google.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { InViewportModule } from 'angular-inviewport';
import {WatchedMoviesService} from './services/watched-movies.service';
import { CommentsComponent } from './comments/comments.component';
import {CommentsService} from './services/comments.service';
import {Nl2BrPipe} from "nl2br-pipe";
import {ResetService} from './services/reset.service';
import { CreateNewPasswdComponent } from './create-new-passwd/create-new-passwd.component';
import {WatchService} from './services/watch.service';
import {LanguageService} from './services/language.service';
import {NotAuthGuardService} from './services/not-auth-guard.service';
import {WatchGuardService} from './services/watch-guard.service';
import {SearchProgressService} from './services/search-progress.service';
import {LangRedirectService} from './services/lang-redirect.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    GalleryComponent,
    CardPreviewComponent,
    GalleryPreviewComponent,
    WatchPageComponent,
    PageNotFoundComponent,
    MyProfilePageComponent,
    ProfilePageComponent,
    SignInPageComponent,
    SignUpPageComponent,
    ResetPasswordComponent,
    SignUpFormComponent,
    EditProfileFormComponent,
    Oauth42Component,
    OauthGoogleComponent,
    CommentsComponent,
    Nl2BrPipe,
    CreateNewPasswdComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ImageUploadModule.forRoot(),
    InViewportModule,
    RouterModule.forRoot([
      { path: '', component: GalleryComponent },
      { path: 'watch/:id', component: WatchPageComponent, canActivate: [AuthGuardService, WatchGuardService]},
      { path: 'my-profile', component: MyProfilePageComponent, canActivate: [AuthGuardService]},
      { path: 'profile/:id', component: ProfilePageComponent, canActivate: [AuthGuardService]},
      { path: 'sign-in', component: SignInPageComponent, canActivate: [NotAuthGuardService]},
      { path: 'sign-up', component: SignUpPageComponent, canActivate: [NotAuthGuardService]},
      { path: 'reset-password', component: ResetPasswordComponent},
      { path: 'oauth42', component: Oauth42Component },
      { path: 'oauth-google', component: OauthGoogleComponent },
      { path: 'create_new_password', component: CreateNewPasswdComponent},
      { path: '**', component: PageNotFoundComponent},
    ])
  ],
  providers: [
    DataService,
    PreviewsService,
    LoginValidationService,
    EmailValidationService,
    UserService,
    EmailConfirmService,
    AuthService,
    AuthGuardService,
    NotAuthGuardService,
    Oauth42Service,
    OauthGoogleService,
    WatchedMoviesService,
    CommentsService,
    ResetService,
    WatchService,
    LanguageService,
    WatchGuardService,
    SearchProgressService,
    LangRedirectService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
