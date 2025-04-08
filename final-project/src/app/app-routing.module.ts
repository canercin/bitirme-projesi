import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserPageComponent } from './user-page/user-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ResultsComponent } from './results/results.component';
import { User2PageComponent } from './user2-page/user2-page.component';
import { User3PageComponent } from './user3-page/user3-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },  // İlk açılışta HomeComponent yüklenecek
  { path: 'user', component: UserPageComponent },  // /user yoluna gidince UserPageComponent gelecek
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'user2', component: User2PageComponent },
  { path: 'user3', component: User3PageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
