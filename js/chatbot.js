console.log("chatbot.js cargó ✅");


// =====================================================
// CREAR CHATBOT
// =====================================================

const chatbotHTML = `
    <!-- POPUP DE AYUDA -->
    <div id="helpPopup" class="help-popup">

        <button
            id="closeHelpPopup"
            class="help-popup-close"
            type="button"
            aria-label="Cerrar"
        >
            ×
        </button>

        <p>
            ¿Necesitas ayuda? 💕
        </p>

        <button
            id="openChatFromPopup"
            class="help-popup-button"
            type="button"
        >
            Chatea con nosotros
        </button>

    </div>


    <!-- BOTÓN FLOTANTE DEL CHAT -->
    <button
        id="chatbotButton"
        class="chatbot-button"
        type="button"
        aria-label="Abrir chat"
    >
        <i class="fa-regular fa-comment-dots"></i>
    </button>


    <!-- VENTANA DEL CHAT -->
    <div id="chatbotWindow" class="chatbot-window">

        <!-- HEADER -->
        <div class="chatbot-header">

            <div>
                <strong>Seduction Night</strong>
                <small>Asistente virtual</small>
            </div>

            <button
                id="closeChatbot"
                type="button"
                aria-label="Cerrar chat"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>


        <!-- MENSAJES -->
        <div
            id="chatbotMessages"
            class="chatbot-messages"
        >

            <div class="bot-message">
                Hola 💕 Bienvenida a Seduction Night.
                ¿En qué puedo ayudarte?
            </div>

        </div>


        <!-- OPCIONES RÁPIDAS -->
        <div class="chatbot-options">

            <button type="button" data-question="envios">
                Envíos
            </button>

            <button type="button" data-question="tallas">
                Tallas
            </button>

            <button type="button" data-question="pagos">
                Pagos
            </button>

            <button type="button" data-question="whatsapp">
                WhatsApp
            </button>

        </div>


        <!-- INPUT -->
        <form id="chatbotForm" class="chatbot-form">

            <input
                id="chatbotInput"
                type="text"
                placeholder="Escribe tu pregunta..."
                autocomplete="off"
            >

            <button type="submit">
                <i class="fa-solid fa-paper-plane"></i>
            </button>

        </form>

    </div>
`;


// Insertamos el chatbot en la página
document.body.insertAdjacentHTML(
    "beforeend",
    chatbotHTML
);


// =====================================================
// ELEMENTOS
// =====================================================

const helpPopup =
    document.getElementById("helpPopup");

const closeHelpPopup =
    document.getElementById("closeHelpPopup");

const openChatFromPopup =
    document.getElementById("openChatFromPopup");

const chatbotButton =
    document.getElementById("chatbotButton");

const chatbotWindow =
    document.getElementById("chatbotWindow");

const closeChatbot =
    document.getElementById("closeChatbot");

const chatbotForm =
    document.getElementById("chatbotForm");

const chatbotInput =
    document.getElementById("chatbotInput");

const chatbotMessages =
    document.getElementById("chatbotMessages");


// =====================================================
// POPUP AUTOMÁTICO
// =====================================================

// Aparece después de 4 segundos
setTimeout(() => {

    if (!chatbotWindow.classList.contains("show")) {
        helpPopup.classList.add("show");
    }

}, 4000);


// =====================================================
// ABRIR CHAT
// =====================================================

function openChat() {

    chatbotWindow.classList.add("show");

    helpPopup.classList.remove("show");

    chatbotInput.focus();
}


// Botón flotante
chatbotButton.addEventListener(
    "click",
    openChat
);


// Botón del popup
openChatFromPopup.addEventListener(
    "click",
    openChat
);


// =====================================================
// CERRAR
// =====================================================

closeChatbot.addEventListener(
    "click",
    () => {

        chatbotWindow.classList.remove("show");

    }
);


closeHelpPopup.addEventListener(
    "click",
    () => {

        helpPopup.classList.remove("show");

    }
);


// =====================================================
// NORMALIZAR TEXTO
// =====================================================

function normalizeText(text) {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// =====================================================
// AGREGAR MENSAJE
// =====================================================

function addMessage(text, type) {

    const message =
        document.createElement("div");

    message.classList.add(
        type === "user"
            ? "user-message"
            : "bot-message"
    );

    message.innerHTML = text;

    chatbotMessages.appendChild(message);

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;
}


// =====================================================
// RESPUESTAS DEL BOT
// =====================================================

function getBotResponse(question) {

    const text = normalizeText(question);


    // SALUDOS
    if (
        text.includes("hola") ||
        text.includes("buenos dias") ||
        text.includes("buenas tardes") ||
        text.includes("buenas noches")
    ) {

        return `
            ¡Hola! 💕 Bienvenida a Seduction Night.
            ¿En qué podemos ayudarte?
        `;
    }


    // ENVÍOS
    if (
        text.includes("envio") ||
        text.includes("entrega") ||
        text.includes("correos")
    ) {

        return `
            Realizamos envíos dentro y fuera del GAM 📦.
            Puedes consultar todos los detalles en
            <a href="envios-entregas.html">
                Envíos & Entregas
            </a>.
        `;
    }


    // TALLAS
    if (
        text.includes("talla") ||
        text.includes("size") ||
        text.includes("medida")
    ) {

        return `
            Las tallas disponibles aparecen en cada producto.
            Selecciona tu talla antes de agregar el producto
            al carrito 💕.
        `;
    }


    // PAGOS
    if (
        text.includes("pago") ||
        text.includes("pagar") ||
        text.includes("sinpe")
    ) {

        return `
            Para finalizar tu compra puedes enviar tu pedido
            desde el carrito y comunicarte con nosotros para
            coordinar el pago.
        `;
    }


    // DESCUENTOS
    if (
        text.includes("descuento") ||
        text.includes("oferta") ||
        text.includes("sale")
    ) {

        return `
            Tenemos productos y promociones especiales ✨.
            Puedes revisar la sección SALES para ver las
            ofertas disponibles.
        `;
    }


    // DEVOLUCIONES / GARANTÍA
    if (
        text.includes("devolucion") ||
        text.includes("garantia") ||
        text.includes("cambio")
    ) {

        return `
            Puedes consultar nuestras condiciones de cambios
            y garantía en
            <a href="garantias.html">
                Garantía
            </a>.
        `;
    }


    // WHATSAPP
    if (
        text.includes("whatsapp") ||
        text.includes("asesor") ||
        text.includes("persona") ||
        text.includes("hablar")
    ) {

        return `
            Claro 💕 Puedes hablar directamente con nosotros
            por
            <a
                href="https://wa.me/50672714390"
                target="_blank"
            >
                WhatsApp
            </a>.
        `;
    }


    // DEFAULT
    return `
        No estoy segura de esa consulta todavía 💕.
        Puedes preguntarme sobre
        <strong>envíos, tallas, pagos, descuentos,
        garantía o WhatsApp</strong>.
    `;
}


// =====================================================
// ENVIAR MENSAJE
// =====================================================

function sendQuestion(question) {

    if (!question.trim()) return;


    // Mensaje de la clienta
    addMessage(
        escapeHTML(question),
        "user"
    );


    // Pequeño delay para que parezca conversación
    setTimeout(() => {

        const response =
            getBotResponse(question);

        addMessage(
            response,
            "bot"
        );

    }, 500);
}


// =====================================================
// FORMULARIO
// =====================================================

chatbotForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const question =
            chatbotInput.value;

        if (!question.trim()) return;

        chatbotInput.value = "";

        sendQuestion(question);

    }
);


// =====================================================
// BOTONES RÁPIDOS
// =====================================================

document
    .querySelectorAll(".chatbot-options button")
    .forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const question =
                    button.dataset.question;

                sendQuestion(question);

            }
        );

    });


// =====================================================
// PROTEGER TEXTO
// =====================================================

function escapeHTML(text) {

    return text.replace(
        /[&<>"']/g,
        (character) => {

            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return characters[character];

        }
    );
}