import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportBooksComponent } from './import-books.component';

describe('ImportBooksComponent', () => {
  let component: ImportBooksComponent;
  let fixture: ComponentFixture<ImportBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportBooksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
