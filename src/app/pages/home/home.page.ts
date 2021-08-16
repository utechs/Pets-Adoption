import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { PetService } from '../../services/pet/pet.service';
import { Pet } from '../../models/pet';
import { Router, NavigationExtras } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  currentUser: any;
  pet: Pet = new Pet();
  petsList: Pet[];
  private unsubscribe$ = new Subject<void>();
  constructor(
    public angularFire: AngularFireAuth, 
    private pService: PetService,
    private router: Router
    ) {
    
  }

  ngOnInit() {
    this.getAllPets();
  }
  getAllPets(){
    this.pService.getAllPets().pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      console.log(data);
      this.petsList = data.map(e => {
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


  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log('unsubscribe');
  }
}
