import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  signUpForm: FormGroup;
  submitError: string;
  authRedirectResult: Subscription;
  genders: Array<string>;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ],
    'fullName': [
      { type: 'required', message: 'Full Name is required.' },
      { type: 'minlength', message: 'Full Name must be at least 6 characters long.' },
      { type: 'pattern', message: 'Only letters accepted'}
    ],
    'age': [
      { type: 'required', message: 'Age is required.' },
      { type: 'min', message: 'Get old and come back '},
      { type: 'Max', message: 'Too old' },

      { type: 'pattern', message: 'Only Numbers accepted'}
    ]
  };

  constructor(
    public angularFire: AngularFireAuth,
    public router: Router,
    private ngZone: NgZone,
    private authService: AuthService,
    private afStore: AngularFirestore,
    )
  { 
    this.genders = [
      'Male',
      'Female'
    ];
    

    this.signUpForm = new FormGroup({
      'fullName': new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('[a-zA-Z ]*')
      ])),
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      'gender': new FormControl('',Validators.required),
      'age': new FormControl('', Validators.compose([
        Validators.min(18),
        Validators.max(90),
        Validators.required
      ])),
    });
    this.authRedirectResult = this.authService.getRedirectResult()
    .subscribe(result => {
      if (result.user) {
        this.redirectLoggedUserToProfilePage();
      } else if (result.error) {
        this.submitError = result.error;
      }
    });
  }

  ngOnInit() {
  }

  redirectLoggedUserToProfilePage() {
    this.ngZone.run(() => {
      this.router.navigate(['home']);
    });
  }

  signUpWithEmail() {
    this.authService.signUpWithEmail(this.signUpForm.value['email'], this.signUpForm.value['password'])
    .then(user => {
      user.user.updateProfile({
        displayName: this.signUpForm.value['fullName'],
        photoURL: 'https://s3-us-west-2.amazonaws.com/ionicthemes/otros/avatar-placeholder.png'
      });
      this.afStore.collection('users').doc(user.user.uid).set({
        gender: this.signUpForm.value['gender'],
        age: this.signUpForm.value['age'],
        isAdmin: false,
        fName: this.signUpForm.value['fullName'],
        profileImg: 'https://s3-us-west-2.amazonaws.com/ionicthemes/otros/avatar-placeholder.png'
      });
      // navigate to user profile
      this.redirectLoggedUserToProfilePage();
    })
    .catch(error => {
      this.submitError = error.message;
    });
  }

  facebookSignUp() {
    this.authService.signInWithFacebook()
    .then((result: any) => {
      if (result.additionalUserInfo) {
        this.authService.setProviderAdditionalInfo(result.additionalUserInfo.profile);
      }
      this.afStore.collection('users').doc(result.user.uid).set({
        gender: this.signUpForm.value['gender'],
        age: this.signUpForm.value['age'],
        isAdmin: false
      });
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // const token = result.credential.accessToken;
      // The signed-in user info is in result.user;
      this.redirectLoggedUserToProfilePage();
    }).catch((error) => {
      // Handle Errors here.
      console.log(error);
    });
  }

  googleSignUp() {
    this.authService.signInWithGoogle()
    .then((result: any) => {
      if (result.additionalUserInfo) {
        this.authService.setProviderAdditionalInfo(result.additionalUserInfo.profile);
      }
      this.afStore.collection('users').doc(result.user.uid).set({
        gender: this.signUpForm.value['gender'],
        age: this.signUpForm.value['age'],
        isAdmin: false,
        fName: result.user.displayName,
        profileImg: 'https://s3-us-west-2.amazonaws.com/ionicthemes/otros/avatar-placeholder.png'
      });
      this.redirectLoggedUserToProfilePage();
    }).catch((error) => {
      // Handle Errors here.
      console.log(error);
    });
  }

}
