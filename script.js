/* ============================= */
/* PRECIOS */
/* ============================= */

const precios = {
    "Toffee": {
        12: 7900,
        20: 19300,
        26: 30900
    },
    "Lemon Pie": {
        12: 16100,
        20: 41000,
        26: 66400
    },
    "Carrot Cake": {
        12: 8300,
        20: 20500,
        26: 32700
    },
    "Marquise": {
        12: 16600,
        20: 43100,
        26: 69900
    },
    "Tarta de Frutillas": {
        12: 14700,
        20: 37600,
        26: 60800
    },
    "Cheesecake": {
        12: 22900,
        20: 60100,
        26: 97900
    }
};


/* ============================= */
/* VARIABLES */
/* ============================= */

let carrito = [];
let tartaSeleccionada = "";
let tipoEntrega = "local";


/* ============================= */
/* FORMATO DE DINERO */
/* ============================= */

function dinero(numero) {
    return "$" + Number(numero).toLocaleString("es-AR");
}


/* ============================= */
/* SELECTOR DE TARTA */
/* ============================= */

function mostrarOpciones(tarta) {

    tartaSeleccionada = tarta;

    document.getElementById("tituloSelector").textContent = tarta;

    document.getElementById("precio12").textContent =
        dinero(precios[tarta][12]);

    document.getElementById("precio20").textContent =
        dinero(precios[tarta][20]);

    document.getElementById("precio26").textContent =
        dinero(precios[tarta][26]);

    document
        .getElementById("selector")
        .classList.add("activo");
}


function cerrarSelector() {

    document
        .getElementById("selector")
        .classList.remove("activo");
}


/* ============================= */
/* AGREGAR AL CARRITO */
/* ============================= */

function agregarAlCarrito(diametro) {

    if (!tartaSeleccionada) {

        alert("Primero seleccioná una tarta.");

        return;
    }

    const precio = precios[tartaSeleccionada][diametro];

    carrito.push({

        id: Date.now() + Math.random(),

        tarta: tartaSeleccionada,

        diametro: diametro,

        precio: precio

    });

    cerrarSelector();

    actualizarCarrito();

    mostrarMensajeAgregado();
}


/* ============================= */
/* MENSAJE PRODUCTO AGREGADO */
/* ============================= */

function mostrarMensajeAgregado() {

    let mensaje =
        document.getElementById("mensajeAgregado");

    if (!mensaje) {

        mensaje = document.createElement("div");

        mensaje.id = "mensajeAgregado";

        mensaje.textContent =
            "Producto agregado al carrito";

        document.body.appendChild(mensaje);
    }

    mensaje.classList.add("mostrar");

    setTimeout(function() {

        mensaje.classList.remove("mostrar");

    }, 2500);
}


/* ============================= */
/* ACTUALIZAR CARRITO */
/* ============================= */

function actualizarCarrito() {

    const contenedor =
        document.getElementById("productosCarrito");

    const contador =
        document.getElementById("contador");

    const totalElemento =
        document.getElementById("total");

    const totalPedido =
        document.getElementById("totalPedido");

    let total = 0;

    contador.textContent = carrito.length;

    contenedor.innerHTML = "";


    if (carrito.length === 0) {

        contenedor.innerHTML =
            `<p class="vacio">
                Todavía no agregaste ninguna tarta.
            </p>`;

        totalElemento.textContent = "$0";

        if (totalPedido) {
            totalPedido.textContent = "$0";
        }

        return;
    }


    carrito.forEach(function(producto) {

        total += producto.precio;

        const elemento =
            document.createElement("div");

        elemento.className =
            "producto-carrito";

        elemento.innerHTML = `

            <div>

                <strong>
                    ${producto.tarta}
                </strong>

                <small>

                    Diámetro:
                    ${producto.diametro} cm

                    ·

                    ${dinero(producto.precio)}

                </small>

            </div>

            <button
                class="eliminar"
                onclick="eliminarProducto(${producto.id})"
            >
                ×
            </button>

        `;

        contenedor.appendChild(elemento);
    });


    totalElemento.textContent =
        dinero(total);

    if (totalPedido) {

        totalPedido.textContent =
            dinero(total);
    }
}


/* ============================= */
/* ELIMINAR PRODUCTO */
/* ============================= */

function eliminarProducto(id) {

    carrito = carrito.filter(function(producto) {

        return producto.id !== id;

    });

    actualizarCarrito();
}


/* ============================= */
/* ABRIR / CERRAR CARRITO */
/* ============================= */

function abrirCarrito() {

    actualizarCarrito();

    document
        .getElementById("carrito")
        .classList.add("activo");
}


function cerrarCarrito() {

    document
        .getElementById("carrito")
        .classList.remove("activo");
}


/* ============================= */
/* IR AL PEDIDO */
/* ============================= */

function irAlPedido() {

    if (carrito.length === 0) {

        alert(
            "Primero agregá al menos una tarta."
        );

        return;
    }

    cerrarCarrito();

    document
        .getElementById("pedido")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* ============================= */
/* TIPO DE ENTREGA */
/* ============================= */

function seleccionarEntrega(tipo, boton) {

    tipoEntrega = tipo;

    document
        .querySelectorAll(".tipo-entrega button")
        .forEach(function(btn) {

            btn.classList.remove(
                "entrega-activa"
            );

        });


    boton.classList.add(
        "entrega-activa"
    );


    const domicilio =
        document.getElementById(
            "datosDomicilio"
        );


    if (tipo === "domicilio") {

        domicilio.classList.remove(
            "oculto"
        );

    } else {

        domicilio.classList.add(
            "oculto"
        );
    }
}


/* ============================= */
/* FORMATO DE FECHA DD/MM */
/* ============================= */

const campoFecha =
    document.getElementById("fecha");


if (campoFecha) {

    campoFecha.addEventListener(
        "input",
        function() {

            let valor =
                campoFecha.value.replace(
                    /\D/g,
                    ""
                );

            if (valor.length > 4) {

                valor =
                    valor.substring(0, 4);
            }


            if (valor.length >= 3) {

                valor =
                    valor.substring(0, 2) +
                    "/" +
                    valor.substring(2);

            }


            campoFecha.value = valor;

        }
    );
}


/* ============================= */
/* VALIDAR FECHA DD/MM */
/* ============================= */

function validarFecha(fecha) {

    const formato =
        /^(\d{2})\/(\d{2})$/;

    const coincidencia =
        fecha.match(formato);


    if (!coincidencia) {

        return false;
    }


    const dia =
        Number(coincidencia[1]);

    const mes =
        Number(coincidencia[2]);


    if (mes < 1 || mes > 12) {

        return false;
    }


    const diasDelMes =
        new Date(
            new Date().getFullYear(),
            mes,
            0
        ).getDate();


    if (dia < 1 || dia > diasDelMes) {

        return false;
    }


    return true;
}


/* ============================= */
/* FORMULARIO DEL PEDIDO */
/* ============================= */

document
    .getElementById("formularioPedido")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* ------------------------- */
            /* VERIFICAR CARRITO */
            /* ------------------------- */

            if (carrito.length === 0) {

                alert(
                    "Agregá al menos una tarta antes de continuar."
                );

                return;
            }


            /* ------------------------- */
            /* DATOS PERSONALES */
            /* ------------------------- */

            const nombre =
                document
                    .getElementById("nombre")
                    .value
                    .trim();


            const telefono =
                document
                    .getElementById("telefono")
                    .value
                    .trim();


            const fecha =
                document
                    .getElementById("fecha")
                    .value
                    .trim();


            const hora =
                document
                    .getElementById("hora")
                    .value;


            /* ------------------------- */
            /* VALIDAR FECHA */
            /* ------------------------- */

            if (!validarFecha(fecha)) {

                alert(
                    "Ingresá una fecha válida con el formato DD/MM. Por ejemplo: 15/10."
                );

                document
                    .getElementById("fecha")
                    .focus();

                return;
            }


            /* ------------------------- */
            /* PRODUCTOS */
            /* ------------------------- */

            let total = 0;

            let productos = "";


            carrito.forEach(function(producto) {

                total += producto.precio;

                productos +=
                    `• ${producto.tarta} - ` +
                    `Diámetro: ${producto.diametro} cm - ` +
                    `${dinero(producto.precio)}\n`;

            });


            /* ------------------------- */
            /* RESUMEN */
            /* ------------------------- */

            let resumen =
                "PEDIDO - LA SABLÉE\n\n";


            resumen += productos;


            resumen +=
                `\nTOTAL: ${dinero(total)}\n\n`;


            resumen +=
                `Nombre: ${nombre}\n`;


            resumen +=
                `Contacto: ${telefono}\n`;


            resumen +=
                `Fecha de entrega: ${fecha}\n`;


            resumen +=
                `Horario: ${hora}\n`;


            /* ========================= */
            /* RETIRO EN LOCAL */
            /* ========================= */

            if (tipoEntrega === "local") {

                resumen +=
                    "Modalidad: Retiro en local\n";

            }


            /* ========================= */
            /* ENVÍO A DOMICILIO */
            /* ========================= */

            else {

                const calle =
                    document
                        .getElementById("calle")
                        .value
                        .trim();


                const numero =
                    document
                        .getElementById("numero")
                        .value
                        .trim();


                const barrio =
                    document
                        .getElementById("barrio")
                        .value
                        .trim();


                const ciudad =
                    document
                        .getElementById("ciudad")
                        .value
                        .trim();


                const referencia =
                    document
                        .getElementById("referencia")
                        .value
                        .trim();


                /* ------------------------- */
                /* VALIDAR DIRECCIÓN */
                /* ------------------------- */

                if (!calle) {

                    alert(
                        "Ingresá la calle."
                    );

                    return;
                }


                if (!numero) {

                    alert(
                        "Ingresá el número."
                    );

                    return;
                }


                if (!barrio) {

                    alert(
                        "Ingresá el barrio."
                    );

                    return;
                }


                if (!ciudad) {

                    alert(
                        "Ingresá la ciudad."
                    );

                    return;
                }


                /* ------------------------- */
                /* CREAR DIRECCIÓN COMPLETA */
                /* ------------------------- */

                let direccionCompleta =
                    `${calle} ${numero}, ${barrio}, ${ciudad}, Misiones, Argentina`;


                /* ------------------------- */
                /* CREAR ENLACE GOOGLE MAPS */
                /* ------------------------- */

                const enlaceGoogleMaps =
                    "https://www.google.com/maps/search/?api=1&query=" +
                    encodeURIComponent(direccionCompleta);


                /* ------------------------- */
                /* AGREGAR DIRECCIÓN */
                /* ------------------------- */

                resumen +=
                    "Modalidad: Envío a domicilio\n\n";


                resumen +=
                    `Calle: ${calle}\n`;


                resumen +=
                    `Número: ${numero}\n`;


                resumen +=
                    `Barrio: ${barrio}\n`;


                resumen +=
                    `Ciudad: ${ciudad}\n`;


                if (referencia) {

                    resumen +=
                        `Referencia: ${referencia}\n`;

                }


                if (
                    latitudSeleccionada !== null &&
                    longitudSeleccionada !== null
                ) {
                    const enlaceGoogleMaps =
                        `https://www.google.com/maps/search/?api=1&query=${latitudSeleccionada},${longitudSeleccionada}`;
                
                    resumen +=
                        `\n📍 Ubicación exacta en Google Maps:\n${enlaceGoogleMaps}\n`;
                } else {                    
                    resumen +=
                        `\n⚠️ El cliente no seleccionó una ubicación en el mapa.\n`;
                }
            }


            /* ========================= */
            /* WHATSAPP */
            /* ========================= */

            const numeroWhatsApp =
                "5493765107380";


            const urlWhatsApp =
                "https://wa.me/" +
                numeroWhatsApp +
                "?text=" +
                encodeURIComponent(resumen);


            window.open(
                urlWhatsApp,
                "_blank"
            );

        }
    );

    const botonVerMapa = document.getElementById("verMapa");

if (botonVerMapa) {
    botonVerMapa.addEventListener("click", function () {

        const calle = document.getElementById("calle").value.trim();
        const numero = document.getElementById("numero").value.trim();
        const barrio = document.getElementById("barrio").value.trim();
        const ciudad = document.getElementById("ciudad").value.trim();

        if (!calle || !numero || !ciudad) {
            alert("Completá Calle, Número y Ciudad antes de abrir Google Maps.");
            return;
        }

        const direccion =
            `${calle} ${numero}, ${barrio}, ${ciudad}, Misiones, Argentina`;

        const enlaceGoogleMaps =
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(direccion);

        window.open(enlaceGoogleMaps, "_blank");
    });
}

// =============================
// MAPA PARA SELECCIONAR UBICACIÓN
// =============================

let mapa = null;
let marcador = null;
let latitudSeleccionada = null;
let longitudSeleccionada = null;

const elementoMapa = document.getElementById("mapa");

if (elementoMapa) {

    // Posición inicial: Posadas, Misiones
    mapa = L.map("mapa").setView([-27.3671, -55.8961], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapa);

    // Cuando el cliente toca el mapa
    mapa.on("click", function(evento) {

        latitudSeleccionada = evento.latlng.lat;
        longitudSeleccionada = evento.latlng.lng;

        // Si ya existe un marcador, lo movemos
        if (marcador) {

            marcador.setLatLng([
                latitudSeleccionada,
                longitudSeleccionada
            ]);

        } else {

            marcador = L.marker([
                latitudSeleccionada,
                longitudSeleccionada
            ]).addTo(mapa);

        }

        marcador.bindPopup(
            "📍 Ubicación seleccionada"
        ).openPopup();

    });
}

// =============================
// ABRIR UBICACIÓN EN GOOGLE MAPS
// =============================

const botonVerMapaGoogle = document.getElementById("verMapaGoogle");

if (botonVerMapaGoogle) {

    botonVerMapaGoogle.addEventListener("click", function() {

        if (
            latitudSeleccionada === null ||
            longitudSeleccionada === null
        ) {
            alert("Primero seleccioná la ubicación en el mapa.");
            return;
        }

        const enlaceGoogleMaps =
            `https://www.google.com/maps/search/?api=1&query=${latitudSeleccionada},${longitudSeleccionada}`;

        window.open(enlaceGoogleMaps, "_blank");
    });
}

/* ============================= */
/* INICIAR CARRITO */
/* ============================= */

actualizarCarrito();
