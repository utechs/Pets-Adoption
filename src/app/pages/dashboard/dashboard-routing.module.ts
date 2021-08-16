import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'pets',
        children: [
          {
            path: '',
            loadChildren: () => import('./pets/pets.module').then(m => m.PetsPageModule) 
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'incoming',
        children: [
          {
            path: '',
            loadChildren: () => import('./incoming/incoming.module').then(m => m.IncomingPageModule)
          }
        ]
      },
      {
        path: 'outgoing',
        children: [
          {
            path: '',
            loadChildren: () => import('./outgoing/outgoing.module').then(m => m.OutgoingPageModule)
          }
        ]
      }

    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
