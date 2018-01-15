import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, Content } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Location } from '../../interfaces/location';
import { PlacesProvider } from '../../providers/places/places';


/**
 * Generated class for the WherePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-where',
  templateUrl: 'where.html',
})
export class WherePage {
  @ViewChild(Content) content: Content;
  hiddenLoader:boolean=true;
  venues:any;
  currentLocation: Location = {lat:0 , lon: 0};

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams, 
      private geolocation: Geolocation,
      public loadCtrl: LoadingController,
      private placesProvider: PlacesProvider
    ) {

      this.presentLoader();
    this.geolocation.getCurrentPosition().then(pos => {
      console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      this.currentLocation.lat = pos.coords.latitude;
      this.currentLocation.lon = pos.coords.longitude;
      this.currentLocation.timestamp = pos.timestamp;
      return this.currentLocation;
    }).then(loc => {
      this.presentLoader();
      placesProvider.getNearbyPlaces(loc.lat, loc.lon).then(data=>{
        this.venues=data;
       this.hideLoader();
      });
    })
    .catch(
      (err) => {
        console.error('Could not read current location');
        console.error(err.message);
      });
  }
  presentLoader(){
    this.hiddenLoader=false;
    setTimeout(()=>{
      this.hiddenLoader=true;
    }, 10000);
  }
  hideLoader(){
    this.hiddenLoader=true;
  }
  close() {
    this.navCtrl.pop();
  }
  openSearch() {
    this.content.scrollToTop();
    // this.hiddenSearch=false;

    this.placesProvider.getNearbyPlaces(this.currentLocation.lat, this.currentLocation.lon)
    // this.navCtrl.push("RecognizePage");
  }
  scrollToTop() {
    this.content.scrollToTop();
  }
  getLocations(ev: any) {

  }
  // closeSearchBar(ev: any){
  //   console.log("cancel called from search"); 
  //   this.hiddenSearch=true;
  // }
  selectVenue(venue:any){
    this.navCtrl.push('RecognizePage', {venue:venue});
  }
  skipVenue(){
    this.navCtrl.push('RecognizePage'); 
  }
  addPlace(){
    this.navCtrl.push('AddPlacePage');
  }

}
