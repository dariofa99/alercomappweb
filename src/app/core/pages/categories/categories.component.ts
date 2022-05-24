import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CategoryModel } from '../../models/categoryModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { ReferencesService } from '../../services/references.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styles: [
  ]
})
export class CategoriesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'reference_name', 'reference_description', 'action'];
  displayedColumnsSpanish: string[] = ['ID', 'Nombre', 'Descripción','Acción'];
  dataSource: MatTableDataSource<CategoryModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: UserModel;
  categories: CategoryModel[];

  constructor(private auth: AuthService, private references: ReferencesService,
    private route: ActivatedRoute, public router: Router,
    private toastr: ToastrService, private categoryService: CategoryService) { 
      this.user = this.route.snapshot.data['user'];
      this.categories = this.route.snapshot.data['categories'];
            
    }

  ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.categories);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addCategory(){
    this.router.navigate(["/home/admin-categories/add-category"]);
  }

  editCategory(category: any){
    this.router.navigate(["/home/admin-categories/edit-category/"+category.id]);
  }

  deleteCategory(id:number){
    Swal({  
      title: 'Realmente deseas eliminar este tipo de categoría?',  
      showCancelButton: true,  
      confirmButtonText: `Si`,  
      cancelButtonText: `No`,
    }).then((result) => {  
        if (result.value) {    
          this.categoryService.deleteCategory(this.auth.readToken(),id).subscribe({
            next: data => {
              if(data['errors']!=undefined?data['errors'].length!=0:false){
                data['errors'].map(res => {
                  this.toastr.error(res);
                })
              }
              else{
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Tipo de categoría eliminada con éxito'
                });
                this.categories = this.categories.filter(item=>item.id!=id)
                this.dataSource = new MatTableDataSource(this.categories);
              }
            },
            error: error => {
              Swal({text:'Ha ocurrido un error contacta a soporte@alercom.org', type:'error'})  
              console.log('There was an error',error)
            }
          });
        } else if (result) {    
       }
    });

  }
}
