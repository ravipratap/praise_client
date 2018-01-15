import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { FileTransfer} from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';




import { MyApp } from './app.component';
import { AuthProvider } from '../providers/auth/auth';
import { AppState } from './app.global';
import { PlacesProvider } from '../providers/places/places';


@NgModule({ 
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      platforms : {
        core: {
          tabsPlacement: "top"
        }
      }
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AppState,
    PlacesProvider,
    Geolocation,
    FileTransfer,
    Camera
  ]
})
export class AppModule {}
