import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams,ToastController, LoadingController, ActionSheetController, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UniqueUserValidator } from './unique-user';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;
  showPassword= false;
  submitted = false;
  formErrors = {
    'firstName': '',
    'lastName': '',
    'email': '',
    'password': ''
    // 'isExperienced': ''
    // 'passwordRepeat': ''
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private fb: FormBuilder,
    public auth: AuthProvider,
    public loadCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController
    ) {
      console.log("building form");
    this.buildForm()
  }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }
 
  signInWithFB(): void {
    this.auth.fbSignIn();
    // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  signInWithGoogle(): void {
    this.auth.googleSignIn();
    // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
 
  signOutFromFb(): void {
    this.auth.fbSignOut();
    // this.authService.signOut();
  }

  ionViewDidLoad() {
    
  }

  onSubmit() {
    this.submitted = true;
    // this.onValueChanged(this.signupForm.value);
    console.log(this.signupForm.value);
    if(this.signupForm.valid){
      let loader = this.loadCtrl.create({
            content: "Signing up...",
            duration: 10000
      });
      loader.present();
      this.auth.signUp({
        firstName: this.signupForm.controls.firstName.value,
        lastName: this.signupForm.controls.lastName.value,
        email: this.signupForm.controls.email.value,
        password: this.signupForm.controls.password.value
        // isExperienced: this.signupForm.controls.isExperienced.value
      });
      // this.auth.signUp({
      //   firstName: this.signupForm.get('firstName').value,
      //   lastName: this.signupForm.get('lastName').value,
      //   email: this.signupForm.get('email').value,
      //   password: this.signupForm.get('password').value
      // });
      this.auth.signUp({
        firstName: this.signupForm.controls.firstName.value,
        lastName: this.signupForm.controls.lastName.value,
        email: this.signupForm.controls.email.value,
        password: this.signupForm.controls.password.value
        // isExperienced: this.signupForm.controls.isExperienced.value
      }).subscribe(data => {
          if(data.success){
            this.auth.storeUserData(data.token, data.user);
            this.showToastWithCloseButton(data.user.name);
            // this.navCtrl.setRoot('TabsPage');
          } else {
            //
          }
          loader.dismiss();
        },
        err =>  {
          console.log(err);
          loader.dismiss();
        },
        () => {
          
          console.log("regitration complete")
        }
      );
    }
  }

  showToastWithCloseButton(name) {
    const toast = this.toastCtrl.create({
      message: name + ',  you are signed up!',
      showCloseButton: true,
      duration: 2000,
      closeButtonText: 'Ok',
      position: 'top'
    });
    toast.present();
  }

  buildForm(): void {
  this.signupForm = this.fb.group({
    'firstName': ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(24)
      ]
    ],
    'lastName': ['', [
        Validators.maxLength(24)
      ]
    ],
    'email':    ['', [
        Validators.required,
        // Validators.email
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        ], UniqueUserValidator.checkUser
      ],
    'password':    ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(24)]
    ]
    // 'isExperienced': [true, Validators.required]
    // 'passwordRepeat':    ['', //Validators.required
    //     [
    //     Validators.required,
    //      this.matchingPassword('password')
    //     ]
    // ]
  });
 
  this.signupForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
 
  this.onValueChanged(); // (re)set validation messages now
}
onValueChanged(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;

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
    'firstName': {
      'required':      'First name is required.',
      'minlength':     'First name must be at least 2 characters long.',
      'maxlength':     'First name cannot be more than 24 characters long.'
    },
    'lastName': {
      'maxlength':     'Last name cannot be more than 24 characters long.'
    },
    'email': {
      'required':     'Email is required.',
      'pattern':        'Email entered is not valid',
      // 'email':        'Email entered is not valid',
      'usernameTaken': 'Account exists with given mail id'
    },
    'password': {
      'required': 'Password is required.',
      'minlength':     'Password must be at least 4 characters long.',
      'maxlength':     'Password cannot be more than 24 characters long.'
    },
    'isExperienced': {
      'required': 'Please indicate whether you are experienced.'
    }
    // 'passwordRepeat': {
    //   'required': 'Confirm Password is required.',
    //   'mismatchedPasswords':     'Both passwords are not matching.'
    // }
  };

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'View Terms of Use',
      buttons: [
        {
          text: 'User Agreement',
          // role: 'destructive',
          handler: () => {
            this.modalCtrl.create('UserAgreementPage', { policy: 'UserAgreement' }).present();
          }
        },{
          text: 'Privacy Policy',
          handler: () => {
            this.modalCtrl.create('UserAgreementPage', { policy: 'PrivacyPolicy' }).present();
          }
        },{
          text: 'Cookie Policy',
          handler: () => {
            this.modalCtrl.create('UserAgreementPage', { policy: 'CookiePolicy' }).present();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  
  toggleShowPassword(){
    this.showPassword=!this.showPassword; 
    return false;
  }

  // matchingPassword(otherControlName: string) {
  //   let thisControl: FormControl;
  //   let otherControl: FormControl;

  //   return function matchOtherValidate (control: FormControl) {

  //     if (!control.parent) {
  //       return null;
  //     }

  //     // Initializing the validator.
  //     if (!thisControl) {
  //       thisControl = control;
  //       otherControl = control.parent.get(otherControlName) as FormControl;
  //       if (!otherControl) {
  //         throw new Error('matchOtherValidator(): other control is not found in parent group');
  //       }
  //       otherControl.valueChanges.subscribe(() => {
  //         thisControl.updateValueAndValidity();
  //       });
  //     }

  //     if (!otherControl) {
  //       return null;
  //     }

  //     if (otherControl.value !== thisControl.value) {
  //       return {
  //         mismatchedPasswords: true
  //       };
  //     }

  //     return null;

  //   }
  // }

}
