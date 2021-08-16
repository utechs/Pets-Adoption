import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutgoingPageRoutingModule } from './outgoing-routing.module';

import { OutgoingPage } from './outgoing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutgoingPageRoutingModule
  ],
  declarations: [OutgoingPage]
})
export class OutgoingPageModule {}
