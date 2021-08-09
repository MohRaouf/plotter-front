import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { DataService } from './data.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Plotter';

  /******** Chart Measures *********/
  lineChartData: ChartDataSets[] = new Array<ChartDataSets>();

  /******* Chart Dimension ********/
  lineChartLabels: Label[] = new Array<Label>();

  /* Chart Config */
  lineChartOptions: (ChartOptions | { annotation: any }) = { responsive: true };

  constructor(private dataService: DataService) { }

  columns: any = [];
  measures: any = []
  dimensions: any = [];

  ngOnInit(): void {
    this.dataService.readColumns().pipe(untilDestroyed(this)).subscribe(
      (res) => { this.columns = (res.body['length']) ? res.body : null; console.log(this.columns) },
      (err) => { console.log(err) });
  }

  drop(event: CdkDragDrop<string[]>) {
    let item = event.previousContainer.data[event.previousIndex];
    let destContainer = event.container.element.nativeElement.id;

    if (destContainer == "columns" || item?.['function'] == destContainer) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      this.limitDimension();
      this.updateChart();
    }
  }

  limitDimension() {
    if (this.dimensions.length > 1) {
      this.columns = [...this.columns, ...this.dimensions.slice(1)];
      this.dimensions = [this.dimensions.shift()];
    }
  }

  updateChart() {
    if (this.dimensions.length && this.measures.length) {

      /* POST: /data ---> {"measures:["Cost"] , "dimension:"Product"} */
      this.dataService.readChartData({ measures: this.measures.map(measure => measure.name), dimension: this.dimensions[0].name, })
        .pipe(untilDestroyed(this)).subscribe(
          (res) => {

            /* Set Chart X-Labels = dimension values  */
            this.lineChartLabels = []; //Reset the Chart Labels
            this.lineChartLabels.push(...res.body.filter(item => item.name === this.dimensions[0].name)[0].values);

            /* Set Chart Y-Line Data and label = Measures values - Measure Name */
            this.lineChartData = [];
            this.lineChartData = res.body.filter(item => item.name !== this.dimensions[0].name).map(item => {
              return {
                data: item.values,
                label: item.name,
                borderColor: 'black',
                backgroundColor: `rgba(${this.randomNumber(0, 255)},${this.randomNumber(0, 255)},${this.randomNumber(0, 255)},0.3)`
              }
            });
          },
          (err) => { console.log(err) });
    }
  }

  clearDimensions() {
    this.columns = [...this.columns, ...this.dimensions];
    this.dimensions = [];
    this.lineChartData = []
  }
  clearMeasures() {
    this.columns = [...this.columns, ...this.measures];
    this.measures = [];
    this.lineChartLabels = [];
  }

  // Function to generate random number  
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

}
