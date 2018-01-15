import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SelectCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-category',
  templateUrl: 'select-category.html',
})
export class SelectCategoryPage {
  category:String;
  nextEnabled:boolean=false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  enableNext(){
    console.log("category: "+ this.category);
    if(this.category){
      this.nextEnabled=true;
    }
  }
  categorySelected(){
    this.navCtrl.push('WherePage', {category: this.category});
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectCategoryPage');
  }

}
