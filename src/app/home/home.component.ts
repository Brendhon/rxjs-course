import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, Subject, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit {
  // Subject to manage the lifecycle of the component
  private destroy$ = new Subject<void>();

  // Url to fetch data from
  private url = 'http://localhost:9000/api/courses';

  // Courses
  public beginnerCourses: Course[] = [];
  public advancedCourses: Course[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Call the httpClientData method to fetch data from the server (Common use case)
    this.httpClientData();
  }


  ngOnDestroy() {
    // Unsubscribe from the observables to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Fetch data from a URL (localhost:9000/api/courses)
  httpClientData() {
    this.http.get(this.url)
      .pipe(
        takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
        map((response: any) => response.payload) // Map the response to the desired format
      )
      .subscribe(
        (data) => this.handleResponse(data), // Handle the response data
        noop, // No operation (do nothing) on error
        () => console.log('HTTP request completed') // Log when the observable completes
      );
  }

  // Handle successful response
  handleResponse(response: any) {
    // Map the response to the desired format
    const courses: Course[] = response;

    // Filter the courses into beginner and advanced categories
    this.beginnerCourses = courses.filter((course) => course.category === 'BEGINNER');
    this.advancedCourses = courses.filter((course) => course.category === 'ADVANCED');

    console.log('Beginner Courses:', this.beginnerCourses);
    console.log('Advanced Courses:', this.advancedCourses);
  }
}
