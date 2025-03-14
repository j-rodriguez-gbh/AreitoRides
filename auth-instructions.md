# Instrucciones para implementar autenticación en todas las páginas de administración

Para hacer que todo el sistema de administración requiera inicio de sesión, sigue estos pasos para cada página en los siguientes directorios:
- Gestion/
- Proceso/
- Reporte/

## Modificaciones para cada página de administración

1. Añade la referencia al script de autenticación en la sección `<head>`:

```html
<head>
    <!-- Contenido existente -->
    <!-- Auth Script -->
    <script src="../front-page/auth.js"></script>
</head>
```

2. Si la página está en un subdirectorio más profundo, ajusta la ruta del script:

```html
<script src="../../front-page/auth.js"></script>
```

## Funcionamiento

- El script `auth.js` verificará automáticamente si el usuario está autenticado al cargar la página
- Si el usuario no está autenticado, será redirigido a la página principal
- Se agregará automáticamente un botón de "Cerrar Sesión" a la navegación
- El usuario puede iniciar sesión con:
  - Usuario: admin
  - Contraseña: admin

## Página principal

La página principal (front-page) es accesible sin autenticación y contiene el botón de inicio de sesión.

## Archivo index.html raíz

El archivo index.html en la raíz del proyecto redirige automáticamente al usuario a la página principal (front-page/index.html). 