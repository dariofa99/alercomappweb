import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserModel } from '../../models/userModel';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styles: [
  ]
})
export class UserAdminComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'lastname', 'username',
'email','phone_number','address','town_id','status_id'];
  dataSource: MatTableDataSource<UserModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() users: UserModel[];

  constructor() { }

  ngOnInit(): void {
    this.displayedColumns = this.displayedColumns.concat("delete");
  }

  ngAfterViewInit() {
    
  }

  applyFilter(event: Event) {
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
