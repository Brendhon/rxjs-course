import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreService } from '../common/store.service';
import { Course } from "../model/course";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  // Observable to hold the data
  public beginnerCourses$: Observable<Course[]>;
  public advancedCourses$: Observable<Course[]>;

  // Constructor to inject the store service
  constructor(private store: StoreService) { }

  ngOnInit() {
    this.beginnerCourses$ = this.store.getBeginnerCourses()
    this.advancedCourses$ = this.store.getAdvancedCourses()
  }

}
