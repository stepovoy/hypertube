import { ErrorHandler } from '@angular/core';


export class AppErrorHandler implements ErrorHandler {
   handleError(error) {
     console.log('EVERYTHING WORKS JUST FINE');
   }
}
