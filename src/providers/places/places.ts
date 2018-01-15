import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PlacesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlacesProvider {
  apiKey:String = "AIzaSyAF9uDgvIvLmDw09Eow84sNzZXNjpFfRuU";
  foursquareClientId:String="FP1LV5HJIKGN3KYQGO4RJL4QIKMS4DC3H1HOX213IA11ORI4";
  foursquareClientSecret:String="IJOYXBNY3NYMBB1R3WXP0POPIJHSP4KNB5GJ0S5OHWQXXLW3";
  facebookApiId:String="307499993069266";
  facebookAppToken:String="307499993069266|9ssv6Lcsr6oHu2teaM5X_vtouKI";

  constructor(public http: Http) {
    console.log('Hello PlacesProvider Provider');
  }
  getNearbyPlaces(lat:number, lon: number) {
    console.log('lat1: ' + lat + ', lon: ' + lon);
    return new Promise(resolve => {
      this.http.get('/api/facebook/graph/search?type=place&center='+lat+','+lon+'&distance=500&access_token='+this.facebookAppToken+'&fields=name, id, location, category_list, checkins, is_verified, overall_star_rating, picture')
      // this.http.get('/api/google/nearby/json?location='+lat+','+lon+'&radius=500&types=establishment&key='+this.apiKey)
      // this.http.get('/api/foursquare/venues/explore?client_id='+this.foursquareClientId+ '&client_secret='+this.foursquareClientSecret+'&v=20170801&ll='+lat+','+lon)
      .map(res => res.json())
      .subscribe(data => {
        console.log("data from API");
        console.log(data);
        if(data){
          resolve(data.data);
        }
      });
    });
 }
  
  


}
