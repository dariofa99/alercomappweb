import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PermissionsList } from '../../const/permissionsList';
import { DepartmentModel } from '../../models/departmentModel';
import { RoleModel } from '../../models/roleModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { LoadPermissionsService } from '../../services/load-permissions.service';
import { PreviousRouteService } from '../../services/previous-route.service';
import { ReferencesService } from '../../services/references.service';
import { RolesPermissionsService } from '../../services/roles-permissions.service';
import { UserService } from '../../services/user.service';
import { ChangeRoleDialogComponent } from '../change-rol-dialog/change-role-dialog.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [],
})
export class UserProfileComponent implements OnInit, AfterViewInit {
  user: UserModel;
  departments: DepartmentModel[];
  userForm!: FormGroup;
  userPasswordForm!: FormGroup;
  towns: TownModel[] = [];
  townsToDisplay: TownModel[] = [];
  townsArray: Array<TownModel[]> = [];
  roles: RoleModel[] = [];
  isOnDepartment = false;
  selectedDepartment: number = -1;
  selectedTown: number;
  selectedRole: number;
  actionBtn: string = 'Guardar';
  id: any;
  userByID: UserModel;
  hidePassword: boolean = true;
  roleName: string;
  showTextInPasswordEdit: string = 'Contraseña Actual';
  assignRole;
  hasAssignRole = false;
  editMe = false;
  previousUrl;
  currentUrl;

  hasChangeStateEvent = false;
  changeStateEvent;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private references: ReferencesService,
    public router: Router,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private rolesPermissionsService: RolesPermissionsService,
    private loadPermissionsService: LoadPermissionsService,
    private ngxPermissionsService: NgxPermissionsService,
    private permissionsList: PermissionsList,
    private urlService: PreviousRouteService
  ) {
    this.loadPermissionsService.loadPermissions().then((data: [string]) => {
      this.ngxPermissionsService.loadPermissions(data);
    });
    this.changeStateEvent = this.permissionsList.CAMBIAR_ESTADO_ALERTA;
    this.ngxPermissionsService
      .hasPermission(this.changeStateEvent)
      .then((result) => {
        this.hasChangeStateEvent = result;
      });

    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      town_id: ['', Validators.required],
      address: ['', Validators.required],
      phone_number: ['', Validators.required],
      department: ['', Validators.required],
    });

    this.userForm.disable();

    this.id = this.route.snapshot.paramMap.get('id');
    this.user = this.route.snapshot.data['user'];
    this.userByID = this.route.snapshot.data['userByID'];
    this.departments = this.route.snapshot.data['departments'];
    this.towns = this.route.snapshot.data['towns'];
    this.departments.forEach((element) => {
      let townsAux = [];
      this.towns.forEach((elementInside) => {
        if (element.id == elementInside.department_id) {
          townsAux.push(elementInside);
        }
      });
      this.townsArray.push(townsAux);
    });
  }

  ngOnInit(): void {
    this.urlService.previousUrl$
        .subscribe((previousUrl: string) => {
            this.previousUrl = previousUrl
        });
    if (this.userByID != undefined) {
      this.actionBtn = 'Actualizar';
      this.userForm.removeControl('password');
      this.userForm.removeControl('password_confirmation');
      this.userForm.controls['name'].setValue(this.userByID.name);
      this.userForm.controls['lastname'].setValue(this.userByID.lastname);
      this.userForm.controls['username'].setValue(this.userByID.username);
      this.userForm.controls['email'].setValue(this.userByID.email);
      this.userForm.controls['town_id'].setValue(this.userByID.town_id);
      this.userForm.controls['address'].setValue(this.userByID.address);
      this.userForm.controls['phone_number'].setValue(
        this.userByID.phone_number
      );
      this.selectedTown = this.userByID.town_id;
      this.selectedRole =
        this.userByID.roles.length != 0 ? this.userByID.roles[0].id : -1;
      this.isOnDepartment = true;
      if (this.userByID.roles.length != 0) {
        this.roleName = this.userByID.roles[0].name;
      } else {
        this.roleName = '';
      }
      if (this.user.id != this.userByID.id) {
        this.showTextInPasswordEdit = 'Contraseña de Administrador';
      } else {
        this.showTextInPasswordEdit = 'Contraseña Actual';
      }
      if(this.user.id == this.userByID.id){
        this.editMe = true;
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.userByID != undefined) {
      this.townsArray.forEach((element) => {
        element.forEach((elementInside) => {
          if (elementInside.id == this.userByID.town_id) {
            this.selectedDepartment = elementInside.department_id;
          }
          if (elementInside.department_id == this.selectedDepartment) {
            this.townsToDisplay = element;
          }
        });
      });
    }
  }

  onDepartmentSelected(event: any) {
    this.isOnDepartment = true;
    this.townsArray.forEach((element) => {
      element.forEach((elementInside) => {
        if (elementInside.department_id == event.value) {
          this.townsToDisplay = element;
        }
      });
    });
  }

  backToList() {
    if(this.hasChangeStateEvent){
      if(this.previousUrl == "/home/admin-alerts"){
        this.router.navigate(['/home/admin-alerts']);
      }
      else if(this.previousUrl == "/home/admin-my-alerts"){
        this.router.navigate(['/home/admin-my-alerts']);
      }
    }
    else{
      this.router.navigate(['/home/admin-my-alerts']);
    }
  }

}
