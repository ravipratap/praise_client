import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ColleaguePage } from './colleague';

@NgModule({
  declarations: [
    ColleaguePage,
  ],
  imports: [
    IonicPageModule.forChild(ColleaguePage),
  ],
})
export class ColleaguePageModule {}
