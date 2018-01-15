import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  
    signinForm: FormGroup;
    submitted = false;
    showPassword= false;
    formErrors = {
      'username': '',
      'password': ''
    };
  
    constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      private fb: FormBuilder,
      public auth: AuthProvider,
      public loadCtrl: LoadingController,
      private toastCtrl: ToastController
      ) {
        console.log("building form");
      this.buildForm()
    }
  
    ionViewDidLoad() {
      
    }
    signup() {
      this.navCtrl.setRoot('SignupPage');
    }
  
    onSubmit() {
      this.submitted = true;
      console.log(this.signinForm.value);
      if(this.signinForm.valid){
        let loader = this.loadCtrl.create({
              content: "Signing in...",
              duration: 10000
        });
        loader.present();
        this.auth.authenticate({
          username: this.signinForm.controls.username.value,
          password: this.signinForm.controls.password.value
        }).subscribe(data => {
            if(data.success){
              this.auth.storeUserData(data.token, data.user);
              this.showToastWithCloseButton(data.user.name);
              // this.navCtrl.setRoot('TabsPage');
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
    }
    showToastWithCloseButton(name) {
      const toast = this.toastCtrl.create({
        message: name + ',  you are signed in!',
        showCloseButton: true,
        duration: 2000,
        closeButtonText: 'Ok',
        position: 'top'
      });
      toast.present();
    }
  
    buildForm(): void {
    this.signinForm = this.fb.group({
      'username': ['', Validators.required],
      'password':    ['', Validators.required]
    });
   
    this.signinForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
   
    this.onValueChanged(); // (re)set validation messages now
  }
  onValueChanged(data?: any) {
      if (!this.signinForm) { return; }
      const form = this.signinForm;
  
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
      'username': {
        'required':      'Please enter email / mobile.'
      },
      'password': {
        'required': 'Password is required.'
      }
    };
  
    toggleShowPassword(){
      this.showPassword=!this.showPassword;
      return false;
    }
  
  }
  
