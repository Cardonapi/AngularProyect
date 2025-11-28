// src/app/modules/gestion/clientes-form/clientes-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../shared/interfaces/cliente.interface';
import { ClienteService } from '../../../shared/services/cliente.service';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html'
})
export class ClientesFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEdit = false;
  clienteId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clienteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]]
    
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.clienteId = +params['id'];
        this.loadCliente();
      }
    });
  }

  loadCliente(): void {
    if (this.clienteId) {
      this.clienteService.getById(this.clienteId).subscribe({
        next: (cliente) => {
          this.clienteForm.patchValue(cliente);
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al cargar el cliente');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.loading = true;
      const clienteData = this.clienteForm.value;

      const operation = this.isEdit && this.clienteId
        ? this.clienteService.update(this.clienteId, clienteData)
        : this.clienteService.create(clienteData);

      operation.subscribe({
        next: (response) => {
          this.loading = false;
          alert(`Cliente ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
          this.router.navigate(['/gestion/clientes']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error:', error);
          alert(`Error al ${this.isEdit ? 'actualizar' : 'crear'} el cliente`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/gestion/clientes']);
  }
}