// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Personne } from 'app/models/personne.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8089'; 

  constructor(private http: HttpClient) {}
    getUsers(): Observable<Personne> {
        return this.http.get<Personne>(`${this.apiUrl}/personne/all`);
    }
  getUserProfile(userId: number): Observable<Personne> {
   return this.http.get<Personne>(`${this.apiUrl}/personne/find/${userId}`);
 }
  
  updateUserProfile(userId: number, personne: any): Observable<Personne> {
    return this.http.put<Personne>(`${this.apiUrl}/personne/update/${userId}`, personne).pipe(
      tap((updatedUser: Personne) => {
        // Update the user details in local storage after successful update
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
    );
  }
    deletePerson(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/personne/delete/${id}`);
    }

    deactivatePerson(id: number,actif:number): Observable<void> {
      if (actif==0){
          return this.http.patch<void>(`${this.apiUrl}/personne/patch/${id}`, {'actif':false});
      }
      else {
          return this.http.patch<void>(`${this.apiUrl}/personne/patch/${id}`, {'actif':true});

      }
    }
    affectPersonClass(id: number,classe:any): Observable<void> {
            return this.http.patch<void>(`${this.apiUrl}/personne/patch/class/${id}`, {'nomclasse':classe});

    }
}
