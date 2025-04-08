import { ComponentFixture, TestBed } from '@angular/core/testing';

import { User3PageComponent } from './user3-page.component';

describe('User3PageComponent', () => {
  let component: User3PageComponent;
  let fixture: ComponentFixture<User3PageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [User3PageComponent]
    });
    fixture = TestBed.createComponent(User3PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
