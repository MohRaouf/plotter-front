import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from './config';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private client: HttpClient) { }

  // create(store: any) {
  //   return this.client.post(`${config.apiUrl}/columns/`, store, { observe: 'response' });
  // }
  // readColumn(id: any) {
  //   return this.client.get(`${config.apiUrl}/columns/${id}`, { observe: 'response' });
  // }
  // readData(id: any) {
  //   return this.client.get(`${config.apiUrl}/data/crud/${id}`, { observe: 'response' });
  // }
  readColumns() {
    return this.client.get(`${config.apiUrl}/columns`, { observe: 'response' });
  }
  readChartData(keys: any) {
    // return this.client.post<[{ name: any, values: Array<any> }]>(`${config.apiUrl}/data`, keys, { observe: 'response' });
    return this.client.post<[any]>(`${config.apiUrl}/data`, keys, { observe: 'response' });

  }
  // update(id: any, updates: any) {
  //   return this.client.patch(`${config.apiUrl}/columns/${id}`, updates, { observe: 'response' });
  // }
  // delete(id: any) {
  //   return this.client.delete(`${config.apiUrl}/columns/${id}`, { observe: 'response' });
  // }

}
