import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  praises:any = [];
  baseUrl: String;
  loadProgress: Number =25; 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthProvider) {
      this.getFeed(null);
  }
  doRefresh(refresher){
    this.getFeed(refresher);
  }
  getFeed(refresher) {
    this.auth.loadToken().then(token => {
      this.auth.getFeed(token).subscribe(data => {
        console.log(data);  
        if(data && data.praiseList){
          this.praises=data.praiseList;
          this.baseUrl=this.auth.getImageUrl('');
        }
        // if(data.success){
        //     // console.log(data);
        //   } else {
        //     // console.log(data);
        //   }
        },
        err =>  {
          console.log(err);
        },
        () => {
          if(refresher){
            refresher.complete();
          }
          console.log("Feed Load complete");
        }
      );
      
    });
    
  }
  viewScore(){
    this.navCtrl.push('ScorePage')
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedPage');
  }
  ionViewDidEnter() {

    console.log('ionViewDidEnter FeedPage');
  }

}
