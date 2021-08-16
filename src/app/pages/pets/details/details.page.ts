import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from 'src/app/services/pet/pet.service';
import { User } from 'firebase';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { AngularFireStorage  } from '@angular/fire/storage';





@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  petDetails: any;
  currentUser: User;
  request: any;
  isGuest: boolean;
  isOwner: boolean;
  uid: string;
  r: any;
  images: any = [];
  imgUrl: string;
  owner: any;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pService: PetService,
    public toastController: ToastController,
    private authService: AuthService,
    private userServ: UserService,
    private afStorage : AngularFireStorage,
  ) { 
    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
          this.petDetails = this.router.getCurrentNavigation().extras.state.pet;
      }
    });
    this.getCurrentUser();
    
  }

  ngOnInit() {
    this.getPetImages();
    this.getOwner();
  }

  async getCurrentUser(): Promise<any>{
    this.currentUser = await this.authService.getLoggedInUser();
    if(this.currentUser !== null){
      this.uid = this.currentUser.uid;
      this.isGuest = false;
    }else{
      this.isGuest = true;
      this.uid = null;
    }
      
  }
  async presentToast(infoMessage: string) {
    const toast = await this.toastController.create({
      message: infoMessage,
      duration: 2000
    });
    toast.present();
  }
  async makeAdoptionRequest(){
    this.request = {
      petId: this.petDetails.id,
      petName: this.petDetails.name,
      status: 'Pending'
    }
    if(this.petDetails.uid === this.currentUser.uid){
      this.presentToast('You can not Adopt your Pet');
    }else{
      (await this.pService.isFirstTime(this.request.petId, this.currentUser.uid)).map(data => {
        this.r = data;
      });
      if (!this.r) {
        this.pService.sendRequest(this.request, this.uid, this.petDetails.uid);
        this.presentToast('Thank you .. Processing it');
      } else {
        this.presentToast('You already sent a request');
      }
    }
    
  }

  getPetImages(){
    const filePath = 'images/'+this.petDetails.id+'/';
    const ref = this.afStorage.ref(filePath);
    ref.listAll().subscribe(data => {
      data.items.forEach(imageRef => {
        this.displayImage(imageRef);
      });
    });
  }

  async displayImage(imageRef) {
    await imageRef.getDownloadURL().then(url => {
      this.imgUrl = url;
    }).catch(function(error) {
      // Handle any errors
    });

    this.images.push(this.imgUrl);
    
  }
  getOwner(){
    this.userServ.getUserById(this.petDetails.id).subscribe(data => {
      this.owner =data;
    });
  }

}
