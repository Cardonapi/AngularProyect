import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-pie-orders-status',
  templateUrl: './pie-orders-by-status.component.html',
  styleUrls: ['./pie-orders-by-status.component.css']
})
export class PieOrdersStatusComponent implements OnInit {

  chartOptions: any = {
    title: { text: 'Pedidos por Estado', left: 'center' },
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: '60%', data: [] }]
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getOrdersByStatus().subscribe({
      next: (data: any[]) => {
        console.log('[PieOrdersStatus] received data:', data);
        this.chartOptions = {
          title: { text: 'Pedidos por Estado', left: 'center' },
          tooltip: { trigger: 'item' },
          series: [{
            type: 'pie',
            radius: '60%',
            data: data.map(item => ({ value: item.count, name: item.status }))
          }]
        };
      },
      error: err => {
        console.error('[PieOrdersStatus] Error:', err);
        // Fallback demo data
        this.chartOptions.series[0].data = [
          { value: 20, name: 'Pending' },
          { value: 50, name: 'Delivered' },
          { value: 10, name: 'Cancelled' }
        ];
      }
    });
  }
}
