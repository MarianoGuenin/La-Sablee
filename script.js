/* =====================================================
   LA SABLÉE - JAVASCRIPT
===================================================== */


/* =====================================================
   PRECIOS DE LAS TARTAS
===================================================== */

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

    "Tarta de Zanahoria": {
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


/* =====================================================
   VARIABLES
===================================================== */

let carrito = [];

let tartaSeleccionada = "";

let tipoEntrega = "local";

let mapaGoogle = null;

let marcador = null;

let autocomplete = null;


/* =====================================================
   FORMATO DE PRECIOS
===================================================== */

function dinero(numero) {

    return "$" + Number(numero).toLocaleString("es-AR");

}


/* =====================================================
   ABRIR SELECTOR DE TAMAÑOS
===================================================== */

function mostrarOpciones(tarta) {

    tartaSeleccionada = tarta;

    document.getElementById("tituloSelector").textContent = tarta;

    document.getElementById("precio12").textContent =
        dinero(precios[tarta][12]);

    document.getElementById("precio20").textContent =
        dinero(precios[tarta][20]);

    document.getElementById("precio26").textContent =
        dinero(precios[tarta][26]);

    document.getElementById("selector").classList.add("activo");

}


/* =====================================================
   CERRAR SELECTOR
===================================================== */

function cerrarSelector() {

    document.getElementById("selector").classList.remove("activo");

}


/* =====================================================
   AGREGAR PRODUCTO AL CARRITO
===================================================== */

function agregarAlCarrito(diametro) {

    if (!tartaSeleccionada) {

        alert("Primero seleccioná una tarta.");

        return;
    }


    const precio =
        precios[tartaSeleccionada][diametro];


    carrito.push({

        id: Date.now() + Math.random(),

        tarta: tartaSeleccionada,

        diametro: diametro,

        precio: precio

    });


    cerrarSelector();

    actualizarCarrito();

}


/* =====================================================
   ACTUALIZAR CARRITO
===================================================== */

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


    /* SI EL CARRITO ESTÁ VACÍO */

    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <p class="vacio">
                Todavía no agregaste ninguna tarta.
            </p>
        `;

        totalElemento.textContent = "$0";

        if (totalPedido) {
            totalPedido.textContent = "$0";
        }

        return;
    }


    /* MOSTRAR PRODUCTOS */

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
                    Diámetro: ${producto.diametro} cm
                    · ${dinero(producto.precio)}
                </small>

            </div>

            <button
                class="eliminar"
                onclick="eliminarProducto(${producto.id})">

                ×

            </button>

        `;


        contenedor.appendChild(elemento);

    });


    /* MOSTRAR TOTAL */

    totalElemento.textContent =
        dinero(total);


    if (totalPedido) {

        totalPedido.textContent =
            dinero(total);

    }

}


/* =====================================================
   ELIMINAR PRODUCTO
===================================================== */

function eliminarProducto(id) {

    carrito =
        carrito.filter(function(producto) {

            return producto.id !== id;

        });


    actualizarCarrito();

}


/* =====================================================
   ABRIR CARRITO
===================================================== */

function abrirCarrito() {

    actualizarCarrito();

    document
        .getElementById("carrito")
        .classList.add("activo");

}


/* =====================================================
   CERRAR CARRITO
===================================================== */

function cerrarCarrito() {

    document
        .getElementById("carrito")
        .classList.remove("activo");

}


/* =====================================================
   IR AL FORMULARIO
===================================================== */

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


/* =====================================================
   SELECCIONAR RETIRO O DOMICILIO
===================================================== */

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


        if (mapaGoogle) {

            google.maps.event.trigger(
                mapaGoogle,
                "resize"
            );

        }

    } else {

        domicilio.classList.add(
            "oculto"
        );

    }

}


/* =====================================================
   GOOGLE MAPS
===================================================== */

/*
   Esta función es llamada por Google Maps
   cuando termina de cargar.
*/

function inicializarMapa() {

    const posicionInicial = {

        lat: -27.3671,

        lng: -55.8961

    };


    mapaGoogle =
        new google.maps.Map(

            document.getElementById("mapa"),

            {

                center: posicionInicial,

                zoom: 14,

                mapTypeControl: false,

                streetViewControl: false

            }

        );


    const input =
        document.getElementById(
            "direccion"
        );


    autocomplete =
        new google.maps.places.Autocomplete(

            input,

            {

                fields: [

                    "formatted_address",

                    "geometry",

                    "name"

                ],

                componentRestrictions: {

                    country: "ar"

                }

            }

        );


    autocomplete.addListener(

        "place_changed",

        seleccionarDireccion

    );

}


/* =====================================================
   SELECCIONAR DIRECCIÓN EN GOOGLE MAPS
===================================================== */

function seleccionarDireccion() {

    const lugar =
        autocomplete.getPlace();


    if (
        !lugar.geometry ||
        !lugar.geometry.location
    ) {

        alert(
            "Elegí una de las direcciones que aparecen debajo del campo."
        );

        return;

    }


    const ubicacion =
        lugar.geometry.location;


    mapaGoogle.setCenter(
        ubicacion
    );


    mapaGoogle.setZoom(
        17
    );


    /* ELIMINAR MARCADOR ANTERIOR */

    if (marcador) {

        marcador.setMap(null);

    }


    /* CREAR NUEVO MARCADOR */

    marcador =
        new google.maps.Marker({

            position: ubicacion,

            map: mapaGoogle,

            animation:
                google.maps.Animation.DROP

        });


    /* ESCRIBIR LA DIRECCIÓN */

    if (lugar.formatted_address) {

        document.getElementById(
            "direccion"
        ).value =
            lugar.formatted_address;

    }

}


/* =====================================================
   FORMULARIO
===================================================== */

document
    .getElementById("formularioPedido")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* COMPROBAR CARRITO */

            if (carrito.length === 0) {

                alert(
                    "Agregá al menos una tarta antes de continuar."
                );

                return;

            }


            /* DATOS DEL CLIENTE */

            const nombre =
                document.getElementById(
                    "nombre"
                ).value.trim();


            const telefono =
                document.getElementById(
                    "telefono"
                ).value.trim();


            const fecha =
                document.getElementById(
                    "fecha"
                ).value;


            const hora =
                document.getElementById(
                    "hora"
                ).value;


            /* TOTAL */

            let total = 0;


            /* PRODUCTOS */

            let productos = "";


            carrito.forEach(function(producto) {

                total += producto.precio;


                /*
                   IMPORTANTE:

                   Acá está corregido el error
                   que tenías.

                   Debe ser ${...}
                   SIN espacio entre $ y {
                */

                productos +=
                    `• ${producto.tarta} - ` +
                    `Diámetro: ${producto.diametro} cm - ` +
                    `${dinero(producto.precio)}\n`;

            });


            /* RESUMEN */

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
                `Fecha: ${fecha}\n`;


            resumen +=
                `Horario: ${hora}\n`;


            /* DOMICILIO */

            if (tipoEntrega === "domicilio") {

                const direccion =
                    document.getElementById(
                        "direccion"
                    ).value.trim();


                if (!direccion) {

                    alert(
                        "Seleccioná una dirección para el envío."
                    );

                    return;

                }


                resumen +=
                    `Dirección: ${direccion}\n`;


            } else {

                resumen +=
                    "Modalidad: Retiro en local\n";

            }


            /* =====================================
               WHATSAPP
            =====================================

               REEMPLAZAR:

               549XXXXXXXXXX

               por el número real de
               WhatsApp de La Sablée.

            ===================================== */

            const numeroWhatsApp =
                "5493765107380";


            const urlWhatsApp =
                "https://wa.me/" +
                numeroWhatsApp +
                "?text=" +
                encodeURIComponent(
                    resumen
                );


            /*
               POR AHORA:

               Abrimos WhatsApp.

               Después podemos conectar
               Mercado Pago directamente.
            */

            window.open(
                urlWhatsApp,
                "_blank"
            );

        }
    );


/* =====================================================
   INICIAR CARRITO
===================================================== */

actualizarCarrito();
