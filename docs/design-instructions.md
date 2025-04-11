# Instrucciones para aplicar el nuevo diseño a todas las páginas de administración

Este documento describe cómo implementar el nuevo diseño moderno con Bootstrap en todas las páginas de administración del sistema. El diseño sigue los mismos principios estéticos de la página principal (front-page).

## Estructura básica

Cada página de administración debe seguir esta estructura:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nombre de la Página | Areito Rides</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="../styles.css">
    <!-- Auth Script -->
    <script src="../front-page/auth.js"></script>
    <style>
        /* Copiar los estilos CSS aquí */
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 d-md-block sidebar collapse">
                <h5 class="text-white text-center mb-4">Areito Rides</h5>
                <nav class="nav-menu">
                    <ul class="nav flex-column">
                        <!-- Copiar los enlaces de navegación aquí, marcando como "active" el enlace de la página actual -->
                    </ul>
                </nav>
                <div class="logout-section">
                    <a href="#" class="logout-btn" id="logoutButton">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </a>
                </div>
            </div>

            <!-- Main content -->
            <div class="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                <div class="title-bar">
                    <h2 class="mb-0">Título de la Página</h2>
                    <button class="btn btn-primary action-button" data-bs-toggle="modal" data-bs-target="#addModal">
                        <i class="fas fa-plus"></i> Añadir Nuevo
                    </button>
                </div>

                <div class="card">
                    <div class="card-body">
                        <!-- Contenido específico de la página -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modales -->
    
    <!-- Bootstrap JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Event listener for the logout button
        document.getElementById('logoutButton').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
        
        // Código específico de la página
    </script>
</body>
</html>
```

## CSS a incluir en cada página

Copia estos estilos dentro de la etiqueta `<style>` de cada página:

```css
body {
    background-color: #f8f9fa;
}
.sidebar {
    min-height: 100vh;
    background-color: #343a40;
    padding-top: 20px;
}
.sidebar .nav-link {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 5px;
    border-radius: 4px;
    padding: 10px 15px;
}
.sidebar .nav-link:hover, .sidebar .nav-link.active {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
}
.sidebar .nav-link i {
    margin-right: 10px;
}
.main-content {
    padding: 20px;
}
.title-bar {
    background-color: white;
    padding: 15px 20px;
    margin-bottom: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card {
    margin-bottom: 20px;
    border: none;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.logout-section {
    padding: 0 15px;
    margin-top: 20px;
}
.logout-btn {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    width: 100%;
}
.logout-btn:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
}
.logout-btn i {
    margin-right: 10px;
}
.modal-form .form-label {
    font-weight: 500;
}
.action-button {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
}
.action-button i {
    margin-right: 5px;
    font-size: 0.875rem;
}
```

## Elementos del Menú de Navegación

Estos son los iconos sugeridos para cada elemento del menú:

- Inicio: `<i class="fas fa-home"></i>`
- Tipos de Vehículos: `<i class="fas fa-car-side"></i>`
- Marcas: `<i class="fas fa-tag"></i>`
- Modelos: `<i class="fas fa-car"></i>`
- Tipos de Combustible: `<i class="fas fa-gas-pump"></i>`
- Vehículos: `<i class="fas fa-car-alt"></i>`
- Clientes: `<i class="fas fa-users"></i>`
- Empleados: `<i class="fas fa-user-tie"></i>`
- Inspecciones: `<i class="fas fa-clipboard-check"></i>`
- Renta y Devolución: `<i class="fas fa-exchange-alt"></i>`
- Consultas: `<i class="fas fa-search"></i>`
- Reportes: `<i class="fas fa-chart-bar"></i>`

## Estructura correcta del botón de cerrar sesión

Asegúrate de colocar el botón de cerrar sesión fuera del elemento `<nav>` y dentro de un contenedor propio:

```html
<nav class="nav-menu">
    <ul class="nav flex-column">
        <!-- elementos de navegación -->
    </ul>
</nav>
<div class="logout-section">
    <a href="#" class="logout-btn" id="logoutButton">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
    </a>
</div>
```

## Botones de acción

Utiliza la clase `action-button` para los botones de acción principales, especialmente para los botones "Añadir" en la barra de título:

```html
<button class="btn btn-primary action-button" data-bs-toggle="modal" data-bs-target="#addModal">
    <i class="fas fa-plus"></i> Añadir Nuevo
</button>
```

## Elementos Bootstrap para utilizar

- **Tablas**: Usa `table table-hover` con `thead-light` para encabezados claros.
- **Botones**: Utiliza las clases de Bootstrap como `btn-primary`, `btn-danger`, etc.
- **Modales**: Para formularios de edición y creación.
- **Formularios**: Usa `form-control`, `form-label`, `form-select` para elementos de formulario.
- **Badges**: Para estados, con clases como `badge bg-success` (verde), `badge bg-danger` (rojo).

## Consideraciones específicas para distintos tipos de páginas

### Páginas con tablas de datos (Marcas, Modelos, etc.)
- Utiliza el componente de tabla responsive de Bootstrap
- Coloca los botones de acción a la derecha con `text-end`
- Usa iconos para botones de acción en lugar de solo texto

### Páginas con formularios complejos (Proceso de inspección, Renta)
- Divide los formularios en secciones usando tarjetas (`card`)
- Usa el sistema de columnas de Bootstrap para organizar los campos
- Considera usar pestañas (`nav-tabs`) para secciones de formularios largos

### Páginas de reportes y consultas
- Usa componentes de filtro con estilo coherente
- Considera usar componentes de fecha de Bootstrap
- Para gráficos, incluye contenedores con bordes suaves y sombreado 