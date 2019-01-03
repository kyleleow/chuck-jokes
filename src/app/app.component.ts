import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    swUpdate: SwUpdate,
    private dataService: DataService
  ){}

   //variable
   data: any

  ngOnInit(){
    this.dataService.getDataFromDb().then((items) => {
      if (items.length > 0){
        this.data = items;
      }
      else{
        this.getApiData();
      }
    }).catch(() => {
      this.getApiData();
    })  
  }

  onChange(row, changes, keyChanged: string){
    console.log(`${row} row's ${keyChanged} changes to: ${changes}`);
    let dataRow = {};
    Object.assign(dataRow, this.data[row]);
    dataRow[keyChanged] = changes;
    this.dataService.updateData(dataRow);
  }

  getApiData(){
    this.dataService.getData().subscribe(result => {
      this.data = result;
      this.dataService.storeData(result);      
    },
    err => {
      console.log(err);
    })
  }

}
