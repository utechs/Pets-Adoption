import { Component, OnInit } from '@angular/core';
import { PetService } from '../../../services/pet/pet.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.page.html',
  styleUrls: ['./outgoing.page.scss'],
})
export class OutgoingPage implements OnInit {

  myOutgoings: any;
  uid: string;
  oUid: string;


  constructor(
    private pService: PetService,
    private authService: AuthService
  ) { 
    this.authService.getLoggedInUser().then(res => {
      if(res){
        this.uid = res.uid;
        this.getOutgoings();
      }
    },error =>{
      console.log(error.message);
    });
  }

  ngOnInit() {
  }
  getOutgoings(){
    this.pService.getOutgoingsByUser(this.uid).subscribe(data => {
      this.myOutgoings = data.map(e => {
        return {
          id: e.payload.doc.id,
          petName: e.payload.doc.data()['petName'],
          status: e.payload.doc.data()['status'],
          ownerId: e.payload.doc.data()['ownerId']
        }
      });
    });
  }
  cancelRequest(rid, oUid){
    this.pService.cancelRequest( rid, oUid, this.uid );
  }
}
