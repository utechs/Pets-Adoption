import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutgoingPage } from './outgoing.page';

const routes: Routes = [
  {
    path: '',
    component: OutgoingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutgoingPageRoutingModule {}
