

import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { Course } from '../model/course';
import { createHttpObservable } from './util';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Store to hold the data
  private subject = new BehaviorSubject<Course[]>([]);

  // Store to hold the data
  private courses$: Observable<Course[]> = this.subject.asObservable();

  constructor() { }

  // Init
  public init() {
    createHttpObservable<Course[]>('/api/courses')
      .pipe(
        first(), // Get the first value
        tap(() => console.log("HTTP request executed")), // Log the request
        map(res => Object.values(res["payload"]) as Course[]), // Convert the payload to an array of courses
        tap(courses => this.subject.next(courses)) // Emit the data to the store
      )
      .subscribe();
  }

  // Get all courses
  public getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  // Get beginner courses
  public getBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory('BEGINNER');
  }

  // Get advanced courses
  public getAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory('ADVANCED');
  }

  // Filter courses by category
  private filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(map(courses => courses.filter(course => course.category == category)));
  }

  // Get course by ID
  public getCourseById(id: number): Observable<Course> {
    return this.courses$.pipe(
      map(courses => courses.find(course => course.id == id)), // Find the course by ID
      filter(course => !!course), // Filter out undefined values
      first() // Get the first value
    );
  }

  // Get current courses
  public getCurrentCourses(): Course[] {
    return this.subject.getValue();
  }

  // Save course
  public saveCourse(id: number, changes: Partial<Course>): Observable<Course> {
    // Get the current courses
    const courses = this.getCurrentCourses();

    // Get the current course index
    const index = courses.findIndex(course => course.id == id);

    // Check if course exists
    if (index == -1) return throwError(() => new Error('Course not found'));

    // Create a new course object
    const updatedCourse = { ...courses[index], ...changes };

    // Create a new array of courses
    const updatedCourses = [...courses];

    // Update the course in the array
    updatedCourses[index] = updatedCourse;

    // Emit the new courses to the store
    this.subject.next(updatedCourses);

    // Make the HTTP request to save the course
    return from(
      fetch(`/api/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedCourse),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.ok) return res.json();
          else throw new Error('Error saving course');
        })
    )
  }
}
