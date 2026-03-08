# 🍽️ Restaurant Admin

Sistema de administración completo para restaurantes construido con Astro, React, Tailwind CSS v4, Material UI y React Hook Forms.

## ✨ Características

- 🎨 **Diseño Moderno** - UI minimalista en blanco y negro con modo oscuro/claro
- 🔐 **Autenticación** - Sistema de login con rutas protegidas
- 📱 **Responsive** - Optimizado para todos los dispositivos
- ⚡ **Rendimiento** - Construido con Astro para carga ultra rápida
- 🎯 **TypeScript** - Totalmente tipado para mejor desarrollo
- 🧩 **Componentes Reutilizables** - Sistema de componentes consistente
- ⚙️ **Configuración Centralizada** - Todo configurable desde \`/src/config\`

## 🚀 Inicio Rápido

### Instalación

\`\`\`bash
npm install
\`\`\`

### Desarrollo

\`\`\`bash
npm run dev
\`\`\`

El servidor estará corriendo en \`http://localhost:4321\`

### Build para Producción

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 🔑 Credenciales de Acceso

**Usuario:** \`admin\`  
**Contraseña:** \`Admin123@\`

## 📁 Estructura del Proyecto

\`\`\`
restaurant-admin/
├── src/
│   ├── components/
│   │   ├── auth/              # Componentes de autenticación
│   │   ├── layout/            # Componentes de layout
│   │   └── ui/                # Componentes UI reutilizables
│   ├── config/                # ⚙️ CONFIGURACIÓN CENTRALIZADA
│   │   ├── app.config.ts      # Config general de la app
│   │   ├── theme.config.ts    # Config de temas y fuentes
│   │   └── navigation.config.ts # Config de navegación
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utilidades
│   ├── pages/                 # Páginas de Astro
│   └── styles/                # Estilos globales
\`\`\`

## 🎨 Personalización

### Cambiar Fuentes

Edita \`src/config/theme.config.ts\` para cambiar las fuentes de todo el sistema.

### Cambiar Colores

Edita \`src/styles/globals.css\` en la sección \`@theme\`.

### Agregar Nuevas Rutas

1. Crea la página en \`src/pages/admin/\`
2. Agrega la ruta en \`src/config/navigation.config.ts\`

## 🛠️ Stack Tecnológico

- **Framework:** Astro 5.x
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Component Library:** Material UI
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **TypeScript:** Full type safety

---

**Desarrollado con ❤️ para la administración de restaurantes**
