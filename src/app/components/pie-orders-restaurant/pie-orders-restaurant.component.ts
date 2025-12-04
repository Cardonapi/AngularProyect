import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-pie-orders-restaurant',
  templateUrl: './pie-orders-restaurant.component.html',
  styleUrls: ['./pie-orders-restaurant.component.css']
})
export class PieOrdersRestaurantComponent implements OnInit {
  chartOptions: any = {
    title: {
      text: 'Pedidos por Restaurante',
      left: 'center'
    },
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Pedidos',
        type: 'pie',
        radius: '60%',
        data: [],
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0 } }
      }
    ]
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.statsService.getOrdersByRestaurant().subscribe({
      next: (data: any[]) => {
        console.log('[PieOrdersRestaurant] received data:', data);
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('[PieOrdersRestaurant] No data received for chart');
          // keep default empty series
          return;
        }

        this.chartOptions = {
          title: { text: 'Pedidos por Restaurante', left: 'center' },
          tooltip: { trigger: 'item' },
          series: [
            {
              name: 'Pedidos',
              type: 'pie',
              radius: '60%',
              data: data.map(item => ({ value: item.orders, name: item.restaurant })),
              emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0 } }
            }
          ]
        };
      },
      error: (err) => {
        console.error('[PieOrdersRestaurant] error fetching data:', err);
      }
    });
  }
}

