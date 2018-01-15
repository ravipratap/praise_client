import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';



/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild('picture') picture;
  user:any ={};
  profileImageUrl: String;
  profileForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private fb: FormBuilder,
    public auth: AuthProvider,
    public loadCtrl: LoadingController,
    private toastCtrl: ToastController) {
      this.getProfile();
      this.buildForm();
  }


  onSubmit() {
    console.log(this.picture);
    console.log(this.profileForm.value);
    if(this.profileForm.valid){
      let loader = this.loadCtrl.create({
            content: "Sending Thanks...",
            duration: 10000
      });
      loader.present();
      this.auth.loadToken().then(token => {
        let fileBrowser = this.picture.nativeElement;
        if (fileBrowser.files && fileBrowser.files[0]) {
          let fileToUpload=fileBrowser.files[0];
          console.log(fileBrowser.files[0]);
          console.log("Saving profile Picture");
          this.auth.saveProfilePicture(token, fileToUpload).subscribe(data => {
              if(data.success){
                // this.auth.storeUserData(data.token, data.user);
                this.showToastWithCloseButton();
                // this.navCtrl.setRoot('TabsPage');
              } else {
                console.log(data);
              }
            },
            err =>  {
              console.log(err);
    
            },
            () => {
              loader.dismiss();
              console.log("Login complete");
            }
          );
        }
        // this.auth.uploadImage(this.profileForm.controls.picture,token, 
        //   {
        //   person: this.profileForm.controls.person.value,
        //   note: this.profileForm.controls.note.value
        // });
        
      });
      
    }
  }
  showToastWithCloseButton() {
    const toast = this.toastCtrl.create({
      message: 'Profile Pic Saved!',
      showCloseButton: true,
      duration: 2000,
      closeButtonText: 'Ok',
      position: 'top'
    });
    toast.present();
  }
  buildForm(): void {
    this.profileForm = this.fb.group({
    });
  }

  getProfile() {
      this.auth.loadToken().then(token => {
        this.auth.getProfile(token).subscribe(data => {
          console.log(data);  
          if(data && data.user){
            this.user=data.user;
            console.log("data updated");
            console.log(this.user); 
            if(this.user.pictureName){
              this.profileImageUrl=this.auth.getImageUrl(this.user.pictureName);
            }
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
            console.log("Load Profile complete");
          }
        );
        
      });
      
    }
  }