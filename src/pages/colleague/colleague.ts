import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,  Content } from 'ionic-angular';

/**
 * Generated class for the ColleaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-colleague',
  templateUrl: 'colleague.html',
})
export class ColleaguePage {
  @ViewChild(Content) content: Content;
  segment:string= "everyone";
  hiddenSearch:boolean= true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openSearch() {
    this.content.scrollToTop();
    this.hiddenSearch=false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ColleaguePage');
  }

}
