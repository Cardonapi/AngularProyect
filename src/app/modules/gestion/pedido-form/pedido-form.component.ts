// src/app/modules/gestion/pedido-form/pedido-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../../shared/interfaces/order.interface';
import { OrderService } from '../../../shared/services/order.service';

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html'
})
export class PedidoFormComponent implements OnInit {
  pedidoForm: FormGroup;
  isEdit = false;
  pedidoId: number | null = null;
  loading = false;
  precioMenu: number = 0;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.pedidoForm = this.fb.group({
      customer_id: [null, [Validators.required, Validators.min(1)]],
      menu_id: [null, [Validators.required, Validators.min(1)]],
      motorcycle_id: [null],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total_price: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.pedidoId = +params['id'];
        this.loadPedido();
      }
    });

    // Escuchar cambios para calcular total
    this.pedidoForm.get('menu_id')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });

    this.pedidoForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });
  }

  loadPedido(): void {
    if (this.pedidoId) {
      this.orderService.getById(this.pedidoId).subscribe({
        next: (pedido) => {
          this.pedidoForm.patchValue(pedido);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al cargar el pedido');
        }
      });
    }
  }

  calcularTotal(): void {
    const menuId = this.pedidoForm.get('menu_id')?.value;
    const quantity = this.pedidoForm.get('quantity')?.value;

    if (menuId && quantity) {
      // Simular precio del menú (en producción, llamarías a un servicio)
      this.precioMenu = 15.99; // Precio simulado
      const total = this.precioMenu * quantity;
      this.pedidoForm.patchValue({ total_price: total });
    }
  }

  onSubmit(): void {
    if (this.pedidoForm.valid) {
      this.loading = true;
      const pedidoData = this.pedidoForm.value;

      const operation = this.isEdit && this.pedidoId
        ? this.orderService.update(this.pedidoId, pedidoData)
        : this.orderService.create(pedidoData);

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