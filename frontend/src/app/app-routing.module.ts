import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinComponent } from './join/join.component';
import { MessageComponent } from './message/message.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardServiceService } from './services/auth/auth-guard-service.service';

import { VideoCallComponent } from './video-call/video-call.component';

const routes: Routes = [
  {path: 'video-call', component: VideoCallComponent,canActivate: [AuthGuardServiceService]},
  {path: 'message', component: MessageComponent,canActivate: [AuthGuardServiceService]},
  {path: 'join', component: JoinComponent},
  { path: '',   redirectTo: '/join', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
