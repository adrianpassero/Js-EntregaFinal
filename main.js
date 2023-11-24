
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
            contenedorAlimento.innerHTML = `<div id=${alimento.id} class="card" style="width: 14rem;">
                <img src="${alimento.img}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${alimento.nombre}</h5>
                    <p class="card-text"> $ ${alimento.precio} </p>
                    <a href="#" class="btnComprar">Comprar</a>
                </div>
            </div>`;

            contenedorCards.appendChild(contenedorAlimento);

            const btnComprar = contenedorAlimento.querySelector(".btnComprar");
            btnComprar.addEventListener("click", () => agregarCarrito(alimento.id));
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
        contenedorProducto.innerHTML = `
            <p>${alimento.nombre} (x${cantidad})</p>
            <p> $ ${alimento.precio * cantidad}</p>
        `;
        contenedorCarrito.appendChild(contenedorProducto);

        totalCompra += alimento.precio * cantidad;
    });

    contenedorCarrito.innerHTML += `
        <li>
            <strong>Total:</strong> $ ${totalCompra.toFixed(3)}
        </li>
    `;
    contenedorCarrito.innerHTML += "</ul>";
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









