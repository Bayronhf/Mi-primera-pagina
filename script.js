function scrollToClass(className) {
  const element = document.querySelector('.' + className);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

const color = document.getElementById('color');
const boton = document.getElementById("boton");

function colorExad() {
     let digitos = "0123456789abcdef";
     let color = "#";

     for (let i = 0; i < 6; i++) {
     let indiceal = Math.floor(Math.random() * 16);
     color += digitos[indiceal];
     }
   return color;
}

let contador = 0

boton.addEventListener("click", function() {
   if (contador < 4) {
    let coloral = colorExad();
      color.textContent = coloral;
      document.getElementById("contenedor").style.backgroundColor = coloral;
      contador++}
      else {
        boton.style.display = "none";
        color.style.display = "none";

         const mensaje = document.createElement("p");
        mensaje.textContent = "ya 🤙";
        mensaje.style.fontWeight = "bold";
        mensaje.style.fontSize = "1.5rem";
        mensaje.style.color = "white";
        document.getElementById("contenedor").appendChild(mensaje);
      }
 }
)



