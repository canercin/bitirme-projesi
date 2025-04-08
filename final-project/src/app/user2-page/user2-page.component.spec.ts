import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User2PageComponent } from './user2-page.component';

describe('User2PageComponent', () => {
  let component: User2PageComponent;
  let fixture: ComponentFixture<User2PageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [User2PageComponent]
    });
    fixture = TestBed.createComponent(User2PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
