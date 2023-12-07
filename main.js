
let alimentos;
const contenedorCards = document.querySelector("#contenedorCards");
const contenedorCarrito = document.querySelector("#contenedorCarrito");
const carrito = [];

async function cargarAlimentosDesdeJSON() {
    try {
        const response = await fetch("./alimento.json");

        if (!response.ok) {
            throw new Error(`Error al cargar alimentos. Estado: ${response.status}`);
        }

        alimentos = await response.json();
        return alimentos;
    } catch (error) {
        throw new Error(`Error al cargar alimentos: ${error.message}`);
    }
}

async function main() {
    try {
        await cargarAlimentosDesdeJSON();

        alimentos.forEach((alimento) => {
            let contenedorAlimento = document.createElement("div");
            const precioFormateado = parseFloat(alimento.precio).toFixed(3);
            contenedorAlimento.innerHTML = `<div id=${alimento.id} class="card" style="width: 14rem;">
                <img src="${alimento.img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${alimento.nombre}</h5>
                    <p class="card-text"> $ ${precioFormateado}</p>
                    <a href="#" class="btnAgregar">Agregar</a>
                </div>
            </div>`;

            contenedorCards.appendChild(contenedorAlimento);

            const btnAgregar = contenedorAlimento.querySelector(".btnAgregar");
            btnAgregar.addEventListener("click", () => agregarCarrito(alimento.id));
        });

    } catch (error) {
        console.error(`Error al cargar alimentos desde el archivo JSON: ${error.message}`);
    }
}

function agregarCarrito(id) {
    const alimentoEncontrado = alimentos.find((alimento) => alimento.id === id);
    const itemExistente = carrito.find((item) => item.alimento.id === alimentoEncontrado.id);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({ alimento: alimentoEncontrado, cantidad: 1 });
    }

    mostrarCarrito();

    Swal.fire({
        icon: 'success',
        title: 'Producto agregado al carrito',
        text: `${alimentoEncontrado.nombre} ha sido añadido al carrito.`,
    });
}


function mostrarCarrito() {
    contenedorCarrito.innerHTML = "<ul>";
    let totalCompra = 0;

    carrito.forEach((item) => {
        const alimento = item.alimento;
        const cantidad = item.cantidad;

        let contenedorProducto = document.createElement("li");
        const precioFormateado = parseFloat(alimento.precio * cantidad).toFixed(3);
        contenedorProducto.innerHTML = `
            <p>${alimento.nombre} (x${cantidad})</p>
            <p> $ ${precioFormateado}</p>
            <button class="btnEliminar" onclick="eliminarProducto(${alimento.id})">Eliminar</button>
        `;
        contenedorCarrito.appendChild(contenedorProducto);

        totalCompra += parseFloat(precioFormateado);
    });

    contenedorCarrito.innerHTML += `
        <li>
            <strong>Total:</strong> $ ${totalCompra.toFixed(3)}
        </li>
    `;
    contenedorCarrito.innerHTML += "</ul>";
    if (carrito.length > 0) {
        document.getElementById("carritoLleno").style.display = "inline";
        document.getElementById("carritoVacio").style.display = "none";
    } else {
        document.getElementById("carritoLleno").style.display = "none";
        document.getElementById("carritoVacio").style.display = "inline";
    }
}


function eliminarProducto(id) {
    const index = carrito.findIndex((item) => item.alimento.id === id);

    if (index !== -1) {
        
        carrito.splice(index, 1);
        
        mostrarCarrito();
    }
}


function realizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agrega productos al carrito antes de realizar la compra.',
        });
        return;
    }

    let mensajeCompra = 'Productos comprados:\n';

    carrito.forEach((item) => {
        mensajeCompra += `${item.alimento.nombre} (x${item.cantidad}) - $${item.alimento.precio * item.cantidad}\n`;
    });

    Swal.fire({
        icon: 'success',
        title: 'Compra realizada con éxito',
        text: `Gracias por tu compra.\n\n${mensajeCompra}`,
    });

    carrito.length = 0;
    mostrarCarrito();
}



const form = document.getElementById("formulario");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    crearUsuario(e);
});

function crearUsuario(e) {
    let inputNombre = document.getElementById("nombre");
    let inputApellido = document.getElementById("apellido");
    let inputEmail = document.getElementById("email");

    const user = {
        nombre: inputNombre.value,
        edad: inputApellido.value,
        email: inputEmail.value,
    }

    localStorage.setItem("user", JSON.stringify(user));

    form.reset();
}

main();









