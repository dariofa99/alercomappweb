import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import {AfterViewInit, Component, ViewChild, OnInit, QueryList, ViewChildren, Input} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { PermissionsModel } from '../../models/permissionsModel';
import { RoleModel } from '../../models/roleModel';
import {RolesPermissionsService} from '../../services/roles-permissions.service';
import { MatTable } from "@angular/material/table";
import { FormArray, FormControl, Validators } from '@angular/forms';
import { ArrowDivDirective } from '../../directives/arrow-div.directive';
import { KeyBoardService } from '../../services/keyboard.service';

export const data = [["uno", "one"], ["dos", "two"], ["tres", "three"]];

export interface RolesPermissions {

  name_role: string;
  name_permission: string;
  
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styles: [
  ]
})
export class RolesPermissionsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatTable, { static: true }) table: MatTable<any>; //used when add a row, see comment in function add()
  displayedHeads: string[] = [];
  displayedColumns: string[] = [];
  myformArray: FormArray;

  columns: number;

  @ViewChildren(ArrowDivDirective) inputs: QueryList<ArrowDivDirective>;


  //-------------------

  @Input() roles: RoleModel[];
  @Input() permissions: PermissionsModel[];

  /*columnNames: string[] = [];*/
  listRolesPermissions: any[] = [];
  listRoles: any[] = [];

  /*displayedColumns: string[];
  dataSource: MatTableDataSource<RolesPermissions>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; */

  constructor(private rolesPermissions: RolesPermissionsService, private keyboardService: KeyBoardService) {
    // Assign the data to the data source for the table to render
    //this.dataSource = new MatTableDataSource(this.roles);
    //console.log(this.roles);
  }

  ngOnInit(): void {
    this.permissions.forEach(elementPermissions => {
      this.roles.forEach(elementRoles => {
        this.listRoles.push(elementRoles);
      });
      this.listRolesPermissions.push(this.listRoles);
      this.listRoles = [];
    });
    console.log(this.listRolesPermissions);


    this.displayedHeads = this.roles.map((x, index) => x.name);
    this.displayedColumns = this.displayedHeads.concat("delete");
    this.myformArray = new FormArray(
      this.listRolesPermissions.map(row => new FormArray(row.map(x => new FormControl(x.name_permission,Validators.required))))
    );
    console.log(this.myformArray);

    this.columns = data[0].length;
    this.keyboardService.keyBoard.subscribe(res => {
      this.move(res);
    });


    /* this.displayedHeads = data[0].map((x, index) => "col" + index);
    this.displayedColumns = this.displayedHeads.concat("delete");
    this.myformArray = new FormArray(
      data.map(row => new FormArray(row.map(x => new FormControl(x,Validators.required))))
    );

    this.columns = data[0].length;
    this.keyboardService.keyBoard.subscribe(res => {
      this.move(res);
    }); */
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
    //console.log(this.roles);
    //this.columnNames.push('Roles / Permissions')
    //this.columnNames.push('name_role');
    //this.columnNames.push('name_permission');
    /* this.roles.forEach(elementRoles => {
      this.permissions.forEach(elementPermissions => {
        this.listPermissions.push(elementPermissions);
      });
      this.listRolesPermissions.push(this.listPermissions);
      this.listPermissions = [];
    });
    console.log(this.listRolesPermissions);


    this.displayedHeads = this.listRolesPermissions[0].map((x, index) => "col" + index);
    this.displayedColumns = this.displayedHeads.concat("delete");
    this.myformArray = new FormArray(
      this.listRolesPermissions.map(row => new FormArray(row.map(x => new FormControl(x,Validators.required))))
    );
    console.log(this.myformArray);

    this.columns = data[0].length;
    this.keyboardService.keyBoard.subscribe(res => {
      this.move(res);
    }); */
    //this.displayedColumns = this.columnNames;

    /*this.dataSource = new MatTableDataSource(this.listRolesPermissions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;*/
  }

  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } */


  delete(index: number) {
    this.myformArray.removeAt(index);
    this.table.renderRows();
  }
  add() {
    const empty = [];
    for (let i = 0; i < this.columns; i++) empty.push(true);

    this.myformArray.push(new FormArray(empty.map(x => new FormControl("",Validators.required))));
    console.log(this.myformArray.controls)
    this.table.renderRows();
  }
  move(object) {
    const inputToArray = this.inputs.toArray();
    const rows = this.myformArray.length;
    const cols = this.displayedColumns.length;
    let index = inputToArray.findIndex(x => x.element === object.element);
    switch (object.action) {
      case "UP":
        index--;
        break;
      case "DOWN":
        index++;
        break;
      case "LEFT":
        if (index - rows >= 0) index -= rows;
        else {
          let rowActual = index % rows;
          if (rowActual > 0) index = rowActual - 1 + (cols - 1) * rows;
        }
        break;
      case "RIGTH":
        console.log(index + rows, inputToArray.length);
        if (index + rows < inputToArray.length) index += rows;
        else {
          let rowActual = index % rows;
          if (rowActual < rows - 1) index = rowActual + 1;
        }
        break;
    }
    if (index >= 0 && index < this.inputs.length) {
      inputToArray[index].element.nativeElement.focus();
    }
  }

}