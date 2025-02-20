import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getCurrentUser(): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/users/current`)
  }

}
