import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InstitutionalRoutesModel } from '../../models/institutionalroutesModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { InstitutionalRoutesService } from '../../services/institutional-routes.service';
import Swal from 'sweetalert2';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionsList } from '../../const/permissionsList';

@Component({
  selector: 'app-institutional-routes',
  templateUrl: './institutional-routes.component.html',
  styles: [],
})
export class InstitutionalRoutesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'route_name', 'route_url', 'action'];
  displayedColumnsSpanish: string[] = ['ID', 'Nombre', 'URL', 'Acción'];
  dataSource: MatTableDataSource<InstitutionalRoutesModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: UserModel;
  institutionalRoutes: InstitutionalRoutesModel[];
  readInstitutionalRoutePermission;
  createInstitutionalRoutePermission;
  editInstitutionalRoutePermission;
  deleteInstitutionalRoutePermission;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private institutionalRoutesService: InstitutionalRoutesService,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList
  ) {
    this.loadPermissionsService.loadPermissions().then((data: [string]) => {
      this.ngxPermissionsService.loadPermissions(data);
    });
    this.readInstitutionalRoutePermission = this.permissionsList.VER_RUTAS_INSTITUCIONALES;
    this.createInstitutionalRoutePermission = this.permissionsList.CREAR_RUTAS_INSTITUCIONALES;
    this.editInstitutionalRoutePermission = this.permissionsList.EDITAR_RUTAS_INSTITUCIONALES;
    this.deleteInstitutionalRoutePermission = this.permissionsList.ELIMINAR_RUTAS_INSTITUCIONALES;

    this.user = this.route.snapshot.data['user'];
    this.institutionalRoutes = this.route.snapshot.data['institutionalRoutes'];
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.institutionalRoutes);
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

  addInstitutionalRoute() {
    this.router.navigate([
      '/home/admin-institutional-routes/add-institutional-route',
    ]);
  }

  editInstitutionalRoute(institutionalRoute: any) {
    this.router.navigate([
      '/home/admin-institutiona-routes/edit-institutional-route/' +
        institutionalRoute.id,
    ]);
  }

  deleteInstitutionalRoute(id: number) {
    Swal({
      title: 'Realmente deseas eliminar esta ruta institucional?',
      showCancelButton: true,
      confirmButtonText: `Si`,
      cancelButtonText: `No`,
    }).then((result) => {
      if (result.value) {
        this.institutionalRoutesService
          .deleteInstitutionalRoute(this.auth.readToken(), id)
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
                  text: 'Ruta institucional eliminada con éxito',
                });
                this.institutionalRoutes = this.institutionalRoutes.filter(
                  (item) => item.id != id
                );
                this.dataSource = new MatTableDataSource(
                  this.institutionalRoutes
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
