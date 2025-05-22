import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { concat, fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap
} from 'rxjs/operators';
import { StoreService } from '../common/store.service';
import { createHttpObservable } from '../common/util';
import { Course } from "../model/course";
import { Lesson } from '../model/lesson';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  standalone: false
})
export class CourseComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: true }) input: ElementRef;

  courseId: number;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  constructor(
    private route: ActivatedRoute,
    private store: StoreService
  ) { }

  ngOnInit() {
    this.courseId = +this.route.snapshot.params['id'];
    this.course$ = this.store.getCourseById(this.courseId)
  }

  ngAfterViewInit() {
    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );

    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res["payload"])
      );
  }


}











