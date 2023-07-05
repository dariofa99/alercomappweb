import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryAdapter, CategoryModel } from '../models/categoryModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient, private adapterCategory: CategoryAdapter) { }

  getCategoryById(auth_token,id): Observable<CategoryModel>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/references/event/categories/`+id+`/edit`,
      {headers: headers}
    ).pipe(
      map((item) => {
        return this.adapterCategory.adapt(item['reference'])
      })
    )
  }

  getCategories(auth_token): Observable<CategoryModel[]>{
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    });
    
    return this.http.get(
      `${ this.url }/references/event/categories`,{headers: headers}
    ).pipe(
      map((data: any[])=> data['references'].map((item) => {
        return this.adapterCategory.adapt(item)
      })) 
    );
  }

  putCategory(auth_token,id,categoryData){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.put(
      `${ this.url }/references/event/categories/`+id,categoryData,{headers: headers}
    );
  }

  postCategory(auth_token,categoryData){
    const data = {
      ...categoryData,
      returnSecureToken: true
    };

    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`,
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(
      `${ this.url }/references/event/categories`,data,{headers: headers}
    );
  }

  deleteCategory(auth_token,id){
    var headers = new HttpHeaders({
      'Authorization': `Bearer ${auth_token}`
    });
    return this.http.delete(
      `${ this.url }/references/event/categories/`+id,{headers: headers}
    );
  }
}
