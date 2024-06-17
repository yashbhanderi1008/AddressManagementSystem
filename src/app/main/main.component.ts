import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  userList: any[] = [];

  ngOnInit(): void {
    this.loadUserList();
  }

  loadUserList(): void {
    const storedUserList = localStorage.getItem('userList');
    if (storedUserList) {
      this.userList = JSON.parse(storedUserList);
    }
  }

  onListChange(changeUserList: any): void{
    this.userList = changeUserList;
    localStorage.setItem('userList', JSON.stringify(this.userList));
  }
}
