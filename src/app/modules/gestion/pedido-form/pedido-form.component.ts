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
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pedidoForm = this.fb.group({
      customer_id: ['', [Validators.required]],
      menu_id: ['', [Validators.required]],
      motorcycle_id: ['', [Validators.required]], // Ahora es requerido
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['pending', [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log('🔄 Inicializando formulario de pedido...');
    
    // Cargar todos los datos necesarios primero
    this.loadAllData();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.pedidoId = +params['id'];
        console.log(`✏️ Modo edición para pedido ID: ${this.pedidoId}`);
        
        // Esperar a que carguen los datos antes de cargar el pedido
        if (!this.loadingData) {
          setTimeout(() => this.loadPedido(), 100);
        }
      } else {
        console.log('➕ Modo creación de nuevo pedido');
      }
    });
  }

  loadAllData(): void {
    this.loadingData = true;
    console.log('📊 Cargando datos para selects...');
    
    forkJoin({
      customers: this.customerService.getAll(),
      menus: this.menuService.getAll(),
      motorcycles: this.motorcycleService.getAll()
    }).subscribe({
      next: (results) => {
        console.log('✅ Datos cargados exitosamente');
        
        // Procesar clientes
        this.customerOptions = this.processCustomers(results.customers);
        console.log(`👥 ${this.customerOptions.length} clientes cargados`);
        
        // Procesar menús
        this.menuOptions = this.processMenus(results.menus);
        console.log(`🍽️ ${this.menuOptions.length} menús cargados`);
        
        // Procesar motocicletas
        this.motorcycleOptions = this.processMotorcycles(results.motorcycles);
        console.log(`🏍️ ${this.motorcycleOptions.length} motos cargadas`);
        
        this.loadingData = false;
        
        // Si estamos en modo edición y ya cargamos los datos, cargar el pedido
        if (this.isEdit && this.pedidoId) {
          this.loadPedido();
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar datos:', error);
        this.loadingData = false;
        alert('Error al cargar los datos del formulario. Por favor, intente nuevamente.');
      }
    });
  }

  private processCustomers(customers: any[]): SelectOption[] {
    if (!customers || customers.length === 0) {
      return [];
    }
    
    return customers.map(customer => {
      // Crear una etiqueta descriptiva
      let label = '';
      if (customer.name && customer.email) {
        label = `${customer.name} (${customer.email})`;
      } else if (customer.name) {
        label = customer.name;
      } else if (customer.email) {
        label = customer.email;
      } else {
        label = `Cliente #${customer.id}`;
      }
      
      return {
        value: customer.id,
        label: label
      };
    });
  }

  private processMenus(menus: any[]): SelectOption[] {
    if (!menus || menus.length === 0) {
      return [];
    }
    
    return menus.map(menu => {
      // Manejar diferentes estructuras posibles
      let productName = 'Producto';
      
      if (menu.product && menu.product.name) {
        productName = menu.product.name;
      } else if (menu.product_name) {
        productName = menu.product_name;
      } else if (menu.name) {
        productName = menu.name;
      }
      
      const price = menu.price || 0;
      const label = `${productName} - $${price.toFixed(2)}`;
      
      return {
        value: menu.id,
        label: label
      };
    });
  }

  private processMotorcycles(motorcycles: any[]): SelectOption[] {
    if (!motorcycles || motorcycles.length === 0) {
      return [];
    }
    
    return motorcycles.map(motorcycle => {
      // Crear etiqueta descriptiva
      let label = '';
      if (motorcycle.plate && motorcycle.driver_name) {
        label = `${motorcycle.plate} - ${motorcycle.driver_name}`;
      } else if (motorcycle.plate) {
        label = motorcycle.plate;
      } else if (motorcycle.driver_name) {
        label = motorcycle.driver_name;
      } else {
        label = `Moto #${motorcycle.id}`;
      }
      
      return {
        value: motorcycle.id,
        label: label
      };
    });
  }

  loadPedido(): void {
    if (this.pedidoId && !this.loadingData) {
      this.loading = true;
      console.log(`📥 Cargando pedido ID: ${this.pedidoId}`);
      
      this.orderService.getById(this.pedidoId).subscribe({
        next: (pedido: Order) => {
          console.log('✅ Pedido cargado:', pedido);
          
          // Verificar si el pedido tiene moto asignada
          if (!pedido.motorcycle_id) {
            console.warn('⚠️ Pedido sin moto asignada. Seleccionando la primera disponible...');
            
            // Si no hay moto asignada, asignar la primera disponible
            if (this.motorcycleOptions.length > 0) {
              pedido.motorcycle_id = this.motorcycleOptions[0].value;
              console.log(`🏍️ Asignando moto ID: ${pedido.motorcycle_id}`);
            } else {
              console.error('❌ No hay motos disponibles para asignar');
              alert('No hay motos disponibles. Debe crear motocicletas primero.');
              this.loading = false;
              return;
            }
          }
          
          // Formatear valores para el formulario
          const formValues = {
            customer_id: pedido.customer_id?.toString() || '',
            menu_id: pedido.menu_id?.toString() || '',
            motorcycle_id: pedido.motorcycle_id?.toString() || '',
            quantity: pedido.quantity || 1,
            status: pedido.status || 'pending'
          };
          
          this.pedidoForm.patchValue(formValues);
          console.log('📝 Formulario actualizado con valores:', formValues);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error al cargar el pedido:', error);
          alert('Error al cargar el pedido. Por favor, intente nuevamente.');
          this.loading = false;
          this.router.navigate(['/gestion/pedidos']);
        }
      });
    }
  }

  onSubmit(): void {
    console.log('📤 Enviando formulario...');
    console.log('📋 Valores del formulario:', this.pedidoForm.value);
    
    // Marcar todos los campos como tocados para mostrar errores
    this.markFormGroupTouched(this.pedidoForm);
    
    if (this.pedidoForm.valid) {
      this.loading = true;
      
      const formValues = this.pedidoForm.value;
      
      // Preparar datos para el backend - todos son obligatorios
      const pedidoData: Order = {
        customer_id: Number(formValues.customer_id),
        menu_id: Number(formValues.menu_id),
        motorcycle_id: Number(formValues.motorcycle_id), // Ahora siempre es número
        quantity: Number(formValues.quantity),
        status: formValues.status
        // total_price será calculado por el backend
      };
      
      console.log('🚀 Datos a enviar al backend:', pedidoData);
      
      // Determinar la operación a realizar
      const operation = this.isEdit && this.pedidoId
        ? this.orderService.update(this.pedidoId, pedidoData)
        : this.orderService.create(pedidoData);

      operation.subscribe({
        next: (response) => {
          console.log('✅ Operación exitosa:', response);
          this.loading = false;
          alert(`Pedido ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
          this.router.navigate(['/gestion/pedidos']);
        },
        error: (error) => {
          console.error('❌ Error en la operación:', error);
          this.loading = false;
          
          // Mostrar mensaje de error detallado
          let errorMessage = `Error al ${this.isEdit ? 'actualizar' : 'crear'} el pedido`;
          
          if (error.status === 400 && error.error) {
            // Manejar errores de validación del backend
            if (typeof error.error === 'object') {
              const errors = Object.values(error.error).flat();
              errorMessage += `:\n• ${errors.join('\n• ')}`;
            } else if (typeof error.error === 'string') {
              errorMessage += `: ${error.error}`;
            }
          } else if (error.message) {
            errorMessage += `: ${error.message}`;
          }
          
          alert(errorMessage);
        }
      });
    } else {
      console.warn('⚠️ Formulario inválido. Errores:', this.getFormErrors());
      alert('Por favor, complete todos los campos requeridos correctamente.');
    }
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

  /**
   * Obtener errores del formulario para debug
   */
  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.pedidoForm.controls).forEach(key => {
      const control = this.pedidoForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  goBack(): void {
    console.log('🔙 Regresando a la lista de pedidos');
    this.router.navigate(['/gestion/pedidos']);
  }

  // Getters para el template
  get customer_id() { return this.pedidoForm.get('customer_id'); }
  get menu_id() { return this.pedidoForm.get('menu_id'); }
  get motorcycle_id() { return this.pedidoForm.get('motorcycle_id'); }
  get quantity() { return this.pedidoForm.get('quantity'); }
  get status() { return this.pedidoForm.get('status'); }
}