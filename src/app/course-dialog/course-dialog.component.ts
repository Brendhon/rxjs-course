import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import moment from 'moment';
import { concatMap, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Course } from "../model/course";

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  standalone: false
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  course: Course;

  @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngOnInit() {

    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid), // Only emit when the form is valid
        debounceTime(300), // Wait for 300ms pause in events before emitting the last event
        distinctUntilChanged(), // Only emit when the value has changed
        concatMap(() => { // Use concatMap to handle the emitted value 
          return this.save();
        })
      )
      .subscribe(console.log); // Log the emitted value

  }



  ngAfterViewInit() {


  }



  close() {
    this.dialogRef.close();
  }

  save(changes: Partial<Course> = {}) {
    const url = 'http://localhost:9000/api/courses' + '/' + this.course.id;
    return this.http.put(url, changes)
  }
}
