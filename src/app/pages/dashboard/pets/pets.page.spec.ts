import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PetsPage } from './pets.page';

describe('PetsPage', () => {
  let component: PetsPage;
  let fixture: ComponentFixture<PetsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
