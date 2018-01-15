import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar';

@NgModule({
  declarations: [
    FeedPage,
    ProgressBarComponent
  ],
  imports: [
    IonicPageModule.forChild(FeedPage),
  ],
})
export class FeedPageModule {}
