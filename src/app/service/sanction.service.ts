import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Personne } from 'app/models/personne.model';

@Injectable({
  providedIn: 'root'
})
export class SanctionService {
  private apiUrl = 'http://localhost:8089'; 

  constructor(private http: HttpClient) {}
  addAbsence(absence: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/absence/add`, absence);
}
getAbsences(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/absence/all`);
}
    addSaction(sanction: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/sanction/add`, sanction);
    }
    getSanction(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/sanction/all`);
    }
    getSanctionByStudent(id: any): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/sanction/find/${id}`);
  }
  getSanctionByTeacher(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sanction/findteacher/${id}`);
}
    changersSatus(id: any,confirmation:any): Observable<void> {
      return this.http.patch<void>(`${this.apiUrl}/sanction/patch/${id}`, {'confirmation':confirmation});

}
justifier(id: any,justificatif:any): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/absence/patch/${id}`, {'justificatif':justificatif});

}
justifiern(id: any,justificatif:any): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/absence/patch/${id}`, {'justificatif':justificatif});

}
justifierfilename(id: any,name:any): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/absence/file/patch/${id}`, {'file':name});

}
uploadFile(id: any, file: File): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  return this.http.patch<void>(`${this.apiUrl}/absence/upload/patch/${id}`, formData);
}
}
