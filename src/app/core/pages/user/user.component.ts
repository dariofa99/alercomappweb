import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DepartmentModel } from '../../models/departmentModel';
import { RoleModel } from '../../models/roleModel';
import { TownModel } from '../../models/townModel';
import { UserModel } from '../../models/userModel';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
  ]
})
export class UserComponent implements OnInit {
  userForm !: FormGroup;
  isOnDepartment = true;
  townsDisplay: TownModel[] = [];
  selectedDepartment: number;
  selectedTown: string = "";
  selectedRole: string = "";

  @Input() item: UserModel;
  @Input() roles: RoleModel[];
  @Input() departments: DepartmentModel[];
  @Input() towns: Array<TownModel[]>;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private auth: AuthService) {
      this.userForm = this.formBuilder.group({
        name: ['',Validators.required],
        lastname: ['',Validators.required],
        username: ['',Validators.required],
        email: ['',Validators.required],
        town_id: ['',Validators.required],
        role_id: ['',Validators.required]
      });
    }

  ngOnInit(): void {
    console.log(this.departments);
    this.userForm.controls['name'].setValue(this.item.name);
    this.userForm.controls['lastname'].setValue(this.item.lastname);
    this.userForm.controls['username'].setValue(this.item.username);
    this.userForm.controls['email'].setValue(this.item.email);
    this.userForm.controls['town_id'].setValue(this.item.town_id);
    this.userForm.controls['role_id'].setValue(this.item.roles.length!=0?this.item.roles[0].id:'');
    this.selectedTown = this.item.town_id.toString();
    this.selectedRole = this.item.roles.length!=0?this.item.roles[0].id.toString():'';

    this.towns.forEach(element => {
      element.forEach(elementInside => {
        if(elementInside.id == this.item.town_id){
          this.selectedDepartment = elementInside.department_id;
        }
        if(elementInside.department_id.toString() == this.selectedDepartment.toString()){
          this.townsDisplay = element;
        }
      });
    });

    console.log(this.selectedDepartment);
  }

  onDepartmentSelected(event: any){
    this.isOnDepartment = true;
    this.towns.forEach(element => {
      element.forEach(elementInside => {
        if(elementInside.department_id == event.value){
          this.townsDisplay = element;
        }
      });
    });
  }

  updateUser(){
    if(this.userForm.valid){
      this.userService.putUser(this.auth.readToken(),this.item.id,this.userForm.value).subscribe({
        next: data => {{
          console.log(data);
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: 'Usuario actualizado con éxito'
          });
        }},
        error: error => {console.log('There was an error',error)}
      })
    }
    else{
      console.log('Error');
    }
  }

}
