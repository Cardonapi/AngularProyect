## 📋 Requisitos Previos

- Node.js (versión 14.x o superior)
- npm o yarn
- Git

## 🚀 Instalación

### 1. Instalar Angular CLI
````bash
npm i -g @angular/cli@14.2.12 --force
````

### 2. Clonar el repositorio
````bash
git clone https://github.com/Cardonapi/AngularProyect.git
cd AngularProyect
````

### 3. Instalar las dependencias
````bash
npm install --legacy-peer-deps
````

### 4. Configurar Variables de Entorno

⚠️ **IMPORTANTE**: Este proyecto usa Firebase compartido pero cada desarrollador debe tener su propia Gemini API Key.

#### Pasos:
1. **Copiar el archivo template:**
   - En Windows:
     ````bash
     cd src/environments
     copy environment.template.ts environment.ts
     ````
   - En Mac/Linux:
     ````bash
     cp src/environments/environment.template.ts src/environments/environment.ts
     ````

2. **Obtener tu Gemini API Key:**
   - Ve a: https://makersuite.google.com/app/apikey
   - Genera una nueva API Key
   - Cópiala

3. **Configurar tu API Key:**
   - Abre `src/environments/environment.ts`
   - Busca la línea: `geminiApiKey: 'TU_GEMINI_API_KEY_AQUI'`
   - Reemplaza `TU_GEMINI_API_KEY_AQUI` con tu API Key

4. **Firebase ya está configurado** ✅
   - El proyecto usa Firebase compartido
   - No necesitas crear tu propio proyecto Firebase
   - Las credenciales ya están en el archivo template

> **Nota:** El archivo `environment.ts` NO debe subirse a Git (está en `.gitignore`). Cada desarrollador mantiene su propia copia local con su API Key personal.

### 5. Ejecutar el proyecto
````bash
ng serve
````

La aplicación estará disponible en: `http://localhost:4200`

## 🔐 Autenticación

El proyecto incluye autenticación con Firebase usando:
- 🔵 Google OAuth
- 🐙 GitHub OAuth  
- 🪟 Microsoft OAuth

Las credenciales de Firebase ya están configuradas en el proyecto compartido.

## 📁 Estructura del Proyecto

````
src/
├── app/
│   ├── components/       # Componentes reutilizables
│   ├── pages/           # Páginas de la aplicación
│   ├── services/        # Servicios (Auth, Firebase, etc.)
│   ├── shared/          # Recursos compartidos
│   └── guards/          # Guards de autenticación
├── environments/
│   ├── environment.template.ts  # ✅ Plantilla (EN GIT)
│   └── environment.ts          # ❌ Tu configuración (NO EN GIT)
└── assets/              # Recursos estáticos
````

## 🛠️ Tecnologías Utilizadas

- Angular 14.2.12
- Firebase Authentication (compat 7.4.1)
- Bootstrap / Argon Design
- SweetAlert2
- Gemini AI (Chatbot)
- Leaflet (Mapas)

## ⚠️ Problemas Comunes

### "Cannot find module '@angular/fire'"
````bash
npm install @angular/fire@7.4.1 firebase@9.15.0 --legacy-peer-deps
````

### "Environment file not found"
Asegúrate de haber copiado `environment.template.ts` a `environment.ts` y configurado tu Gemini API Key.

### "Firebase authentication error"
Verifica que hayas copiado correctamente el archivo template sin modificar la configuración de Firebase.
