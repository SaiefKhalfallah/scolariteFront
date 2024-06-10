import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListprofilesComponent } from './listprofiles.component.ts';

describe('ListprofilesComponent', () => {
  let component: ListprofilesComponent;
  let fixture: ComponentFixture<ListprofilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListprofilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListprofilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
