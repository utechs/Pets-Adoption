import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutgoingPage } from './outgoing.page';

describe('OutgoingPage', () => {
  let component: OutgoingPage;
  let fixture: ComponentFixture<OutgoingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutgoingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutgoingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
