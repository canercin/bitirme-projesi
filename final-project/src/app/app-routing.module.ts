import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserPageComponent } from './user-page/user-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResultsComponent } from './results/results.component';
const routes: Routes = [
  { path: '', component: HomeComponent },  // İlk açılışta HomeComponent yüklenecek
  { path: 'user', component: UserPageComponent },  // /user yoluna gidince UserPageComponent gelecek
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'results', component: ResultsComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
