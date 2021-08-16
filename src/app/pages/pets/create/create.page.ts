import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage  } from '@angular/fire/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { PetService } from '../../../services/pet/pet.service'


@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  createPetForm: FormGroup;
  submitError: string;
  genders: Array<string>;
  kinds: Array<string>;
  blood: Array<string>;
  imageResponse: any[];
  options: any;
  private uid: String;

  validation_messages = {
    'name': [
      { type: 'required', message: 'Pet name is required.' }
    ],
    'age': [
      { type: 'required', message: 'Age is required.' },
    ],
    'gender': [
      {type: 'required', message: 'Gender is required'}
    ],
    'color': [
      {type: 'required', message: 'Color is required'}
    ],
    'kind': [
      {type: 'required', message: 'Type is required'}
    ],
    'sType': [
      {type: 'required', message: 'Type is required'}
    ],
    'description': [{
      type: 'required', message: 'Choose pet type'
    }],
    'blood': [
      {type: 'required', message: ' is required'}
    ],
  };
  constructor
  (
    public angularFire: AngularFireAuth,
    public router: Router,
    private authService: AuthService,
    public afStore: AngularFirestore,
    private afStorage : AngularFireStorage,
    private imagePicker: ImagePicker,
    private PetService: PetService
  ) {
    
    this.genders = [
      'Male',
      'Female'
    ];
    this.kinds = [
      'Dog',
      'Cat',
      'Bird',
      'Rabbit'
    ];
    this.blood = [
      'mix',
      'pure'
    ]
    this.createPetForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'age': new FormControl('',Validators.required),
      'gender': new FormControl('',Validators.required),
      'color': new FormControl('',Validators.required),
      'kind': new FormControl('',Validators.required),
      'sType': new FormControl('',Validators.required),
      'blood': new FormControl('',Validators.required),
      'description': new FormControl('',Validators.required)
    });
    this.imageResponse = [];
    this.authService.getLoggedInUser().then(res => {
      if(res){
        this.uid = res.uid;
      }
    },error =>{
      console.log(error.message);
    });
    
  }

  ngOnInit() {
  }

  createNewPet(){
    this.PetService.createPet({
      name: this.createPetForm.value['name'],
      age: this.createPetForm.value['age'],
      color: this.createPetForm.value['color'],
      gender: this.createPetForm.value['gender'],
      kind: this.createPetForm.value['kind'],
      sType: this.createPetForm.value['sType'],
      blood: this.createPetForm.value['blood'],
      description: this.createPetForm.value['description'],
      uid: this.uid,
      status: 'Active'
    }).then(res => {
      this.uploadImages(this.imageResponse, res.id);
      
      this.router.navigate(['dashboard/pets']);

    });
  }
  getImages() {
    this.options = {
      // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
      // selection of a single image, the plugin will return it.
      maximumImagesCount: 3,

      // max width and height to allow the images to be.  Will keep aspect
      // ratio no matter what.  So if both are 800, the returned image
      // will be at most 800 pixels wide and 800 pixels tall.  If the width is
      // 800 and height 0 the image will be 800 pixels wide if the source
      // is at least that wide.
      //width: 200,
      //height: 200,

      // quality of resized image, defaults to 100
      quality: 90,

      // output type, defaults to FILE_URIs.
      // available options are 
      // window.imagePicker.OutputType.FILE_URI (0) or 
      // window.imagePicker.OutputType.BASE64_STRING (1)
      outputType: 1
    };
    if(this.imageResponse.length >= 3)
      alert('You can not add more than 3 images');
    else{
      this.options.maximumImagesCount = 3 - this.imageResponse.length;
      this.imagePicker.getPictures(this.options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
        }
        //console.log(this.imagePicker);
      }, (err) => {
        alert(err);
      });
    }
    
  }

  async uploadImages(images: Array<string>, pId: String ){
    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const filePath = 'images/'+pId+'/'+i;
      const ref = this.afStorage.ref(filePath);
      const task = await ref.putString(file, 'data_url');
    }
      const filePath = 'images/'+pId+'/'+0;
      const ref = this.afStorage.ref(filePath);
      //
      ref.getDownloadURL().subscribe(data =>{
        this.PetService.setThumb(pId, data);
      })
  }
}
