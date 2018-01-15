import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddChallengePage } from './add-challenge';

@NgModule({
  declarations: [
    AddChallengePage,
  ],
  imports: [
    IonicPageModule.forChild(AddChallengePage),
  ],
})
export class AddChallengePageModule {}
