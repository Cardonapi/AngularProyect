import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-bar-products-most-sold',
  templateUrl: './bar-products-most-sold.component.html',
  styleUrls: ['./bar-products-most-sold.component.css']
})
export class BarProductsMostSoldComponent implements OnInit {

  chartOptions: any = {
    title: { text: 'Productos Más Vendidos', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [] }]
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getProductsMostSold().subscribe({
      next: (data: any[]) => {
        console.log('[ProductsMostSold] received data:', data);
        this.chartOptions = {
          title: { text: 'Productos Más Vendidos', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: data.map(d => d.product) },
          yAxis: { type: 'value' },
          series: [{ type: 'bar', data: data.map(d => d.qty) }]
        };
      },
      error: err => {
        console.error('[ProductsMostSold] Error:', err);
        // Fallback demo data
        this.chartOptions.xAxis.data = ['Product A','Product B','Product C','Product D','Product E'];
        this.chartOptions.series[0].data = [120,90,75,60,45];
      }
    });
  }
}
