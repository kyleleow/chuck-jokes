import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as idb from 'idb';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) { }
    getData(){
      return this.http.post('https://8583affc-e178-430b-90d5-c70a17c66522.mock.pstmn.io/picking/search', {})
    }

    getDb(){
      return idb.default.open('test-db1', 1, (upgradeDb) => {
        console.log('making a new object store');
        if (!upgradeDb.objectStoreNames.contains('firstPicking')) {
          upgradeDb.createObjectStore('firstPicking', {keyPath:'ln'});
        }
      });
    }

    storeData(data){
      this.getDb().then((db) => {
        let tx = db.transaction('firstPicking', 'readwrite');
        let store = tx.objectStore('firstPicking');
        
        for (let item of data){
          store.add(item)
        }

        return tx.complete;
      }).then(() => {
        console.log('added item to store');
      })
    }

    updateData(data){
      this.getDb().then((db) => {
        let tx = db.transaction('firstPicking', 'readwrite');
        let store = tx.objectStore('firstPicking');

        store.put(data);
        return tx.complete;
      }).then(() => {
        console.log('item updated');
      })
    }

    getDataFromDb(){
      return this.getDb().then((db) => {
        let tx = db.transaction('firstPicking', 'readonly');
        let store = tx.objectStore('firstPicking');     

        return store.getAll();
      }).then((items) => {
        console.log('retrieved all items');
        return items;
      })
    }
}
