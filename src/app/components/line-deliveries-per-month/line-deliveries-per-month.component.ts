import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-line-deliveries-per-month',
  templateUrl: './line-deliveries-per-month.component.html',
  styleUrls: ['./line-deliveries-per-month.component.css']
})
export class LineDeliveriesPerMonthComponent implements OnInit {

  chartOptions: any = {
    title: { text: 'Entregas por Mes', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [] }]
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getDeliveriesPerMonth().subscribe({
      next: (data: any[]) => {
        console.log('[DeliveriesPerMonth] received data:', data);
        this.chartOptions = {
          title: { text: 'Entregas por Mes', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: data.map(d => d.month) },
          yAxis: { type: 'value' },
          series: [{ type: 'line', data: data.map(d => d.deliveries) }]
        };
      },
      error: err => {
        console.error('[DeliveriesPerMonth] Error:', err);
        // Fallback demo data
        this.chartOptions.xAxis.data = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.chartOptions.series[0].data = [120,140,130,150,160,170,180,150,165,175,160,155];
      }
    });
  }
}
