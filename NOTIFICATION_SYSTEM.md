# Sistema de Notificaciones 🔔

## Descripción General
Sistema completo de notificaciones con alertas visuales y sonoras para la aplicación Angular. Diseñado específicamente para notificar cuando se asignan nuevos pedidos a motociclistas, pero extensible a otros tipos de eventos.

---

## Componentes Principales

### 1. **NotificationService** (`src/app/shared/services/notification.service.ts`)

**Responsabilidades**:
- Gestionar el ciclo de vida de las notificaciones
- Reproducir audio cuando se crea una notificación
- Exponer métodos específicos para cada tipo de alerta
- Mantener un BehaviorSubject observable con el arreglo actual de notificaciones

**Métodos públicos**:

#### `showNotification(notification: Notification): void`
Muestra una notificación personalizada con todos los parámetros.

```typescript
this.notificationService.showNotification({
  id: 'custom-123',
  type: 'order',
  title: '🚚 Nuevo Pedido',
  message: 'Pedido #42 asignado a Carlos',
  duration: 8000,
  showSound: true
});
```

#### `orderAlert(title: string, message: string): void`
Atajo para crear una alerta de nuevo pedido (tipo 'order', 8s de duración, con sonido).

```typescript
this.notificationService.orderAlert('🚚 Nuevo Pedido', 'Pedido #42 asignado');
```

#### `success(title: string, message: string): void`
Alerta de éxito (tipo 'success', 5s, sin sonido).

```typescript
this.notificationService.success('✅ Éxito', 'Operación completada');
```

#### `error(title: string, message: string): void`
Alerta de error (tipo 'error', 6s, sin sonido).

```typescript
this.notificationService.error('❌ Error', 'No se pudo procesar la solicitud');
```

#### `warning(title: string, message: string): void`
Alerta de advertencia (tipo 'warning', 5s, sin sonido).

```typescript
this.notificationService.warning('⚠️ Advertencia', 'El archivo es muy grande');
```

#### `info(title: string, message: string): void`
Alerta informativa (tipo 'info', 5s, sin sonido).

```typescript
this.notificationService.info('ℹ️ Información', 'Cambios guardados automáticamente');
```

#### `removeNotification(id: string): void`
Elimina una notificación del arreglo.

```typescript
this.notificationService.removeNotification('notif-123');
```

#### `clearAll(): void`
Limpia todas las notificaciones activas.

```typescript
this.notificationService.clearAll();
```

**Interfaz `Notification`**:
```typescript
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'order';
  title: string;
  message: string;
  duration?: number;  // en ms, 0 = indefinida
  showSound?: boolean;
}
```

**Observable Público**:
```typescript
notifications$: BehaviorSubject<Notification[]>
```
Emite un arreglo con todas las notificaciones activas cada vez que cambian.

---

### 2. **NotificationToastComponent** (`src/app/components/notification-toast/`)

**Responsabilidades**:
- Mostrar una notificación individual con animaciones
- Mostrar ícono según el tipo
- Mostrar barra de progreso que decrece con el tiempo
- Permitir cerrar manualmente

**Inputs**:
- `type`: Tipo de notificación ('success', 'error', 'warning', 'info', 'order')
- `title`: Título de la notificación
- `message`: Mensaje a mostrar
- `duration`: Duración en ms

**Outputs**:
- `close`: Emite evento cuando se cierra la notificación

**Características**:
- ✅ Animación de entrada (slide-in desde la derecha, 300ms)
- ✅ Animación de salida (slide-out, al cerrar)
- ✅ Barra de progreso con animación de encogimiento
- ✅ Ícono específico por tipo:
  - success: `fas fa-check-circle` (✓)
  - error: `fas fa-exclamation-circle` (!)
  - warning: `fas fa-exclamation-triangle` (⚠)
  - info: `fas fa-info-circle` (ℹ)
  - order: `fas fa-shopping-cart` (🛒)
- ✅ Botón X para cerrar manualmente
- ✅ Colores distintos por tipo (púrpura para 'order')
- ✅ Responsive (se adapta a móvil)

**Estilos por tipo**:
```css
.notification-success  { border-left: 4px solid #2dce89; } /* Verde */
.notification-error    { border-left: 4px solid #f5365c; } /* Rojo */
.notification-warning  { border-left: 4px solid #fb6340; } /* Naranja */
.notification-info     { border-left: 4px solid #11cdef; } /* Azul */
.notification-order    { border-left: 4px solid #825ee4; } /* Púrpura */
```

---

### 3. **NotificationContainerComponent** (`src/app/components/notification-container/`)

**Responsabilidades**:
- Actuar como contenedor global para todas las notificaciones
- Iterar sobre el arreglo de notificaciones activas
- Pasar eventos de cierre al servicio
- Posicionarse en la esquina superior derecha de la pantalla

**Posicionamiento**:
```css
position: fixed;
top: 80px;
right: 20px;
z-index: 9999;
max-width: 500px;
```

En móvil (max-width: 640px):
```css
top: 70px;
right: 10px;
left: 10px;
```

**Integración**:
Agregado en `app.component.html` (fuera del router-outlet) para visibilidad global:
```html
<router-outlet></router-outlet>
<app-notification-container></app-notification-container>
```

---

## Integración en Módulos

### ComponentsModule (`src/app/components/components.module.ts`)
Ambos componentes están registrados:

```typescript
declarations: [
  // ... otros componentes
  NotificationToastComponent,
  NotificationContainerComponent
],
exports: [
  // ... otros componentes
  NotificationToastComponent,
  NotificationContainerComponent
]
```

### AppComponent (`src/app/app.component.html`)
Contenedor global:
```html
<router-outlet></router-outlet>
<app-notification-container></app-notification-container>
```

---

## Ejemplo de Uso: PedidoFormComponent

Se integró automáticamente en `src/app/modules/gestion/pedido-form/pedido-form.component.ts`:

Cuando un usuario **crea un nuevo pedido** (sin editar), se dispara automáticamente una notificación con:
- Título: "🚚 Nuevo Pedido Creado"
- Mensaje: Cantidad de items, nombre del cliente y moto asignada
- Sonido: ✓ Habilitado
- Duración: 8 segundos

```typescript
import { NotificationService } from '../../../shared/services/notification.service';

// ... en el constructor
constructor(
  private fb: FormBuilder,
  private orderService: OrderService,
  private customerService: ClienteService,
  private menuService: MenuService,
  private motorcycleService: MotorcycleService,
  private notificationService: NotificationService  // ← Inyectado
  private route: ActivatedRoute,
  private router: Router
) {}

// ... en onSubmit()
operation.subscribe({
  next: (response) => {
    this.loading = false;
    
    // 🔔 Si es un pedido NUEVO, mostrar notificación con sonido
    if (!this.isEdit) {
      const customerId = this.pedidoForm.get('customer_id')?.value;
      const quantity = this.pedidoForm.get('quantity')?.value;
      const motorcycleId = this.pedidoForm.get('motorcycle_id')?.value;
      
      const customerLabel = this.customerOptions.find(c => c.value === customerId)?.label;
      const motoInfo = motorcycleId 
        ? this.motorcycleOptions.find(m => m.value === motorcycleId)?.label
        : 'Sin asignar';
      
      this.notificationService.orderAlert(
        '🚚 Nuevo Pedido Creado',
        `${quantity} items | Cliente: ${customerLabel} | Moto: ${motoInfo}`
      );
    }
    
    alert(`Pedido ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
    this.router.navigate(['/gestion/pedidos']);
  }
});
```

**Flujo de usuario**:
1. Navega a `/gestion/pedidos`
2. Hace clic en **"+ Nuevo Pedido"**
3. Completa el formulario (cliente, menú, cantidad, moto opcional)
4. Hace clic en **"Guardar"**
5. ✨ **Automáticamente**: Aparece una notificación visual + sonido en la esquina superior derecha
6. Se redirige a la lista de pedidos actualizada

---

## Audio

El sistema reproduce automáticamente un sonido ubicado en:
```
src/assets/sounds/alert.mp3
```

**Características**:
- Se reproduce cuando `showSound: true` (por defecto en `orderAlert()`)
- Volumen configurado a máximo (1.0)
- Inicia desde el principio cada vez (currentTime = 0)
- Maneja excepciones si el audio está bloqueado por el navegador

---

## Flujo de Datos

```
┌─────────────────────┐
│  Componente (ej:    │
│ PedidosListComponent)
└──────────┬──────────┘
           │ llama
           ▼
┌─────────────────────────────────┐
│   NotificationService           │
│  - showNotification()           │
│  - orderAlert()                 │
│  - success(), error(), etc.     │
└──────┬──────────────────────────┘
       │ 1) Genera ID única
       │ 2) Agrega al arreglo
       │ 3) Emite notifications$
       │ 4) Reproduce audio
       │ 5) Programa auto-cierre
       ▼
┌─────────────────────────────────┐
│  NotificationContainerComponent │
│  - Suscrito a notifications$   │
│  - Renderiza *ngFor loop       │
└──────┬──────────────────────────┘
       │ para cada notificación
       ▼
┌──────────────────────────────────┐
│  NotificationToastComponent      │
│  - Recibe props (type, title...)│
│  - Anima entrada (slide-in)     │
│  - Muestra ícono y mensaje      │
│  - Barra de progreso decrece    │
│  - Auto-cierra al finalizarse   │
│  - Emite evento close           │
└──────┬───────────────────────────┘
       │ usuario hace clic en X
       │ o duration finaliza
       ▼
┌──────────────────────────────────┐
│  Contenedor recibe evento close  │
│  - Llama removeNotification()    │
│  - Service actualiza array      │
│  - Componente desaparece        │
└──────────────────────────────────┘
```

---

## Pruebas

### En el navegador:

1. **Abrir la página de Pedidos**:
   - Navega a `/gestion/pedidos`

2. **Crear un nuevo pedido**:
   - Haz clic en **"+ Nuevo Pedido"**
   - Completa el formulario:
     - Cliente: Selecciona cualquiera
     - Menú: Selecciona cualquiera
     - Cantidad: Por defecto 1
     - Moto (opcional): Puedes dejar sin asignar o seleccionar una
   - Haz clic en **"Guardar"**

3. **Resultado esperado**:
   - ✅ La notificación aparece automáticamente en la esquina superior derecha
   - ✅ Ícono de carrito de compra (🛒)
   - ✅ Fondo púrpura (#825ee4)
   - ✅ Sonido de alerta (`alert.mp3`) ¡Se escucha automáticamente!
   - ✅ Barra de progreso que decrece
   - ✅ Auto-cierra después de 8 segundos
   - ✅ Puedes cerrar manualmente con el botón X

### Pruebas adicionales:

Puedes crear notificaciones de otros tipos desde la consola del navegador:

```javascript
// En Chrome DevTools Console
// Obtener el servicio:
const injector = angular.element(document.body).injector();
const notifService = injector.get('NotificationService');

// O mejor aún, desde los componentes Angular inyecta el servicio

// Luego puedes llamar:
notifService.success('Éxito', 'Esta es una notificación de éxito');
notifService.error('Error', 'Algo salió mal');
notifService.warning('Cuidado', 'Ten cuidado con esto');
notifService.info('Info', 'Información importante');
notifService.orderAlert('Pedido', 'Nuevo pedido asignado');
```

---

## Próximas Mejoras (Opcionales)

1. **Persistencia**: Guardar notificaciones en localStorage
2. **Historial**: Agregar una página que muestre el historial de notificaciones
3. **Categorías**: Filtrar notificaciones por tipo
4. **Sonidos personalizados**: Diferentes audios por tipo
5. **Posiciones configurables**: Top-left, bottom-right, etc.
6. **WebSocket real-time**: Integrar con servidor para notificaciones en tiempo real
7. **Contador de no leídas**: Mostrar badge con número de notificaciones sin leer
8. **Temas oscuros**: Adaptar colores según tema activo

---

## Archivos Modificados

```
src/
├── app/
│   ├── app.component.html                    [MODIFICADO - agregó <app-notification-container>]
│   ├── components/
│   │   ├── components.module.ts              [MODIFICADO - registrados toast + container]
│   │   ├── notification-toast/
│   │   │   ├── notification-toast.component.ts       [CREADO]
│   │   │   └── notification-toast.component.css      [CREADO]
│   │   └── notification-container/
│   │       └── notification-container.component.ts   [CREADO]
│   ├── modules/
│   │   └── gestion/
│   │       ├── pedido-form/
│   │       │   └── pedido-form.component.ts          [MODIFICADO - agregó servicio + lógica de notificación]
│   │       └── pedidos-list/
│   │           ├── pedidos-list.component.ts         [LIMPIADO - removido método de ejemplo]
│   │           └── pedidos-list.component.html       [LIMPIADO - removido botón de notificación manual]
│   └── shared/
│       └── services/
│           └── notification.service.ts      [MODIFICADO - expandido con nuevos métodos]
├── assets/
│   └── sounds/
│       └── alert.mp3                        [EXISTENTE - usado por notificaciones]
```

---

## Conclusión

El sistema de notificaciones está completamente integrado, automatizado y funcional. 

**Lo mejor**: ¡Las notificaciones se disparan **automáticamente** cuando se crea un pedido nuevo, sin necesidad de clics adicionales!

### Ventajas de esta integración:

✅ **Automático**: Se dispara al crear pedidos, sin acciones adicionales  
✅ **Reactivo**: El sonido + visual alertan inmediatamente  
✅ **No invasivo**: Se cierra solo después de 8 segundos  
✅ **Flexible**: Puedes usar el servicio en cualquier componente  
✅ **Escalable**: Listo para agregar más tipos de eventos  

### Flujo simplificado:

```
Usuario crea pedido → Formulario guardado → ✨ Notificación automática
                                           → 🔊 Sonido de alerta
                                           → 📍 Esquina superior derecha
```

🎉 **¡Sistema completado, automatizado y probado!**
