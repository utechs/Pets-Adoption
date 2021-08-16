import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PetService } from '../../../services/pet/pet.service';
import { AuthService } from '../../../services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Pet } from '../../../models/pet';


@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
})
export class PetsPage implements OnInit {
  myPets: any;
  currentUser: any;
  uid: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private pService: PetService
  ) { 
    this.authService.getLoggedInUser().then(res => {
      if(res){
        this.uid = res.uid;
        this.getMyPets();
      }
    },error =>{
      console.log(error.message);
    });
  }

  ngOnInit() {
    
  }


  getMyPets(){
    this.pService.getPetsByUser(this.uid).subscribe(data => {
      console.log(data);
      this.myPets = data.map(e => {
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          age: e.payload.doc.data()['age'],
          color: e.payload.doc.data()['color'],
          kind: e.payload.doc.data()['kind'],
          sType: e.payload.doc.data()['sType'],
          description: e.payload.doc.data()['description'],
          blood: e.payload.doc.data()['blood'],
          gender: e.payload.doc.data()['gender'],
          uid: e.payload.doc.data()['uid'],
          img: e.payload.doc.data()['thumbnail']
        };
      });
    });
  }

  // Pass single Pet information to details page
  public goToPetDetails(pet: Pet){
    let navigationExtras: NavigationExtras = {
      state: {
        pet: pet
      }
    };
    this.router.navigate(['details'], navigationExtras);
  }

}
