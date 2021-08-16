import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private afStore: AngularFirestore,
    private authService: AuthService,
    private afStorage: AngularFireStorage
  ) { }


}
