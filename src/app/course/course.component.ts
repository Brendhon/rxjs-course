import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { fromEvent, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { Course } from "../model/course";
import { Lesson } from '../model/lesson';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  standalone: false
})
export class CourseComponent implements OnInit, AfterViewInit {
  // ViewChild to get the input element
  @ViewChild('searchInput', { static: true }) input: ElementRef;

  // Course id 
  public courseId: number;

  // Observables
  public course$: Observable<Course>;
  public lessons$: Observable<Lesson[]>;

  // Subject to manage the lifecycle of the component
  private destroy$ = new Subject<void>();

  // Constructor to inject the route and httpClient
  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    // Get the course id from the route parameters
    this.courseId = this.route.snapshot.params['id'];

    // Create an observable for the lessons
    this.course$ = this.createObservable<Course>('/api/courses/' + this.courseId)
  }

  ngAfterViewInit() {
    // Create an observable for the search input
    fromEvent(this.input.nativeElement, 'keyup') // Listen for keyup events on the input element
      .pipe(
        takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
        map((event: any) => event.target.value), // Get the value of the input
        startWith(''), // Start with an empty string (initial value)
        debounceTime(200), // Wait for 300ms before emitting the value
        distinctUntilChanged(), // Only emit if the value has changed
        tap((e) => console.log('Search input changed', e)), // Log the input change
        switchMap((searchTerm: string) => this.getLessons(searchTerm)) // Call the getLessons function with the search term
      ).subscribe(
        (lessons: Lesson[]) => this.lessons$ = of(lessons), // Update the lessons observable with the new value
        (error) => console.error('Error fetching lessons:', error), // Log any errors
        () => console.log('Lessons fetched successfully') // Log success message
      );
  }

  // Create an observable that make the request and return courses observable
  createObservable<T>(path: string): Observable<T> {
    return this.http.get('http://localhost:9000' + path)
      .pipe(
        takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
        map((response: any) => response), // Map the response to the desired format
      );
  }

  // Create function to get lessons
  getLessons(filter?: string): Observable<Lesson[]> {
    const path = `/api/lessons?courseId=${this.courseId}&pageSize=100${filter ? '&filter=' + filter : ''}`;
    return this.createObservable<Lesson[]>(path).pipe(map((response: any) => response.payload)) // Map the response to the desired format  
  }
}
