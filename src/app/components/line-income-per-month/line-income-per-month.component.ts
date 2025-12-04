import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-line-income-per-month',
  templateUrl: './line-income-per-month.component.html',
  styleUrls: ['./line-income-per-month.component.css']
})
export class LineIncomePerMonthComponent implements OnInit {

  chartOptions: any = {
    title: { text: 'Ingresos por Mes', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [] }]
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getIncomePerMonth().subscribe({
      next: (data: any[]) => {
        console.log('[IncomePerMonth] received data:', data);
        this.chartOptions = {
          title: { text: 'Ingresos por Mes', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: data.map(d => d.month) },
          yAxis: { type: 'value' },
          series: [{ type: 'line', data: data.map(d => d.income) }]
        };
      },
      error: err => {
        console.error('[IncomePerMonth] Error:', err);
        // Fallback demo data
        this.chartOptions.xAxis.data = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.chartOptions.series[0].data = [12000,15000,11000,18000,14000,16000,17000,15000,19000,22000,20000,21000];
      }
    });
  }
}
