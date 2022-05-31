import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DepartmentModel } from '../../models/departmentModel';
import { InstitutionsInfoEditModel } from '../../models/institutionsInfoEditModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { InstitutionsService } from '../../services/institutions.service';

@Component({
  selector: 'app-new-edit-institution-info',
  templateUrl: './new-edit-institution-info.component.html',
  styles: [],
})
export class NewEditInstitutionInfoComponent implements OnInit, AfterViewInit {
  institutionForm!: FormGroup;
  departments: DepartmentModel[];
  towns: TownModel[] = [];
  townsToDisplay: TownModel[] = [];
  townsArray: Array<TownModel[]> = [];
  isOnDepartment = false;
  selectedDepartment: number;
  selectedTown: number;
  actionBtn: string = 'Guardar';
  id: any;
  institutionInfoByID: InstitutionsInfoEditModel;
  user: UserModel;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private institutionsService: InstitutionsService
  ) {
    this.user = this.route.snapshot.data['user'];

    this.institutionForm = this.formBuilder.group({
      institution_name: ['', Validators.required],
      institution_address: ['', Validators.required],
      institution_phone: ['', Validators.required],
      town_id: ['', Validators.required],
      category_id: ['', Validators.required],
    });

    this.institutionForm.controls['category_id'].setValue(
      '25'
    );

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
    this.institutionInfoByID = this.route.snapshot.data['institutionInfoByID'];
  }

  ngOnInit(): void {
    if (this.institutionInfoByID != undefined) {
      this.actionBtn = 'Actualizar';
      this.institutionForm.controls['institution_name'].setValue(
        this.institutionInfoByID.institution_name
      );
      this.institutionForm.controls['institution_address'].setValue(
        this.institutionInfoByID.institution_address
      );
      this.institutionForm.controls['institution_phone'].setValue(
        this.institutionInfoByID.institution_phone
      );
      this.institutionForm.controls['town_id'].setValue(
        this.institutionInfoByID.town_id
      );
      this.institutionForm.controls['category_id'].setValue(
        this.institutionInfoByID.category_id
      );
      this.selectedTown = this.institutionInfoByID.town_id;
      this.isOnDepartment = true;
    }
  }

  ngAfterViewInit(): void {
    if (this.institutionInfoByID != undefined) {
      this.townsArray.forEach((element) => {
        element.forEach((elementInside) => {
          if (elementInside.id == this.institutionInfoByID.town_id) {
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

  addInstitution() {
    if (this.institutionForm.valid) {
      this.institutionsService
        .postInstitution(this.auth.readToken(), this.institutionForm.value)
        .subscribe({
          next: (data) => {
            {
              console.log(data);
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
                  text: 'Institución creada con éxito',
                }).then((result) => {
                  this.router.navigate(['/home/admin-institutions-info']);
                });
              }
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
    }
  }

  updateInstitution() {
    console.log(this.institutionForm.value);
    if (this.institutionForm.valid) {
      this.institutionsService
        .putInstitution(
          this.auth.readToken(),
          this.institutionInfoByID.id,
          this.institutionForm.value
        )
        .subscribe({
          next: (data) => {
            {
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
                  text: 'Institución actualizada con éxito',
                }).then((result) => {
                  this.router.navigate(['/home/admin-institutions-info']);
                });
              }
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
    }
  }
}
