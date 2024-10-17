document.addEventListener("DOMContentLoaded", function() {
    const resultadoInput = document.getElementById("resultado");
    const operacionResultado = document.getElementById("operacion-resultado");
    const historialContainer = document.getElementById("historialContainer");
    const historial = [];
    let parentesisAbiertos = 0;
    historialContainer.style.display = "none";
    operacionResultado.style.display = "none";

    function agregarTexto(texto) {
        if (resultadoInput.textContent.length < 13) {
            resultadoInput.textContent += texto;
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Has alcanzado el máximo de carácteres",
                footer: '<a href="#">Lo siento</a>'
              });
        }
    }

    document.body.addEventListener("keydown", function(event) {
        const key = event.key;
        if (/[0-9+\-*/().]/.test(key)) {
            agregarTexto(key)
        }else if (key === "Enter") {
            calcularResultado();
            event.preventDefault();
        }else if (key === "Backspace") {
            resultadoInput.textContent = resultadoInput.textContent.slice(0, -1);
            operacionResultado.textContent = operacionResultado.textContent.slice(0, -1);
            event.preventDefault();
        }else {
            event.preventDefault();
        }
    });

    document.querySelectorAll(".numeros, .simbolos").forEach(boton => {
        boton.addEventListener("click", function() {
            const valor = boton.querySelector("span").textContent;
            if (valor === "=") {
                calcularResultado();
            } else if (valor === "C") {
                resultadoInput.textContent = "";
                operacionResultado.textContent = "";
                operacionResultado.style.display = "none";
                parentesisAbiertos = 0;
            } else if (valor === "+/-") {
                resultadoInput.textContent = resultadoInput.textContent.startsWith("-") ? 
                    resultadoInput.textContent.substring(1) : "-" + resultadoInput.textContent;
            } else if (valor === "÷") {
                agregarTexto("÷");
            } else if (valor === "x") {
                agregarTexto("x");
            } else if (valor === "()") {
                agregarParentesis();
            } else {
                agregarTexto(valor);
            }
        });
        
    });

    function agregarParentesis() {
        const textoActual = resultadoInput.textContent;
        const abiertos = (textoActual.match(/\(/g) || []).length;
        const cerrados = (textoActual.match(/\)/g) || []).length;

        if (abiertos > cerrados) {
            agregarTexto(")");
        } else {
            agregarTexto("(");
        }
    }

    function calcularResultado() {
        try {
            let operacion = resultadoInput.textContent;
            operacion = operacion.replace(/x/g, "*").replace(/÷/g, "/");
            const resultado = eval(operacion.replace(/,/g, "."));
            operacionResultado.textContent = operacion;
            resultadoInput.textContent = resultado;
            historial.push({ operacion, resultado });
            operacionResultado.style.display = "block";
            operacionResultado.style.display = "none";
        } catch (error) {
            resultadoInput.textContent = "Error";
        }
    }
    
    document.getElementById("historial").addEventListener("click", function() {
        if (historialContainer.style.display === "none") {
            historialContainer.style.display = "block";
            actualizarHistorial();
        } else {
            historialContainer.style.display = "none";
        }
    });
    
    document.getElementById("borrarUltimo").addEventListener("click", function() {
        resultadoInput.textContent = resultadoInput.textContent.slice(0, -1);
    });
    function actualizarHistorial() {
        historialContainer.innerHTML = historial.map(
            (item) => `<p>${item.operacion} = ${item.resultado}</p>`
        ).join("");
    }
});
