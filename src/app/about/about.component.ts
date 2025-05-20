import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'about', // Selector for the component
  templateUrl: './about.component.html', // Path to the HTML template
  styleUrls: ['./about.component.css'], // Path to the CSS styles
  standalone: false // Indicates that this component is not standalone (it is part of a module)
})
export class AboutComponent implements OnInit, OnDestroy {
  // Subject to manage the lifecycle of the component
  private destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit() {
    // Create an observable that emits every second after an initial delay of 3 seconds
    const interval$ = timer(3000, 1000);

    // This code will run every second
    interval$
      .pipe(takeUntil(this.destroy$)) // Unsubscribe when the component is destroyed
      .subscribe(() => console.log('Interval tick'));

    // Create an observable that emits on every click event
    const click$ = fromEvent(document, 'click');

    // This code will run on every click
    click$
      .pipe(takeUntil(this.destroy$)) // Unsubscribe when the component is destroyed
      .subscribe(
        (evt) => console.log('Document clicked', evt), // Log the click event
        (error) => console.error('Error:', error), // Log any error that occurs
        () => console.log('Completed') // Log when the observable completes
      );
  }

  ngOnDestroy() {
    // Unsubscribe from the observables to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

}
