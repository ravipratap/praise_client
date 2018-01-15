import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  // @ViewChild(Nav) nav: Nav;

  tab1Root: any = 'FeedPage';
  tab2Root: any = 'ColleaguePage';
  tab3Root: any = 'ExplorePage';
  // tab3Root: any = 'ScorePage';
  tab4Root: any = 'ProfilePage';
  mySelectedIndex: number;

  constructor(private navParams: NavParams, private navCtrl: NavController) {

    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  addPage() {
    this.navCtrl.push('SelectCategoryPage');
  }

}
