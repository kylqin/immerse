import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCardsComponent } from './book-cards.component';

describe('BookCardsComponent', () => {
  let component: BookCardsComponent;
  let fixture: ComponentFixture<BookCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
