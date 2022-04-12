import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://18.222.218.76/api/v1'

  constructor(private http: HttpClient) { }
  
  getUsers(){
    
  }
}
