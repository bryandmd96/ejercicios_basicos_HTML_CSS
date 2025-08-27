document.addEventListener('DOMContentLoaded', () => {
  let productos = [];
  const carrito = [];

  const carouselItems = document.getElementById('carousel-items');
  const listaCarrito = document.getElementById('lista-carrito');
  const total = document.getElementById('total');
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const direccion = document.getElementById('direccion');
  const form = document.getElementById('pedidoForm');
  const mensajeExito = document.getElementById('mensaje-exito');
  const errores = {
    nombre: document.getElementById('error-nombre'),
    email: document.getElementById('error-email'),
    direccion: document.getElementById('error-direccion')
  };

  // Cargar productos y generar carrusel
  fetch('productos.json')
    .then(res => res.json())
    .then(data => {
      productos = data;
      data.forEach((prod, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
          <div class="card text-center p-3">
            <img src="${prod.imagen}" class="card-img-top mx-auto" style="max-height: 300px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${prod.nombre}</h5>
              <p class="card-text">${prod.descripcion}</p>
              <p class="card-text fw-bold">$${prod.precio}</p>
              <button class="btn btn-primary agregar" data-nombre="${prod.nombre}">Agregar al carrito</button>
            </div>
          </div>
        `;
        carouselItems.appendChild(item);
      });
    });

  // Movimiento automático cada 5 segundos
  let autoSlide = setInterval(() => {
    const carousel = new bootstrap.Carousel(document.getElementById('catalogo'));
    carousel.next();
  }, 5000);

  document.getElementById('catalogo').addEventListener('click', () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(() => {
      const carousel = new bootstrap.Carousel(document.getElementById('catalogo'));
      carousel.next();
    }, 5000);
  });

  // Agregar producto con cantidad
  function agregarProducto(nombre) {
    const existente = carrito.find(p => p.nombre === nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ nombre, cantidad: 1 });
    }
    actualizarCarrito();
    mostrarToast(`${nombre} agregado al carrito`);
  }

  // Delegación de eventos
  document.addEventListener('click', e => {
    if (e.target.classList.contains('agregar')) {
      const nombre = e.target.dataset.nombre;
      agregarProducto(nombre);
    }
  });

  // Mostrar carrito
  function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    carrito.forEach((item, i) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between fade-in';
      li.innerHTML = `
        ${item.nombre} x${item.cantidad}
        <button class="btn btn-sm btn-danger" data-index="${i}">Eliminar</button>
      `;
      listaCarrito.appendChild(li);
    });
    calcularTotal();
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Eliminar producto
  listaCarrito.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const index = e.target.dataset.index;
      carrito.splice(index, 1);
      actualizarCarrito();
    }
  });

  // Calcular total
  function calcularTotal() {
    let suma = 0;
    carrito.forEach(item => {
      const prod = productos.find(p => p.nombre === item.nombre);
      if (prod) suma += prod.precio * item.cantidad;
    });
    total.textContent = `Total: $${suma}`;
  }

  // Validación de campos
  function validarCampo(input, tipo) {
    const valor = input.value.trim();
    let valido = true;
    if (tipo === 'nombre') valido = valor.length >= 3;
    if (tipo === 'email') valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    if (tipo === 'direccion') valido = valor.length > 0;

    if (!valido) {
      input.classList.add('invalid');
      input.classList.remove('valid');
      errores[tipo].textContent = `Campo ${tipo} inválido`;
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
      errores[tipo].textContent = '';
    }
    return valido;
  }

  [nombre, email, direccion].forEach(input => {
    input.addEventListener('input', () => {
      validarCampo(input, input.id);
    });
  });

  // Enviar formulario
  form.addEventListener('submit', e => {
    e.preventDefault();
    const validNombre = validarCampo(nombre, 'nombre');
    const validEmail = validarCampo(email, 'email');
    const validDireccion = validarCampo(direccion, 'direccion');

    if (!validNombre || !validEmail || !validDireccion) return;
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    mensajeExito.textContent = 'Pedido enviado con éxito';
    mostrarToast('Pedido enviado con éxito');
    form.reset();
    carrito.length = 0;
    actualizarCarrito();
    [nombre, email, direccion].forEach(c => c.classList.remove('valid', 'invalid'));
  });

  // Escape: limpiar todo
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      form.reset();
      carrito.length = 0;
      actualizarCarrito();
      mensajeExito.textContent = '';
      [nombre, email, direccion].forEach(c => {
        c.classList.remove('valid', 'invalid');
        errores[c.id].textContent = '';
      });
    }
  });

  // Enter: intentar enviar
  [nombre, email, direccion].forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
    });
  });

  // beforeunload: advertencia
  window.addEventListener('beforeunload', e => {
    if (carrito.length > 0 || nombre.value || email.value || direccion.value) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  /* // Scroll final
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      alert('Has llegado al final. ¿Listo para comprar?');
    }
  }); */

  // Mensaje automático
  setTimeout(() => {
    alert('Agrega tus productos favoritos al carrito.');
  }, 5000);

  // Cargar carrito desde localStorage
  const guardado = localStorage.getItem('carrito');
  if (guardado) {
    carrito.splice(0, carrito.length, ...JSON.parse(guardado));
    actualizarCarrito();
  }
});

// Toast visual
function mostrarToast(mensaje) {
  const toast = document.createElement('div');
  toast.textContent = mensaje;
  toast.className = 'toast';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}