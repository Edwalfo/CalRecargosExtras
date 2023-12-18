console.log("funcionando");

// Obtener elementos del DOM
const formulario = document.querySelector('#formulario');
const resultadosDiv = document.querySelector('#resultados');

// Agregar evento de envío al formulario
formulario.addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar la recarga de la página por defecto

    // Obtener datos del formulario

    const fechaIngreso = formulario.querySelector('#fechaIngreso').value;
    const horaIngreso = formulario.querySelector('#horaIngreso').value;

    const fechaSalida = formulario.querySelector('#fechaSalida').value;
    const horaSalida = formulario.querySelector('#horaSalida').value;
    const salarioHora = formulario.querySelector('#salario').value;

   

    if (isNaN(salarioHora) || salarioHora <= 0) {
        alert("Por favor, ingrese un salario por hora válido.");
        return;
    }

    if (!fechaIngreso || !horaIngreso || !fechaSalida || !horaSalida) {
        alert("Por favor, complete todos los campos de fecha y hora.");
        return;
    }

    //Convertir fecha y hora a un objeto date
    const ingreso = new Date(`${fechaIngreso}T${horaIngreso}`);
    const salida = new Date(`${fechaSalida}T${horaSalida}`);

    if (ingreso >= salida) {
        alert("La fecha y hora de inicio deben ser menores que la fecha y hora de fin.");
        return;
    }



    // Realizar cálculos de horas extras y recargos


    const resultado = calcularRecargo(ingreso, salida,salarioHora);

    mostrarResultado(resultado);
});

function calcularRecargo(fechaInicio, fechaFin,salarioHora) {
    const inicioTrabajo = fechaInicio;
    const finTrabajo = fechaFin;
    const almuerzoInicio = new Date('2023-01-01T12:00:00');
    const almuerzoFin = new Date('2023-01-01T13:00:00');

    const diaSemana = inicioTrabajo.getDay();
    const salarioPorHora = salarioHora;

    let horasTrabajadas = 0;
    let horasExtrasDiurna = 0;
    let horasExtrasNocturna = 0;
    let recargo = 0;
    let horasNocturnas = 0;


    const diasFestivosColombia2023 = [
        new Date(2023, 0, 1),   // Año Nuevo
        new Date(2023, 0, 6),   // Día de los Reyes Magos
        new Date(2023, 2, 19),  // Día de San José
        new Date(2023, 3, 6),   // Jueves Santo
        new Date(2023, 3, 7),   // Viernes Santo
        new Date(2023, 3, 9),   // Domingo de Pascua
        new Date(2023, 4, 1),   // Día del Trabajo
        new Date(2023, 4, 25),  // Ascensión del Señor
        new Date(2023, 5, 15),  // Corpus Christi
        new Date(2023, 5, 23),  // Sagrado Corazón de Jesús
        new Date(2023, 7, 7),   // Batalla de Boyacá
        new Date(2023, 7, 15),  // Asunción de la Virgen María
        new Date(2023, 9, 12),  // Día de la Raza o Día de la Hispanidad
        new Date(2023, 10, 1),  // Día de Todos los Santos
        new Date(2023, 10, 11), // Independencia de Cartagena
        new Date(2023, 11, 8),  // Día de la Inmaculada Concepción
        new Date(2023, 11, 25)  // Navidad
    ];



    const esFestivo = diasFestivosColombia2023.some(festivo =>
        festivo.getFullYear() === inicioTrabajo.getFullYear() &&
        festivo.getMonth() === inicioTrabajo.getMonth() &&
        festivo.getDate() === inicioTrabajo.getDate());

    let fechaActual = new Date(inicioTrabajo);



    while (fechaActual <= finTrabajo) {


        const hora = fechaActual.getHours();


        // Verificar si es hora de almuerzo
        const esHoraAlmuerzo = hora >= almuerzoInicio.getHours() && hora < almuerzoFin.getHours();

        // Verificar si es horario nocturno (entre 21:00 y 06:00)
        const esHorarioNocturno = hora > 21 || hora < 7;

        // Resto del código para contar horas trabajadas, extras y nocturnas...
        if (!esHoraAlmuerzo) {
            horasTrabajadas++;

            // Verificar si es hora extra después de las 8 horas normales
            if (horasTrabajadas > 8) {
                if (esHorarioNocturno) {
                    horasNocturnas--;
                    horasExtrasNocturna++;

                } else {
                    horasExtrasDiurna++;

                }
            }

            // Verificar si es horario nocturno
            if (esHorarioNocturno) {
                horasNocturnas++;
            }
        }

        // Avanzar al siguiente hora
        fechaActual.setHours(fechaActual.getHours() + 1);
    }



    // Calcular el recargo dominical
    if (diaSemana === 0 || esFestivo) {
        recargo += horasTrabajadas * 0.75 * salarioPorHora; // Recargo del 75%
    }

    // Calcular el recargo por horas extras
    if (horasExtrasDiurna > 0) {
        recargo += (horasExtrasDiurna * 0.25 * salarioPorHora) + salarioPorHora * horasExtrasDiurna; // Recargo del 25%
    }


    if (horasExtrasNocturna > 0) {
        recargo += (horasExtrasNocturna * 0.75 * salarioPorHora) + salarioPorHora * horasExtrasNocturna; // Recargo del 75%
    }



    if (horasNocturnas > 0) {
        recargo += horasNocturnas * 0.35 * salarioPorHora; // Recargo del 35% por trabajo nocturno
    }


    return {
        horasTrabajadas: horasTrabajadas,
        horasExtrasDiurna: horasExtrasDiurna,
        horasExtrasNocturna: horasExtrasNocturna,
        horasNocturnas: horasNocturnas,
        esFestivo: esFestivo || diaSemana === 0,
        recargo: recargo
    };
}

function mostrarResultado(resultado) {
    // Mostrar resultados en el DOM (resultadosDiv.innerHTML = ...;)
    resultadosDiv.innerHTML = '';

    const recargoFormateado = resultado.recargo.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });

    // Crear elementos para mostrar los resultados
    const resultadoHTML = document.createElement('div');
    resultadoHTML.innerHTML = `
          <h3>Resultados</h3>
          <p>Horas trabajadas:<strong> ${resultado.horasTrabajadas}</strong></p>
          <p>Horas extras diurnas:<strong> ${resultado.horasExtrasDiurna}</strong></p>
          <p>Horas extras nocturnas: <strong>${resultado.horasExtrasNocturna}</strong></p>
          <p>Horas nocturnas:<strong> ${resultado.horasNocturnas}</strong></p>
          <p>Dominical o festivo:<strong> ${resultado.esFestivo? "Aplica" : "No aplica"}</strong></p>
          <p>Recargo total:<strong> ${recargoFormateado}</strong></p>
          
      `;

    // Agregar resultados al contenedor
    resultadosDiv.appendChild(resultadoHTML);
}