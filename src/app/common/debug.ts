import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

type ConsoleMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

export const debug = (message: string, level: ConsoleMethod = 'debug') =>
  (sourse: Observable<any>) => sourse
    .pipe(tap((val) => console[level](message + ':', val)));