import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecognizePage } from './recognize';

@NgModule({
  declarations: [
    RecognizePage,
  ],
  imports: [
    IonicPageModule.forChild(RecognizePage),
  ],
})
export class RecognizePageModule {}
