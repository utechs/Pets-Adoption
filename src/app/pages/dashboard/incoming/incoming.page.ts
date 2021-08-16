import { Component, OnInit } from '@angular/core';
import { PetService } from '../../../services/pet/pet.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.page.html',
  styleUrls: ['./incoming.page.scss'],
})
export class IncomingPage implements OnInit {

  myIncomings: any;
  uid: string;


  constructor(
    private pService: PetService,
    private authService: AuthService
  ) { 
    this.authService.getLoggedInUser().then(res => {
      if(res){
        this.uid = res.uid;
        this.getIncomings();
      }
    },error =>{
      console.log(error.message);
    });
  }

  ngOnInit() {
  }

  getIncomings(){
    this.pService.getIncomingsByUser(this.uid).subscribe(data => {
      this.myIncomings = data.map(e => {
        return {
          id: e.payload.doc.id,
          petName: e.payload.doc.data()['petName'],
          status: e.payload.doc.data()['status'],
          senderId: e.payload.doc.data()['senderId'],
          pid: e.payload.doc.data()['petId']
        }
      });

    });
  }
  rejectRequest(rid,sUid){
    this.pService.rejectRequest(rid, sUid, this.uid);
  }
  acceptRequest(rid, sUid, pid){
    this.pService.acceptRequest( rid, sUid, this.uid, pid);
  }

}
