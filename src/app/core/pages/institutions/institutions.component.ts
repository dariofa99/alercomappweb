import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DepartmentModel } from '../../models/departmentModel';
import { EventTypeModel } from '../../models/eventTypeModel';
import { InstitutionsModel } from '../../models/institutionsModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth.service';
import { ReferencesService } from '../../services/references.service';
import Swal from 'sweetalert2';
import { InstitutionsService } from '../../services/institutions.service';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsList } from '../../const/permissionsList';

export class InstitutionToDisplay {
  constructor(
    public id?: string,
    public institution_name?: string,
    public institution_address?: string,
    public institution_phone?: string,
    public town?: string
  ) {}
}

@Component({
  selector: 'app-institutions',
  templateUrl: './institutions.component.html',
  styles: [],
})
export class InstitutionsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'institution_name',
    'institution_address',
    'institution_phone',
    'town',
    'action',
  ];
  displayedColumnsSpanish: string[] = [
    'ID',
    'Nombre',
    'Dirección',
    'Teléfono',
    'Municipio',
    'Acción',
  ];
  dataSource: MatTableDataSource<InstitutionToDisplay>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: UserModel;
  institutions: InstitutionsModel[];
  institutionsToDisplay: InstitutionToDisplay[] = [];
  departments: DepartmentModel[];
  towns: Array<TownModel[]> = [];
  readInstitutionPermission;
  createInstitutionPermission;
  editInstitutionPermission;
  deleteInstitutionPermission;

  constructor(
    private auth: AuthService,
    private references: ReferencesService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private institutionService: InstitutionsService,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList
  ) {
    this.loadPermissionsService.loadPermissions().then((data: [string]) => {
      this.ngxPermissionsService.loadPermissions(data);
    });
    this.readInstitutionPermission = this.permissionsList.VER_INSTITUCIONES;
    this.createInstitutionPermission = this.permissionsList.CREAR_INSTITUCIONES;
    this.editInstitutionPermission = this.permissionsList.EDITAR_INSTITUCIONES;
    this.deleteInstitutionPermission = this.permissionsList.ELIMINAR_INSTITUCIONES;

    this.user = this.route.snapshot.data['user'];
    this.departments = this.route.snapshot.data['departments'];
    this.institutions = this.route.snapshot.data['institutions'];
    this.departments.forEach((element) => {
      this.references.getTowns(this.auth.readToken(), element.id).subscribe({
        next: (data) => {
          this.towns.push(data);
        },
        error: (error) => {
          Swal('There was an error', '', 'error');
          console.log('There was an error', error);
        },
      });
    });
  }

  ngOnInit(): void {
    this.institutions.forEach((element) => {
      this.institutionsToDisplay.push(
        new InstitutionToDisplay(
          element.id,
          element.institution_name,
          element.institution_address,
          element.institution_phone,
          element.town.town_name
        )
      );
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

  addInstitution() {
    this.router.navigate(['/home/admin-institutions/add-institution']);
  }

  editInstitution(institution: any) {
    this.router.navigate([
      '/home/admin-institutions/edit-institution/' + institution.id,
    ]);
  }

  deleteInstitution(id: number) {
    Swal({
      title: 'Realmente deseas eliminar esta institución?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        this.institutionService
          .deleteInstitution(this.auth.readToken(), id)
          .subscribe({
            next: (data) => {
              if (
                data['errors'] != undefined ? data['errors'].length != 0 : false
              ) {
                data['errors'].map((res) => {
                  this.toastr.error(res);
                });
              } else {
                Swal({
                  allowOutsideClick: false,
                  type: 'success',
                  text: 'Institución eliminada con éxito',
                });
                this.institutionsToDisplay = this.institutionsToDisplay.filter(
                  (item) => item.id != id.toString()
                );
                this.dataSource = new MatTableDataSource(
                  this.institutionsToDisplay
                );
              }
            },
            error: (error) => {
              Swal({
                text: 'Ha ocurrido un error contacta a soporte@alercom.org',
                type: 'error',
              });
              console.log('There was an error', error);
            },
          });
      } else if (result) {
      }
    });
  }
}
