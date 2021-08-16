import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Pet } from '../../models/pet'
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class PetService {
  collectionName = 'Pets';
  petName: string;
  constructor(private afStore: AngularFirestore) { }

  createPet(petOb){
    return this.afStore.collection(this.collectionName).add(petOb);
  }
  getAllPets(){
    return this.afStore.collection(this.collectionName, ref => {
      return ref.where('status', '==', 'Active')
    }).snapshotChanges();
  }
  updatePet(petOb){
    this.afStore.doc(this.collectionName + '/' + petOb.id).set(petOb);
  }
  deletePet(petID){
    this.afStore.doc(this.collectionName + '/' + petID).delete();
  }
  getPetsByUser(userId: string){
    return this.afStore.collection(this.collectionName, ref => {
      return ref.where('uid', '==', userId)
    }).snapshotChanges();
  }

  getOutgoingsByUser(userId){
    return this.afStore.doc('users'+ '/' + userId).collection('Outgoing Requests').snapshotChanges();
  }
  getIncomingsByUser(userId){
    return this.afStore.doc('users'+ '/' + userId).collection('Incoming Requests').snapshotChanges();
  }

  //Owner Operations
  acceptRequest(rid, sUid, uid, pid){
    this.afStore.doc('users' + '/' + uid).collection('Incoming Requests').doc(rid).set({
      status: 'Accepted'
    },{merge: true}).then(res => {
      this.afStore.doc('users' + '/' + sUid).collection('Outgoing Requests').doc(rid).set({
        status: 'Accepted'
      },{merge: true});
    }).then(res => {
      this.afStore.doc('Pets' + '/' + pid).set({
        status: 'completed'
      },{merge: true});
    });
  }
  rejectRequest(rid, sUid, uid){
    this.afStore.doc('users' + '/' + uid).collection('Incoming Requests').doc(rid).set({
      status: 'Rejected'
    },{merge: true}).then(res => {
      this.afStore.doc('users' + '/' + sUid).collection('Outgoing Requests').doc(rid).set({
        status: 'Rejected'
      },{merge: true});
    });
  }

//Sender Operations
  sendRequest(request, sUid, oUid){
    request.ownerId = oUid;
    return this.afStore.doc('users' + '/' + sUid).collection('Outgoing Requests').add(request).then(res => {
      request.ownerId = null;
      request.senderId = sUid;
      this.afStore.doc('users'+ '/' + oUid).collection('Incoming Requests').doc(res.id).set(request);
    });
  } 
//Check if the sender has sent a request before
//I should add additional condition related to request status
  isFirstTime(petID, uid){
    return this.afStore.doc('users' + '/' + uid).collection('Outgoing Requests', ref => ref.where('petId', '==', petID)).valueChanges().pipe(first()).toPromise();
  }

  cancelRequest(rid, oUid, uid){
    this.afStore.doc('users' + '/' + uid).collection('Outgoing Requests').doc(rid).delete().then(() => {
      this.afStore.doc('users' + '/' + oUid).collection('Incoming Requests').doc(rid).delete();
    });
  }
  setThumb(pId, url){
    this.afStore.doc('Pets' + '/' + pId).set({
      thumbnail: url
    },{merge: true})
  }
}
