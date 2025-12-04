import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-bar-drivers-activity',
  templateUrl: './bar-drivers-activity.component.html',
  styleUrls: ['./bar-drivers-activity.component.css']
})
export class BarDriversActivityComponent implements OnInit {

  chartOptions: any = {
    title: { text: 'Actividad de Conductores', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [] }]
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getDriversActivity().subscribe({
      next: (data: any[]) => {
        console.log('[DriversActivity] received data:', data);
        this.chartOptions = {
          title: { text: 'Actividad de Conductores', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: data.map(d => d.driver) },
          yAxis: { type: 'value' },
          series: [{ type: 'bar', data: data.map(d => d.deliveries) }]
        };
      },
      error: err => {
        console.error('[DriversActivity] Error:', err);
        // Fallback demo data
        this.chartOptions.xAxis.data = ['Driver 1','Driver 2','Driver 3','Driver 4'];
        this.chartOptions.series[0].data = [25,30,18,22];
      }
    });
  }
}
