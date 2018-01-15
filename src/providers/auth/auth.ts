import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs/Rx';
import { AppState } from '../../app/app.global';
import { SocialUser} from '../../entities/social-user';

import 'rxjs/add/operator/map';


import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

declare let FB: any;
declare let gapi: any;
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthProvider {
  authToken:any;
  user:any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  // global.state['ENDPOINT']:string ='https://192.168.0.102:3000'; 
  // // global.state['ENDPOINT']:string ='http://localhost:3000';
  private _authNotifier: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  protected auth2: any;
  private fbScope = 'email,public_profile';
  private _fbAuthState: BehaviorSubject<SocialUser> = new BehaviorSubject(null);
  fbAuthState(): Observable<SocialUser> {
    return this._fbAuthState.asObservable();
  } 
  constructor(
    public http: Http,
    public storage: Storage,
    private transfer: FileTransfer,
    private global:AppState
  ) {
    console.log('Hello AuthProvider Provider');
    this.initializeFB();
    // this.initializeGoogle();
    
  }
  
  loadScript(provider:string, src: string): void {

      let signInJS = document.createElement("script");
      signInJS.async = true;
      signInJS.src = src;
      if(provider=='GOOGLE'){
        signInJS.onload = () =>{this.googleInitAFterScript(this._fbAuthState)};
      } else {
        signInJS.onload = () =>{this.fbInitAFterScript(this._fbAuthState)};
      }
      document.head.appendChild(signInJS);
  }
  initializeFB(): Promise<{}> {
    console.log('inside Initialize FB');
    return new Promise((resolve, reject) => {
      this.loadScript("FACEBOOK",  
        "//connect.facebook.net/en_US/sdk.js"
      );
    });
  }
  fbInitAFterScript(authState){
    console.log('FB init started'); 
    FB.init({
      appId: '307499993069266',
      autoLogAppEvents: true,
      cookie: true,
      xfbml: true,
      version: 'v2.9'
    });
    // FB.AppEvents.logPageView(); #FIX for #18
    FB.getLoginStatus(function (response: any) {
      if (response.status === 'connected') {
          let authResponse = response.authResponse;
          FB.api('/me?fields=name,email,picture,first_name,last_name', (response: any) => {
          let socialUser: SocialUser = new SocialUser();

          socialUser.id = response.id;
          socialUser.name = response.name;
          socialUser.email = response.email;
          socialUser.photoUrl = "https://graph.facebook.com/" + response.id + "/picture?type=normal";
          socialUser.firstName = response.first_name;
          socialUser.lastName = response.last_name;
          socialUser.authToken = authResponse.accessToken;
          // console.log('FB Initialized'); 
          // console.log(socialUser);
          // console.log(this._fbAuthState);
          // // resolve(socialUser);
          authState.next(socialUser); 
        });
      }
    });

  }
  fbSignIn(): Promise<SocialUser> {

    console.log('inside signIn FB');
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          let authResponse = response.authResponse;
          FB.api('/me?fields=name,email,picture,first_name,last_name', (response: any) => {
            let socialUser: SocialUser = new SocialUser();

            socialUser.id = response.id;
            socialUser.name = response.name;
            socialUser.email = response.email;
            socialUser.photoUrl = "https://graph.facebook.com/" + response.id + "/picture?type=normal";
            socialUser.firstName = response.first_name;
            socialUser.lastName = response.last_name;
            socialUser.authToken = authResponse.accessToken;
            this._fbAuthState.next(socialUser);
            resolve(socialUser);
          });
        }
      }, {scope: this.fbScope});
    });
  }

  fbSignOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log("logging FB out"); 
      if(typeof FB !== 'undefined'){
        FB.logout((response: any) => {
          console.log("user is logged out of FB");
          resolve();
        });
      }
    });
  }

  initializeGoogle(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.loadScript("GOOGLE",
        "//apis.google.com/js/platform.js");
    });
  }
  fetchmail() {
    if(gapi){

      
      gapi.load('client:auth2', () => {
          gapi.client.init({
            discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1'],
            client_id: '110520399315-cf1kllop5ud1afjbu8827a4jpete6517.apps.googleusercontent.com',
            scope: 'email https://www.googleapis.com/auth/contacts.readonly'
          }).then(() => {
            console.log("Started Fetched mail contacts"); 
              return gapi.client.people.people.connections.list({
                  resourceName:'people/me',
                  // pageToken: "^CAAQza_eh4ksGiEKHQjIARoCCAMiDggCEAEYASIEAQACBSgDKgIIBDADEAI",
                  personFields: 'emailAddresses,names,phoneNumbers'
              });
          }).then(
              (res) => {
                  // console.log("Res: " + JSON.stringify(res)); 
                  console.log(res.result);
                  console.log("Fetched mail contacts"); 

                  // this.userContacts.emit(this.transformToMailListModel(res.result));
              },
              error => console.log("ERROR " + JSON.stringify(error))
          );
      });
    }
  }
  googleInitAFterScript(authState){
    gapi.load('auth2', () => {
      // khannarohit0@gmail.com project
      this.auth2 = gapi.auth2.init({
        client_id: '110520399315-cf1kllop5ud1afjbu8827a4jpete6517.apps.googleusercontent.com',
        scope: 'email https://www.googleapis.com/auth/contacts.readonly'
      });

      this.auth2.then(() => { 
        if (this.auth2.isSignedIn.get()) {
          let socialUser: SocialUser = new SocialUser();
          let profile = this.auth2.currentUser.get().getBasicProfile();
          // console.log(profile); 
          socialUser.id = profile.getId();
          socialUser.name = profile.getName();
          socialUser.email = profile.getEmail();
          socialUser.photoUrl = profile.getImageUrl();
          socialUser.firstName = profile.getGivenName();
          socialUser.lastName = profile.getFamilyName();
          // console.log(socialUser);
          // this.fetchContacts(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token);
          
          authState.next(socialUser);
          // setTimeout(() => this.fetchmail(), 1000); 
          
        }
      });
    });
  }
  googleSignIn(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      let promise = this.auth2.signIn();

      promise.then(() => {
        let socialUser: SocialUser = new SocialUser();
        let profile = this.auth2.currentUser.get().getBasicProfile();

        socialUser.id = profile.getId();
        socialUser.name = profile.getName();
        socialUser.email = profile.getEmail();
        socialUser.photoUrl = profile.getImageUrl();

        this._fbAuthState.next(socialUser);
        resolve(socialUser);
      });
    });
  }

  googleSignOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.auth2){
        this.auth2.signOut().then((err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  }
  authenticationNotifier(): Observable<boolean> {
    return this._authNotifier.asObservable();
  }
  signUp(user:any){
    let headers=new Headers();
    headers.append('Content-Type', 'application/json');
    console.log("registering user");
     console.log(user);
    return this. http.post(this.global.state['ENDPOINT']+'/users/signup', user, {headers: headers})
      .map(res => res.json());
  }

  authenticate(user:any){
  let headers=new Headers();
  headers.append('Content-Type', 'application/json');
  console.log("logging in user");
  console.log(user);
  return this. http.post(this.global.state['ENDPOINT']+'/users/authenticate', user, {headers: headers})
    .map(res => res.json());
  }

  getProfile(token) {
    this.authToken=token;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authToken);
      console.log(this.authToken);
      return this.http.get(this.global.state['ENDPOINT']+'/users/profile', {headers: headers})
        .map(res => res.json());
    
  }
  loadToken(){
    console.log("fetching token")
    return this.storage.get('id_token');
  }
  storeUserData(token, user){
    // console.log(token);
    // console.log(user);
    this.storage.set('id_token', token).then(()=> {
      console.log("token saved  "+ this.storage.get('id_token'));
    });
    

    this.storage.set('user', JSON.stringify(user));
    this.storage.set(this.HAS_LOGGED_IN, true);
    this._authNotifier.next(user.role);
    this.authToken=token;
    this.user=user;
  }
   loggedIn() {
    // return tokenNotExpired();
  }
  unauthorizedAccess(){
    this._authNotifier.next(null);
  }
  logOut(){
    this.authToken=null;
    this.user=null;
    this.storage.remove(this.HAS_LOGGED_IN);
    this._authNotifier.next(null);
    this.fbSignOut();
    this.googleSignOut();
    //  this.storage.remove(this.HAS_SEEN_TUTORIAL);
     this.storage.remove('id_token');
     this.storage.remove('user');
    //  window.location.reload();
  } 

  // getUsername(): Promise<string> {
  //   return this.storage.get('username').then((value) => {
  //     return value;
  //   });
  // };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }








  getFeed(token) { 
    this.authToken=token;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authToken);
      // console.log(this.authToken);
      return this.http.get(this.global.state['ENDPOINT']+'/users/praises', {headers: headers})
        .map(res => res.json());
    
  }
  saveProfilePicture(token, fileToUpload) {
        console.log("Inside Saving Praise");
        this.authToken=token;
          let headers = new Headers();
          // headers.append('Content-Type', 'application/json');
          headers.append('Authorization', this.authToken);
    
          console.log(this.authToken);
          let input = new FormData();
          input.append("picture", fileToUpload);
          return this.http.post(this.global.state['ENDPOINT']+'/users/profilePicture',input,{headers: headers})
            .map(res => res.json());
        
  }

  savePraise(token, fileToUpload, praise) {

    console.log("Inside Saving Praise");
    this.authToken=token;
      let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authToken);

      console.log(this.authToken);
      let input = new FormData();
      input.append("picture", fileToUpload);
      input.append("person", praise.person);
      input.append("note", praise.note);
      input.append("venue_name", praise.venue_name);
      input.append("venue_longitude", praise.venue_longitude);
      input.append("venue_latitude", praise.venue_latitude);
      input.append("venue_city", praise.venue_city);
      input.append("venue_country", praise.venue_country);
      input.append("venue_street", praise.venue_street);
      input.append("venue_zip", praise.venue_zip);
      input.append("venue_id", praise.venue_id);
      input.append("venue_is_verified", praise.venue_is_verified);
      input.append("venue_checkins", praise.venue_checkins);
      input.append("venue_rating", praise.venue_rating);
      input.append("venue_picture", praise.venue_picture);
      console.log("praise.note"+ praise.note); 
      return this.http.post(this.global.state['ENDPOINT']+'/users/images',input,{headers: headers})
        .map(res => res.json());
    
  }
  getImageUrl(name) {
    return this.global.state['ENDPOINT']+'/users/images/'+name;
  }
  getImages() {
    return this.http.get(this.global.state['ENDPOINT']+'/users/images').map(res => res.json());
  }
 
  deleteImage(img) {
    return this.http.delete(this.global.state['ENDPOINT']+'/users/images/' + img._id);
  }
 
  uploadImage(img, token, user) {
 
    // Destination URL
    let url = this.global.state['ENDPOINT']+'/users/images';
 
    // File for Upload
    var targetPath = img; 
 
    var options: FileUploadOptions = {
      fileKey: 'picture',
      chunkedMode: false,
      mimeType: 'multipart/form-data',
      params: { 'desc': "nothing" }
    };
 
    const fileTransfer: FileTransferObject = this.transfer.create();
 
    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options);
  }
 
}



