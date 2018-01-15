import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppState } from './app.global'; 



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = "MenuPage";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private global:AppState) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.global.set('theme', 'theme-insta');
      // this.global.set('ENDPOINT', 'http://192.168.0.103:3000');
      this.global.set('ENDPOINT', 'http://localhost:3000');
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

