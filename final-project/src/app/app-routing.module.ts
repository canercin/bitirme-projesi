import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserPageComponent } from './user-page/user-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },  // İlk açılışta HomeComponent yüklenecek
  { path: 'user', component: UserPageComponent }  // /user yoluna gidince UserPageComponent gelecek
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
