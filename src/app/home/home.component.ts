import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, noop, Observable, of, Subject, timer } from 'rxjs';
import { catchError, delayWhen, filter, map, retryWhen, shareReplay, takeUntil, tap } from 'rxjs/operators';
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

  // Courses as observables
  public courses$: Observable<Course[]>;
  public beginnerCourses$: Observable<Course[]> = of([]);
  public advancedCourses$: Observable<Course[]> = of([]);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Call the httpClientData method to fetch data from the server (Common use case)
    // this.httpClientData(
    //   (course: Course) => course.category === 'BEGINNER', // Filter function for beginner courses
    //   this.beginnerCourses // Array to store beginner courses
    // );

    // this.httpClientData(
    //   (course: Course) => course.category === 'ADVANCED', // Filter function for advanced courses
    //   this.advancedCourses // Array to store advanced courses
    // );

    // Create an unique observable for all courses
    this.courses$ = this.createObservable();

    // Create an observable for beginner courses
    this.beginnerCourses$ = this.courses$
      .pipe(
        map((courses: Course[]) => courses.filter(course => course.category === 'BEGINNER')), // Filter for beginner courses
      );

    // Create an observable for advanced courses
    this.advancedCourses$ = this.courses$
      .pipe(
        map((courses: Course[]) => courses.filter(course => course.category === 'ADVANCED')), // Filter for advanced courses
      );
  }

  ngOnDestroy() {
    // Unsubscribe from the observables to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Fetch data from a URL (localhost:9000/api/courses)
  httpClientData(filterFn: (course: Course) => boolean = () => true, courses: Course[] = []) {
    this.createObservable()
      .pipe(
        map((courses: Course[]) => courses.filter(filterFn)),
      )  // Filter the courses based on the provided filter function
      .subscribe(
        (filteredCourses: Course[]) => {
          courses.length = 0; // Clear the existing courses (reuse the same reference)
          courses.push(...filteredCourses); // Push the filtered courses into the array
        },
        noop, // No operation (do nothing) on error
        () => console.log('HTTP request completed') // Log when the observable completes
      );
  }

  // Create an observable that make the request and return courses observable
  createObservable(): Observable<Course[]> {
    return this.http.get(this.url)
      .pipe(
        tap(() => console.log('HTTP request executed')), // Log the response
        takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
        map((response: any) => response.payload), // Map the response to the desired format
        shareReplay(), // Share the last emitted value with new subscribers
      );
  }
}
