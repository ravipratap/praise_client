import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController , Platform } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the RecognizePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recognize',
  templateUrl: 'recognize.html',
})
export class RecognizePage {
  @ViewChild('picture') picture;
  
  venue:any;
  praiseForm: FormGroup;
  submitted = false;
  showNoteInput= false;
  formErrors = {
    'person': '',
    'note': '',
    'picture': ''
  };

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      private fb: FormBuilder,
      public auth: AuthProvider,
      public loadCtrl: LoadingController,
      private toastCtrl: ToastController,
      private platform: Platform
    ) {
    this.venue=this.navParams.data.venue;
    console.log(this.venue);
    this.buildForm();
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.venue);
    console.log(this.picture);
    console.log(this.praiseForm.value);
    if(this.praiseForm.valid){
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
          console.log("Saving Praise");
          this.auth.savePraise(token, fileToUpload,
            {
            person: this.praiseForm.controls.person.value,
            note: this.praiseForm.controls.note.value,
            venue_name: this.venue.name,
            venue_longitude: this.venue.location.longitude,
            venue_latitude: this.venue.location.latitude,
            venue_city: this.venue.location.city,
            venue_country: this.venue.location.country,
            venue_street: this.venue.location.street,
            venue_zip: this.venue.location.zip,
            venue_id: this.venue.id,
            venue_is_verified: this.venue.is_verified, 
            venue_checkins: this.venue.checkins,  
            venue_rating: this.venue.overall_star_rating,
            venue_picture: this.venue.picture.data.url 
          }).subscribe(data => {
              if(data.success){
                // this.auth.storeUserData(data.token, data.user);
                this.showToastWithCloseButton();
                this.navCtrl.setRoot('TabsPage');
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
        // this.auth.uploadImage(this.praiseForm.controls.picture,token, 
        //   {
        //   person: this.praiseForm.controls.person.value,
        //   note: this.praiseForm.controls.note.value
        // });
        
      })
      .catch(err => {
        console.log("unable to fetch token")
        console.log(err);
      });
      console.log("paise finished");
      
    }
  }
  showToastWithCloseButton() {
    const toast = this.toastCtrl.create({
      message: 'Praise Saved!',
      showCloseButton: true,
      duration: 2000,
      closeButtonText: 'Ok',
      position: 'top'
    });
    toast.present();
  }

  buildForm(): void {
    this.praiseForm = this.fb.group({
      'person': [''],
      'note':    [''],
      'picture': ['']
    });
   
    this.praiseForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
   
    this.onValueChanged(); // (re)set validation messages now
  }
  onValueChanged(data?: any) {
      if (!this.praiseForm) { return; }
      const form = this.praiseForm;
  
      for (const field in this.formErrors) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
  
        if (control && control.dirty && !control.valid) {
          console.log(control.errors);
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
    validationMessages = {
      'person': {
        // 'required':      'Please enter email / mobile.'
      },
      'note': {
        // 'required': 'Password is required.'
      }
    };

    addNoteInput(){
      this.showNoteInput=true;
    }

}
