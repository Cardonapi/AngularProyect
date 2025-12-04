import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-pie-payment-methods',
  templateUrl: './pie-payment-methods.component.html',
  styleUrls: ['./pie-payment-methods.component.css']
})
export class PiePaymentMethodsComponent implements OnInit {

  chartOptions: any = {
    title: { text: 'Métodos de Pago', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: '60%', data: [] }]
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getPaymentMethods().subscribe({
      next: (data: any[]) => {
        console.log('[PiePaymentMethods] received data:', data);
        this.chartOptions = {
          title: { text: 'Métodos de Pago', left: 'center' },
          tooltip: { trigger: 'item' },
          series: [{
            type: 'pie',
            radius: '60%',
            data: data.map(item => ({ value: item.count, name: item.method }))
          }]
        };
      },
      error: err => {
        console.error('[PiePaymentMethods] Error:', err);
        // Fallback demo data
        this.chartOptions.series[0].data = [
          { value: 60, name: 'Credit Card' },
          { value: 30, name: 'Cash' },
          { value: 10, name: 'Other' }
        ];
      }
    });
  }
}
