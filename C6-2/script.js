const btn = document.querySelector('.j-btn-test');

btn.addEventListener('click', () => {
  alert(`Размеры экрана: ширина ${screen.width}px, высота ${screen.height}px`)
})