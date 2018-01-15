import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppState } from '../../app/app.global';

/**
 * Generated class for the ThemePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-theme',
  templateUrl: 'theme.html',
})
export class ThemePage {

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private global: AppState
  ) {
  }

 changeTheme(theme) {
   this.global.set('theme', theme);
 }

}
