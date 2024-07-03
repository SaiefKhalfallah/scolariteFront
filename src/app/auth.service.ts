import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = 'http://localhost:8089';
  private loggedIn: boolean = false;
  private currentUser: any;

  constructor(private http: HttpClient) {}

  get currentUserValue(): any {
    return this.currentUser;
  }
  
  isLoggedIn(): boolean {
    return localStorage.getItem('loggedIn') === 'true';
  }

  getUserIdFromStorage(): number | null {
    const userId = localStorage.getItem('user.userId');
    return userId ? parseInt(userId, 10) : null;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/auth/authenticate`, { email, password }).pipe(
      tap((response: any) => {
        this.loggedIn = true;
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token); // Store auth token if provided by the response
      })
    );
  }

  fetchCurrentUserId(): Observable<number> {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
      return this.http.get<number>(`${this.apiUrl}/personne/currentUserId`, { headers }).pipe(
        tap((userId: number) => {
          localStorage.setItem('userId', userId.toString());
        })
      );
    } else {
      console.error('No auth token found');
      return new Observable<number>(subscriber => subscriber.error('No auth token found'));
    }
  }

  logout(): void {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    this.loggedIn = false;
  }
}
