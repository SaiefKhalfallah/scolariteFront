import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
      request: HttpRequest<any>,
      next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Define the registration URL
    const registrationUrl = 'http://localhost:8089/api/v1/auth/register';
    const loginUrl = 'http://localhost:8089/api/v1/auth/authenticate';
    // Check if the request URL is the registration URL
    if (request.url === registrationUrl || request.url===loginUrl) {
      // If the URL matches, proceed without adding the token
      return next.handle(request);
    }

    // Get token from local storage
    const authToken = localStorage.getItem('authToken');

    // Clone the request and add token to headers if it exists
    if (authToken) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next.handle(authReq);
    }

    // If no token, proceed with the original request
    return next.handle(request);
  }
}
