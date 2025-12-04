import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-bar-orders-per-day',
  templateUrl: './bar-orders-per-day.component.html',
  styleUrls: ['./bar-orders-per-day.component.css']
})
export class BarOrdersPerDayComponent implements OnInit {

  chartOptions: any = {
    title: { text: 'Pedidos por Día', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [] }]
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getOrdersPerDay().subscribe({
      next: (data: any[]) => {
        console.log('[BarOrdersPerDay] received data:', data);
        this.chartOptions = {
          title: { text: 'Pedidos por Día', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: data.map(d => d.day) },
          yAxis: { type: 'value' },
          series: [{ type: 'bar', data: data.map(d => d.orders) }]
        };
      },
      error: err => {
        console.error('[BarOrdersPerDay] Error:', err);
        // Fallback demo data
        this.chartOptions.xAxis.data = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        this.chartOptions.series[0].data = [12,15,10,18,9,22,14];
      }
    });
  }
}
