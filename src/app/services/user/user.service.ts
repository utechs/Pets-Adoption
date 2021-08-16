import { Injectable } from '@angular/core';
import { PetService } from '../pet/pet.service';
import { AuthService } from '../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore} from '@angular/fire/firestore';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: any;
  constructor(
    private pService: PetService,
    private router: Router,
    private authService: AuthService,
    private afStore: AngularFirestore

  ) { 

    this.currentUser = authService.getLoggedInUser();
  }

  getFirstName(displayName: string){
    let firstName = displayName.split(" ", 1);
    return firstName;
  }

  getUserById(uid: string){
    return this.afStore.doc('users'+'/'+uid).valueChanges();
  }

}
