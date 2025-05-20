import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, from, noop, Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'about', // Selector for the component
  templateUrl: './about.component.html', // Path to the HTML template
  styleUrls: ['./about.component.css'], // Path to the CSS styles
  standalone: false // Indicates that this component is not standalone (it is part of a module)
})
export class AboutComponent implements OnInit, OnDestroy {
  // Subject to manage the lifecycle of the component
  private destroy$ = new Subject<void>();

  // Url to fetch data from
  private url = 'http://localhost:9000/api/courses';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // // Create an observable that emits every second after an initial delay of 3 seconds
    // const interval$ = timer(3000, 1000);

    // // This code will run every second
    // interval$
    //   .pipe(takeUntil(this.destroy$)) // Unsubscribe when the component is destroyed
    //   .subscribe(() => console.log('Interval tick'));

    // // Create an observable that emits on every click event
    // const click$ = fromEvent(document, 'click');

    // // This code will run on every click
    // click$
    //   .pipe(takeUntil(this.destroy$)) // Unsubscribe when the component is destroyed
    //   .subscribe(
    //     (evt) => console.log('Document clicked', evt), // Log the click event
    //     (error) => console.error('Error:', error), // Log any error that occurs
    //     () => console.log('Completed') // Log when the observable completes
    //   );

    // // Call the httpClientData method to fetch data from the server (Common use case)
    // this.httpClientData();

    // // Call the fetchData method to fetch data from the server (For study purposes)
    // this.fetchData();

    // // Call the createObservable method to create an observable (For study purposes)
    // this.createObservable();

    const sourse$1 = of(1, 2, 3, 4, 5); // Create an observable that emits values 1 to 5

    const sourse$2 = of(6, 7, 8, 9, 10); // Create another observable that emits values 6 to 10

    // Concatenate the two observables
    const concatenated$ = concat(sourse$1, sourse$2);

    // Subscribe to the concatenated observable
    concatenated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (value) => console.log('Concatenated value:', value), // Log the emitted value
        (error) => console.error('Error:', error), // Log any error that occurs
        () => console.log('Concatenation completed') // Log when the observable completes
      );
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
        (data) => console.log('Data fetched:', data), // Log the fetched data
        (error) => console.error('Error fetching data:', error), // Log any error that occurs
        () => console.log('HTTP request completed') // Log when the observable completes
      );
  }

  // Fetch data from a URL (localhost:9000/api/courses)
  fetchData() {
    // For study purposes, you can create an observable that call fetch (js) to fetch data
    from(fetch(this.url).then((response) => response.json())) // Parse the response as JSON
      .pipe(
        takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
        map((response: any) => response.payload) // Map the response to the desired format
      )
      .subscribe(
        (response) => console.log('Fetch response:', response), // Log the fetch response
        (error) => console.error('Error fetching data:', error), // Log any error that occurs
        () => console.log('Fetch completed') // Log when the observable completes
      );
  }

  // Create an observable that emits a value
  createObservable() {
    // Create an observable that emits a value
    const observable$ = new Observable((observer) => {
      fetch(this.url)
        .then((response) => {
          if (!response.ok) throw new Error('Network response was not ok');
          else return response.json();
        })
        .then((data) => {
          observer.next(data); // Emit the fetched data
          observer.complete(); // Complete the observable
        })
        .catch((error) => observer.error(error)); // Emit an error if the fetch fails
    });

    // Subscribe to the observable
    observable$
      .pipe(
        takeUntil(this.destroy$), // Unsubscribe when the component is destroyed
        map((response: any) => response.payload) // Map the response to the desired format
      )
      .subscribe(
        (value) => console.log('Observable value:', value), // Log the emitted value
        noop, // No operation (do nothing) on error
        () => console.log('Observable completed') // Log when the observable completes
      );
  }

}
