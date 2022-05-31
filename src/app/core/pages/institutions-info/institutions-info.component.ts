import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DepartmentModel } from '../../models/departmentModel';
import { InstitutionsInfoModel } from '../../models/institutionsInfoModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { InstitutionsService } from '../../services/institutions.service';
import { ReferencesService } from '../../services/references.service';

export class InstitutionInfoToDisplay{
  constructor(
    public id?: string,
    public institution_name?: string,
    public institution_address?: string,
    public institution_phone?: string,
    public town?: string,
  ){}
}

@Component({
  selector: 'app-institutions-info',
  templateUrl: './institutions-info.component.html',
  styles: [
  ]
})
export class InstitutionsInfoComponent implements OnInit {
  displayedColumns: string[] = ['id', 'institution_name', 'institution_address', 'institution_phone', 'town', 'action'];
  displayedColumnsSpanish: string[] = ['ID', 'Nombre', 'Dirección', 'Teléfono','Municipio','Acción'];
  dataSource: MatTableDataSource<InstitutionInfoToDisplay>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: UserModel;
  institutionsInfo: InstitutionsInfoModel[];
  institutionsToDisplay: InstitutionInfoToDisplay[] = [];
  departments: DepartmentModel[];
  towns: Array<TownModel[]> = [];

  constructor(private auth: AuthService, private references: ReferencesService,
    private route: ActivatedRoute, public router: Router,
    private toastr: ToastrService, private institutionService: InstitutionsService) { 
      this.user = this.route.snapshot.data['user'];
      this.departments = this.route.snapshot.data['departments'];
      this.institutionsInfo = this.route.snapshot.data['institutionsinfo'];
      this.departments.forEach(element => {
        this.references.getTowns(this.auth.readToken(),element.id).subscribe({
          next: data => {this.towns.push(data)},
          error: error => {
            Swal('There was an error', '', 'error')  
            console.log('There was an error',error)
          }
        })
      });
      
    }

  ngOnInit(): void {
    this.institutionsInfo.forEach(element => {
      this.institutionsToDisplay.push(new InstitutionInfoToDisplay(element.id,element.institution_name,
        element.institution_address,element.institution_phone,element.town.town_name))
    });

    this.dataSource = new MatTableDataSource(this.institutionsToDisplay);
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

  addInstitution(){
    this.router.navigate(["/home/admin-institutions-info/add-institution-info"]);
  }

  editInstitution(institution: any){
    this.router.navigate(["/home/admin-institutions-info/edit-institution-info/"+institution.id]);
  }

  deleteInstitution(id:number){
    Swal({  
      title: 'Realmente deseas eliminar esta institución?',  
      showCancelButton: true,  
      confirmButtonText: `Si`,  
      cancelButtonText: `No`,
    }).then((result) => {  
        if (result.value) {    
          this.institutionService.deleteInstitution(this.auth.readToken(),id).subscribe({
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
                  text: 'Institución eliminada con éxito'
                });
                this.institutionsToDisplay = this.institutionsToDisplay.filter(item=>item.id!=id.toString())
                this.dataSource = new MatTableDataSource(this.institutionsToDisplay);
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
