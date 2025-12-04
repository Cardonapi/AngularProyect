import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-line-avg-delivery-time',
  templateUrl: './line-avg-delivery-time.component.html',
  styleUrls: ['./line-avg-delivery-time.component.css']
})
export class LineAvgDeliveryTimeComponent implements OnInit {

  chartOptions: any = {
    title: { text: 'Tiempo Promedio de Entrega', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [] }]
  };

  constructor(private statsService: StatsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.statsService.getAvgDeliveryTime().subscribe({
      next: (data: any[]) => {
        this.chartOptions = {
          title: { text: 'Tiempo Promedio de Entrega', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: data.map(d => d.month) },
          yAxis: { type: 'value' },
          series: [{ type: 'line', data: data.map(d => d.avg_minutes) }]
        };
      },
      error: err => {
        console.error('[AvgDeliveryTime] Error from API, using local mock:', err);
        // Load local mock data
        this.http.get('assets/mock/avg-delivery-time.json').subscribe({
          next: (data: any[]) => {
            console.log('[AvgDeliveryTime] Loaded from local mock:', data);
            this.chartOptions = {
              title: { text: 'Tiempo Promedio de Entrega', left: 'center' },
              tooltip: { trigger: 'axis' },
              xAxis: { type: 'category', data: data.map(d => d.month) },
              yAxis: { type: 'value' },
              series: [{ type: 'line', data: data.map(d => d.avg_minutes) }]
            };
          },
          error: err2 => {
            console.error('[AvgDeliveryTime] Error loading mock:', err2);
            // Fallback demo data if mock file also fails
            this.chartOptions.xAxis.data = ['2025-01','2025-02','2025-03','2025-04','2025-05','2025-06'];
            this.chartOptions.series[0].data = [28.5,27.8,30.1,26.9,25.6,24.8];
          }
        });
      }
    });
  }
}
