// src/app/modules/gestion/pedido-form/pedido-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../shared/services/order.service';
import { ClienteService } from '../../../shared/services/cliente.service';
import { MenuService } from '../../../shared/services/menu.service';
import { MotorcycleService } from '../../../shared/services/motorcycle.service';
import { Order } from '../../../shared/interfaces/order.interface';

interface SelectOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html',
  //styleUrls: ['./pedido-form.component.scss']
})
export class PedidoFormComponent implements OnInit {
  pedidoForm: FormGroup;
  isEdit = false;
  pedidoId: number | null = null;
  loading = false;
  loadingData = false;

  // Arrays para los selects
  customerOptions: SelectOption[] = [];
  menuOptions: SelectOption[] = [];
  motorcycleOptions: SelectOption[] = [];
  
  // Opciones para estado
  statusOptions = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'delivered', label: 'Entregado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private customerService: ClienteService,
    private menuService: MenuService,
    private motorcycleService: MotorcycleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pedidoForm = this.fb.group({
      customer_id: [null, [Validators.required]],
      menu_id: [null, [Validators.required]],
      motorcycle_id: [null], // Opcional
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['pending', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadMenus();
    this.loadMotorcycles();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.pedidoId = +params['id'];
        this.loadPedido();
      }
    });
  }

  loadCustomers(): void {
    this.loadingData = true;
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customerOptions = customers.map(customer => ({
          value: customer.id!,
          label: `${customer.name || 'Cliente'} - ${customer.email || 'Sin email'}`
        }));
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.loadingData = false;
        alert('Error al cargar la lista de clientes');
      }
    });
  }

  loadMenus(): void {
    this.loadingData = true;
    this.menuService.getAll().subscribe({
      next: (menus) => {
        this.menuOptions = menus.map(menu => ({
          value: menu.id!,
          label: `${menu.product?.name || 'Producto'} - $${menu.price || 0}`
        }));
        this.loadingData = false;
      },
      error: (error) => {
        console.error('Error al cargar menús:', error);
        this.loadingData = false;
        alert('Error al cargar la lista de menús');
      }
    });
  }

  loadMotorcycles(): void {
    this.loadingData = true;
    
    // Verifica si existe el método getAvailable
    if (this.motorcycleService.getAvailable) {
      this.motorcycleService.getAvailable().subscribe({
        next: (motorcycles) => {
          this.setMotorcycleOptions(motorcycles);
        },
        error: (error) => {
          console.warn('Error con getAvailable, usando getAll:', error);
          this.loadAllMotorcycles();
        }
      });
    } else {
      // Si no existe getAvailable, usa getAll
      this.loadAllMotorcycles();
    }
  }

  loadAllMotorcycles(): void {
    this.motorcycleService.getAll().subscribe({
      next: (motorcycles) => {
        this.setMotorcycleOptions(motorcycles);
      },
      error: (error) => {
        console.error('Error al cargar motos:', error);
        this.setDefaultMotorcycleOptions();
      }
    });
  }

  setMotorcycleOptions(motorcycles: any[]): void {
    this.motorcycleOptions = [
      { value: null, label: 'Sin asignar' },
      ...motorcycles.map(motorcycle => ({
        value: motorcycle.id,
        label: `${motorcycle.plate || 'Moto'} - ${motorcycle.driver_name || 'Conductor'}`
      }))
    ];
    this.loadingData = false;
  }

  setDefaultMotorcycleOptions(): void {
    this.motorcycleOptions = [{ value: null, label: 'Sin asignar' }];
    this.loadingData = false;
  }

  loadPedido(): void {
    if (this.pedidoId) {
      this.loading = true;
      this.orderService.getById(this.pedidoId).subscribe({
        next: (pedido: Order) => {
          this.pedidoForm.patchValue({
            customer_id: pedido.customer_id,
            menu_id: pedido.menu_id,
            motorcycle_id: pedido.motorcycle_id || null,
            quantity: pedido.quantity,
            status: pedido.status
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al cargar el pedido');
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.pedidoForm.valid) {
      this.loading = true;
      
      // Preparar datos para enviar (sin total_price)
      const pedidoData: Partial<Order> = {
        customer_id: this.pedidoForm.get('customer_id')?.value,
        menu_id: this.pedidoForm.get('menu_id')?.value,
        motorcycle_id: this.pedidoForm.get('motorcycle_id')?.value || null,
        quantity: this.pedidoForm.get('quantity')?.value,
        status: this.pedidoForm.get('status')?.value
        // total_price NO se incluye - el backend lo calcula
      };

      // Para TypeScript, podrías necesitar un cast
      const operation = this.isEdit && this.pedidoId
        ? this.orderService.update(this.pedidoId, pedidoData as Order)
        : this.orderService.create(pedidoData as Order);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Pedido ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
          this.router.navigate(['/gestion/pedidos']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} el pedido`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/pedidos']);
  }
}