import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NotificationBellComponent } from './notification-bell/notification-bell.component';
import { PieOrdersRestaurantComponent } from './pie-orders-restaurant/pie-orders-restaurant.component';
import { PieOrdersStatusComponent } from './pie-orders-by-status/pie-orders-by-status.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { PiePaymentMethodsComponent } from './pie-payment-methods/pie-payment-methods.component';
import { BarOrdersPerDayComponent } from './bar-orders-per-day/bar-orders-per-day.component';
import { BarProductsMostSoldComponent } from './bar-products-most-sold/bar-products-most-sold.component';
import { BarDriversActivityComponent } from './bar-drivers-activity/bar-drivers-activity.component';
import { LineDeliveriesPerMonthComponent } from './line-deliveries-per-month/line-deliveries-per-month.component';
import { LineIncomePerMonthComponent } from './line-income-per-month/line-income-per-month.component';
import { LineAvgDeliveryTimeComponent } from './line-avg-delivery-time/line-avg-delivery-time.component';
import { ChatbotComponent } from './chatbot/chatbot.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    NgxEchartsModule.forRoot({ echarts })
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    NotificationBellComponent,
    PieOrdersRestaurantComponent, 
    PieOrdersStatusComponent,
    PiePaymentMethodsComponent, 
    BarOrdersPerDayComponent, 
    BarProductsMostSoldComponent, 
    BarDriversActivityComponent, 
    LineDeliveriesPerMonthComponent, 
    LineIncomePerMonthComponent, 
    LineAvgDeliveryTimeComponent,
    ChatbotComponent
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    NotificationBellComponent,
    PieOrdersRestaurantComponent,
    PieOrdersStatusComponent,
    PiePaymentMethodsComponent,
    BarOrdersPerDayComponent,
    BarProductsMostSoldComponent,
    BarDriversActivityComponent,
    LineDeliveriesPerMonthComponent,
    LineIncomePerMonthComponent,
    LineAvgDeliveryTimeComponent,
    ChatbotComponent
  ]
})
export class ComponentsModule { }
