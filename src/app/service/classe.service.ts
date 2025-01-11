// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Personne } from 'app/models/personne.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8089'; 

  constructor(private http: HttpClient) {}
    getUsers(): Observable<Personne> {
        return this.http.get<Personne>(`${this.apiUrl}/personne/all`);
    }
  getMatieres(): Observable<any> {
   return this.http.get<any>(`${this.apiUrl}/matiere/all`);
 }
  
  addMatiere( matiere: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/matiere/add`, matiere);
  }
    deleteMatiere(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/matiere/delete/${id}`);
    }
    deleteClasse(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/classe/delete/${id}`);
    }

    addClasse( matiere: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/classe/add`, matiere);
    }
    getClasses(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/classe/all`);
    }
    getCountClasses(): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/classe/count-classes`);
    }
}
