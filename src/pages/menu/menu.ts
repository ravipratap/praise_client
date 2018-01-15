import { Component, ViewChild } from '@angular/core';
import { App, IonicPage, Nav, NavController, NavParams, MenuController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthProvider } from '../../providers/auth/auth';
import { SocialUser } from '../../entities/social-user';



export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

    // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Thanks', name: 'TabsPage', component: 'TabsPage', tabComponent: 'FeedPage', index: 0, icon: 'happy' },
    { title: 'Appreciate', name: 'TabsPage', component: 'TabsPage', tabComponent: 'ColleaguePage', index: 1, icon: 'people' },
    { title: 'Explore', name: 'TabsPage', component: 'TabsPage', tabComponent: 'ExplorePage', index: 3, icon: 'search' },
    { title: 'Me', name: 'TabsPage', component: 'TabsPage', tabComponent: 'ProfilePage', index: 4, icon: 'person' }
  ]; 
  loggedInPages: PageInterface[] = [
    { title: 'Settings', name: 'SettingsPage', component: 'SettingsPage', icon: 'cog' }
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Sign in', name: 'SigninPage', component: 'SigninPage', icon: 'log-in' },
    { title: 'Change Theme', name: 'ThemePage', component: 'ThemingPage', icon: 'cog' },
    { title: 'Sign up', name: 'SignupPage', component: 'SignupPage', icon: 'person-add' }
  ];
  rootPage: string;
  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private menu: MenuController,
    private storage: Storage,
    private auth:AuthProvider,
    private app: App
  ) {
    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage='TabsPage';
        } else {
          this.rootPage='TourPage';
        }
        // this.platformReady()
      });
    this.auth.fbAuthState().subscribe((socialUser) => {

      console.log('FB Event received');  
      console.log(socialUser);
      if(socialUser){
        setTimeout(() => {
          console.log('Fetching contacts initialized');  
          this.auth.fetchmail();
          }, 1000);
        }
    });
    // auth.authenticationNotifier().subscribe((role) => {
    //   if (role) {
    //     console.log("role is "+ role);
    //     this.enableMenu(true);
    //     this.rootPage='TabsPage';
    //   } else {
    //     this.rootPage='LoginPage';
    //     this.enableMenu(false);
    //   }
    // });
  }

  

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }


  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs()[0] && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    // Set the root of the nav with params if it's a tab index
    } else {
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

  }
   onLogoutClick() {
    console.log("logging out"); 
       //   // Give the menu time to close before changing to logged out
    //   this.userData.logout();
    // this.nav.setRoot('LoginPage');
    this.auth.logOut();
    this.nav.setRoot('TabsPage');
    return false;

  }
  openTour() {
    this.nav.setRoot('TourPage');
  }
  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {

      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'dark';
      }
      return 'light';
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'dark';
    }
    return 'light';
  }

}
