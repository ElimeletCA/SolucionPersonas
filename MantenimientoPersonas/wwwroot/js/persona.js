$(document).ready(function () {
    ObtenerPersonas();
});
function ObtenerPersonas() {
    $.ajax({
        url: '/Persona/ObtenerPersonas',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            if (response == null || response == undefined || response.length == 0) {
                var object = '';
                object += '<tr class="bg-white whitespace-nowrap border-b text-center font-bold border-b dark:bg-gray-800 dark:border-gray-700">';
                object += '<td colspan="9">' + 'Personas no disponibles' + '</td>';
                object += '</tr>';

                $('#tblpersonasbody').html(object);

            } else {
                var object = '';
                $.each(response, function (index, persona) {
                    var nombreCompleto;
                    nombreCompleto += (persona.primer_nombre != null && persona.primer_nombre != '') ? persona.primer_nombre : nombreCompleto;
                    nombreCompleto += (persona.segundo_nombre != null && persona.segundo_nombre != '') ? persona.segundo_nombre : nombreCompleto;
                    nombreCompleto += (persona.primer_apellido != null && persona.primer_apellido != '') ? persona.primer_apellido : nombreCompleto;
                    nombreCompleto += (persona.segundo_apellido != null && persona.segundo_apellido != '') ? persona.segundo_apellido : nombreCompleto;
                    object += '<tr class="bg-white whitespace-nowrap border-b text-center font-bold border-b dark:bg-gray-800 dark:border-gray-700">';
                    object += '<td class="px-4 py-4">' + persona.numero_documento + '</td>';
                    object += '<td class="px-4 py-4">' + persona.primer_nombre + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += (persona.segundo_nombre != null && persona.segundo_nombre != '') ? persona.segundo_nombre : '';
                    object += '</td>';
                    object += '<td class="px-4 py-4">' + persona.primer_apellido + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += (persona.segundo_apellido != null && persona.segundo_apellido != '') ? persona.segundo_apellido : '';
                    object += '</td>';
                    object += '<td class="px-4 py-4">' + persona.genero + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += (persona.mayoria_edad == true) ? 'SI' : 'NO';
                    object += '</td>';
                    object += '<td class="px-4 py-4">' + persona.numero_telefono + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += '<button type="button" onclick="actualizarPersona(' + persona.persona_id + ')" class="border-b text-white bg-yellow-400 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"><svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 19"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/></button>&nbsp;';
                    object += '<button type="button" onclick="eliminarPersona(' + persona.persona_id + ',`' + nombreCompleto + '`)" class="border-b text-white bg-red-600 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" ><svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 19"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" /></svg><span class="sr-only">Icon description</span></button>&nbsp;';
                    object += '</td > ';
                    object += '</tr>';
                });
                $('#tblpersonasbody').html(object);
            }
        },
        error: function () {
        }
    });
}