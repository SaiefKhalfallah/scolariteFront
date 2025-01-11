// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Personne } from 'app/models/personne.model';

@Injectable({
  providedIn: 'root'
})
export class DocService {
  private apiUrl = 'http://localhost:8089'; 

  constructor(private http: HttpClient) {}
 
  getdocumentAdministratif(): Observable<any> {
   return this.http.get<any>(`${this.apiUrl}/documentAdministratif/all`);
 }
  
  adddocumentAdministratif( matiere: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/documentAdministratif/add`, matiere);
  }
    deletedocumentAdministratif(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/documentAdministratif/delete/${id}`);
    }
    deleteClasse(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/documentAdministratif/delete/${id}`);
    }


    uploadFile(id: any, file: File): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
    
      return this.http.patch<void>(`${this.apiUrl}/documentAdministratif/upload/patch/${id}`, formData);
    }

    changestatus(id :number, status :string):Observable<any>{
     //const params = new HttpParams().set('status', status);
      return this.http.patch<any>(`${this.apiUrl}/documentAdministratif/status/patch/${id}`,{status})
    }

    getDocumentsForUser(userId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/documentAdministratif/user/${userId}`);
    }
}
