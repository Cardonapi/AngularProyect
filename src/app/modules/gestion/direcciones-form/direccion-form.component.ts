// src/app/modules/gestion/direccion-form/direccion-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from '../../../shared/interfaces/address.interface';
import { AddressService } from '../../../shared/services/address.service';
import { OrderService } from '../../../shared/services/order.service';

interface SelectOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-direccion-form',
  templateUrl: './direccion-form.component.html'
})
export class DireccionFormComponent implements OnInit {
  direccionForm: FormGroup;
  isEdit = false;
  direccionId: number | null = null;
  loading = false;
  loadingData = false;

  // Array para el select de pedidos
  orderOptions: SelectOption[] = [];

  // Estados/Departamentos predefinidos
  stateOptions = [
    'Antioquia', 'Bogotá D.C.', 'Valle del Cauca', 'Cundinamarca',
    'Santander', 'Atlántico', 'Bolívar', 'Magdalena', 'Cesar',
    'La Guajira', 'Sucre', 'Córdoba', 'Nariño', 'Cauca',
    'Huila', 'Tolima', 'Boyacá', 'Caldas', 'Risaralda',
    'Quindío', 'Meta', 'Casanare', 'Arauca', 'Putumayo',
    'Amazonas', 'Guainía', 'Guaviare', 'Vaupés', 'Vichada',
    'San Andrés y Providencia'
  ];

  constructor(
    private fb: FormBuilder,
    private addressService: AddressService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.direccionForm = this.fb.group({
      street: ['', [Validators.required, Validators.minLength(5)]],
      additional_info: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postal_code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // 6 dígitos para Colombia
      order_id: ['', [Validators.required]] // Ahora es obligatorio
    });
  }

  ngOnInit(): void {
    // Cargar pedidos para el select
    this.loadOrders();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.direccionId = +params['id'];
        
        // Esperar a que carguen los pedidos antes de cargar la dirección
        if (!this.loadingData) {
          setTimeout(() => this.loadDireccion(), 100);
        }
      }
    });
  }

  // ======================
  //   CARGAR PEDIDOS
  // ======================
  loadOrders(): void {
    this.loadingData = true;
    
    this.orderService.getAll().subscribe({
      next: (orders) => {
        this.orderOptions = this.processOrders(orders);
        this.loadingData = false;
        
        // Si estamos en modo edición y ya cargamos los datos, cargar la dirección
        if (this.isEdit && this.direccionId) {
          this.loadDireccion();
        }
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
        this.loadingData = false;
        alert('Error al cargar la lista de pedidos');
      }
    });
  }

  private processOrders(orders: any[]): SelectOption[] {
    if (!orders || orders.length === 0) {
      return [];
    }
    
    return orders.map(order => {
      // Crear una etiqueta descriptiva para el pedido
      let label = `Pedido #${order.id}`;
      
      if (order.customer_name) {
        label += ` - ${order.customer_name}`;
      } else if (order.customer?.name) {
        label += ` - ${order.customer.name}`;
      }
      
      // Agregar estado del pedido si está disponible
      if (order.status) {
        const statusMap: {[key: string]: string} = {
          'pending': '⏳',
          'in_progress': '🔄',
          'delivered': '✅',
          'cancelled': '❌'
        };
        label += ` ${statusMap[order.status] || ''}`;
      }
      
      return {
        value: order.id,
        label: label
      };
    });
  }

  // ==========================
  //      CARGAR DIRECCIÓN
  // ==========================
  loadDireccion(): void {
    if (this.direccionId && !this.loadingData) {
      this.loading = true;
      
      this.addressService.getById(this.direccionId).subscribe({
        next: (direccion: Address) => {
          this.direccionForm.patchValue({
            street: direccion.street || '',
            additional_info: direccion.additional_info || '',
            city: direccion.city || '',
            state: direccion.state || '',
            postal_code: direccion.postal_code || '',
            order_id: direccion.order_id ? direccion.order_id.toString() : ''
          });
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar dirección:', error);
          alert('Error al cargar la dirección');
          this.loading = false;
        }
      });
    }
  }

  // ==========================
  //      CREAR / EDITAR
  // ==========================
  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar errores
    this.markFormGroupTouched(this.direccionForm);
    
    if (this.direccionForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;
    
    const direccionData: Address = {
      street: this.direccionForm.value.street,
      additional_info: this.direccionForm.value.additional_info || null,
      city: this.direccionForm.value.city,
      state: this.direccionForm.value.state,
      postal_code: this.direccionForm.value.postal_code,
      order_id: Number(this.direccionForm.value.order_id)
    };

    const operation = this.isEdit && this.direccionId
      ? this.addressService.update(this.direccionId, direccionData)
      : this.addressService.create(direccionData);

    operation.subscribe({
      next: (response) => {
        this.loading = false;
        alert(`Dirección ${this.isEdit ? 'actualizada' : 'creada'} correctamente`);
        this.router.navigate(['/gestion/direcciones']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error:', error);
        alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} la dirección`);
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
    this.router.navigate(['/gestion/direcciones']);
  }

  // Getters para el template
  get street() { return this.direccionForm.get('street'); }
  get city() { return this.direccionForm.get('city'); }
  get state() { return this.direccionForm.get('state'); }
  get postal_code() { return this.direccionForm.get('postal_code'); }
  get order_id() { return this.direccionForm.get('order_id'); }
}