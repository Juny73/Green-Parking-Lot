// Menú móvil
const boton = document.getElementById('menu-boton');
const nav = document.getElementById('menu');
if (boton && nav) {
  boton.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', abierto);
  });
}

// Placas siempre en mayúsculas
document.querySelectorAll('input[data-placa]').forEach((el) => {
  el.addEventListener('input', () => { el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
});

// Los mensajes se cierran solos
const aviso = document.querySelector('.aviso[data-auto]');
if (aviso) setTimeout(() => aviso.remove(), 6000);
