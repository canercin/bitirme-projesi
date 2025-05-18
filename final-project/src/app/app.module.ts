import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Sadece bunu import ettik
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WebcamModule } from 'ngx-webcam';
import { HttpClientModule } from '@angular/common/http';
import { UserPageComponent } from './user-page/user-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResultsComponent } from './results/results.component';
import { User2PageComponent } from './user2-page/user2-page.component';
import { User3PageComponent } from './user3-page/user3-page.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientService } from './services/patient.service';
import { DiagnosisService } from './services/diagnosis.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserPageComponent,
    SignUpComponent,
    SignInComponent,
    ResultsComponent,
    User2PageComponent,
    User3PageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    WebcamModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AuthService, PatientService, DiagnosisService],
  bootstrap: [AppComponent]
})
export class AppModule { }
