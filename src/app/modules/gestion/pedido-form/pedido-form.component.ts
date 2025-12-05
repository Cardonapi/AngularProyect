// src/app/modules/gestion/pedido-form/pedido-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../../shared/services/order.service';
import { ClienteService } from '../../../shared/services/cliente.service';
import { MenuService } from '../../../shared/services/menu.service';
import { MotorcycleService } from '../../../shared/services/motorcycle.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Order } from '../../../shared/interfaces/order.interface';

interface SelectOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html',
})
export class PedidoFormComponent implements OnInit {
  pedidoForm: FormGroup;
  isEdit = false;
  pedidoId: number | null = null;
  loading = false;
  loadingData = false;

  // Arrays para selects
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
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pedidoForm = this.fb.group({
      customer_id: ['', Validators.required],
      menu_id: ['', Validators.required],
      motorcycle_id: ['', Validators.required], // Obligatorio
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllData();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.pedidoId = +params['id'];
        
        // Esperar a que carguen los datos antes de cargar el pedido
        if (!this.loadingData) {
          setTimeout(() => this.loadPedido(), 100);
        }
      }
    });
  }

  // ======================
  //   CARGAR TODOS LOS DATOS
  // ======================
  loadAllData(): void {
    this.loadingData = true;
    
    forkJoin({
      customers: this.customerService.getAll(),
      menus: this.menuService.getAll(),
      motorcycles: this.motorcycleService.getAll()
    }).subscribe({
      next: (results) => {
        // Procesar clientes
        this.customerOptions = this.processCustomers(results.customers);
        
        // Procesar menús
        this.menuOptions = this.processMenus(results.menus);
        
        // Procesar motocicletas - Mostrar "Moto #ID"
        this.motorcycleOptions = this.processMotorcycles(results.motorcycles);
        
        this.loadingData = false;
        
        // Si estamos en modo edición y ya cargamos los datos, cargar el pedido
        if (this.isEdit && this.pedidoId) {
          this.loadPedido();
        }
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos del formulario');
        this.loadingData = false;
      }
    });
  }

  private processCustomers(customers: any[]): SelectOption[] {
    return customers.map(customer => ({
      value: customer.id,
      label: `${customer.name || 'Cliente'} - ${customer.email || 'Sin email'}`
    }));
  }

  private processMenus(menus: any[]): SelectOption[] {
    return menus.map(menu => ({
      value: menu.id,
      label: `${menu.product?.name || 'Producto'} - $${menu.price || 0}`
    }));
  }

  private processMotorcycles(motorcycles: any[]): SelectOption[] {
    if (!motorcycles || motorcycles.length === 0) {
      return [];
    }
    
    // Mostrar simplemente "Moto #ID" o con placa si está disponible
    return motorcycles.map(motorcycle => {
      let label: string;
      
      if (motorcycle.license_plate) {
        // Si tiene placa, mostrar "Moto #ID (PLACA)"
        label = `Moto #${motorcycle.id} (${motorcycle.license_plate})`;
      } else if (motorcycle.plate) {
        // Si tiene plate (alias de license_plate)
        label = `Moto #${motorcycle.id} (${motorcycle.plate})`;
      } else {
        // Solo ID
        label = `Moto #${motorcycle.id}`;
      }
      
      return {
        value: motorcycle.id,
        label: label
      };
    });
  }

  // ==========================
  //      CARGAR PEDIDO
  // ==========================
  loadPedido(): void {
    if (!this.pedidoId) return;

    this.loading = true;

    this.orderService.getById(this.pedidoId).subscribe({
      next: (pedido: Order) => {
        // Verificar que el pedido tenga moto asignada
        let motorcycleId = pedido.motorcycle_id;
        
        // Si no tiene moto asignada y hay motos disponibles, asignar la primera
        if (!motorcycleId && this.motorcycleOptions.length > 0) {
          motorcycleId = this.motorcycleOptions[0].value;
          console.log(`🏍️ Asignando primera moto disponible: ${motorcycleId}`);
        } else if (!motorcycleId) {
          console.warn('⚠️ No hay motos disponibles para asignar');
          alert('Error: No hay motos disponibles. Debe crear motocicletas primero.');
          this.loading = false;
          return;
        }
        
        this.pedidoForm.patchValue({
          customer_id: pedido.customer_id ? pedido.customer_id.toString() : '',
          menu_id: pedido.menu_id ? pedido.menu_id.toString() : '',
          motorcycle_id: motorcycleId ? motorcycleId.toString() : '',
          quantity: pedido.quantity || 1,
          status: pedido.status || 'pending'
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar pedido:', error);
        alert('Error al cargar el pedido');
        this.loading = false;
      }
    });
  }

  // ==========================
  //      CREAR / EDITAR
  // ==========================
  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar errores
    this.markFormGroupTouched(this.pedidoForm);
    
    if (this.pedidoForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;

    const formValues = this.pedidoForm.value;
    
    const pedidoData: Order = {
      customer_id: Number(formValues.customer_id),
      menu_id: Number(formValues.menu_id),
      motorcycle_id: Number(formValues.motorcycle_id),
      quantity: Number(formValues.quantity),
      status: formValues.status
      // total_price será calculado por el backend
    };

    const operation = this.isEdit && this.pedidoId
      ? this.orderService.update(this.pedidoId, pedidoData)
      : this.orderService.create(pedidoData);

    operation.subscribe({
      next: (response) => {
        this.loading = false;

        // 🔔 Notificación solo para nuevos pedidos
        if (!this.isEdit) {
          const customerId = this.pedidoForm.value.customer_id;
          const quantity = this.pedidoForm.value.quantity;
          const motorcycleId = this.pedidoForm.value.motorcycle_id;

          const customerLabel =
            this.customerOptions.find(c => c.value === customerId)?.label ||
            `Cliente #${customerId}`;

          const customerName = customerLabel.split(' - ')[0];

          const motoLabel = this.motorcycleOptions.find(m => m.value === motorcycleId)?.label || `Moto #${motorcycleId}`;

          this.notificationService.orderAlert(
            '🚚 Nuevo Pedido Creado',
            `${quantity} items | Cliente: ${customerName} | ${motoLabel}`
          );
        }

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

  /**
   * Marcar todos los campos del formulario como tocados
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/gestion/pedidos']);
  }
}