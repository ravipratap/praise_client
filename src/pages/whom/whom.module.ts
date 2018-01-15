import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WhomPage } from './whom';

@NgModule({
  declarations: [
    WhomPage,
  ],
  imports: [
    IonicPageModule.forChild(WhomPage),
  ],
})
export class WhomPageModule {}
