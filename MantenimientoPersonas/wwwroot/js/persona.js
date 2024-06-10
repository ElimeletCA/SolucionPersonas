$(document).ready(function () {
    obtenerPersonas();
    const cargandobtn = document.getElementById('cargandobtn');
    $('head').append('<style>.error-text { display: none; }</style>');
    $('#cuerpoModalPrincipal').on('keypress', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
    //Restrinciones de los campos
    $('#txtnumerodocumento').inputmask('999-9999999-9');
    $('#cbtipodocumento').on('change', function () {
        var tipoDocumento = $(this).val();
        $('#txtnumerodocumento').inputmask(tipoDocumento === 'CÉDULA' ? '999-9999999-9' : 'AA9999999');
    });

    $('#txttelefono').inputmask('(999) 999-9999');
    $('#txtprimernombre, #txtsegundonombre, #txtprimerapellido, #txtsegundoapellido').inputmask({
        mask: '*{1,20}',
        definitions: {
            '*': {
                validator: "[a-zA-ZáéíóúÁÉÍÓÚüÜ]", 
                cardinality: 1
            }
        }
    });

    $.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Solo se permiten letras en este campo.");

    $('#cuerpoModalPrincipal').validate({
        rules: {
            cbtipodocumento: {
                required: true
            },
            txtnumerodocumento: {
                required: true
            },
            txtprimernombre: {
                required: true,
                lettersonly: true

            },
            txtprimerapellido: {
                required: true
            },
            cbtipotelefono: {
                required: true
            },
            txttelefono: {
                required: true
            },
            rbtngenero: {
                required: true
            }
        },
        messages: {
            cbtipodocumento: {
                required: "Por favor, seleccione el tipo de documento."
            },
            txtnumerodocumento: {
                required: "Por favor, introduzca el número de documento."
            },
            txtprimernombre: {
                required: "Por favor, introduzca el primer nombre."

            },
            txtprimerapellido: {
                required: "Por favor, introduzca el primer apellido."
            },
            cbtipotelefono: {
                required: "Por favor, seleccione el tipo de teléfono."
            },
            txttelefono: {
                required: "Por favor, introduzca el número de teléfono."
            },
            rbtngenero: {
                required: "Por favor, seleccione el género."
            }
        },
        errorPlacement: function (error, element) {
            error.addClass('mt-2 text-sm text-red-600 error-text');
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).addClass('border-red-500 text-red-900 bg-red-50');
        },
        unhighlight: function (element) {
            $(element).removeClass('border-red-500 text-red-900 bg-red-50');
        },
        success: function (label) {
            label.remove();
        }, submitHandler: function (form) {
            guardarPersona();
            return false;
        }

    });


});
function obtenerPersonas() {
    cargandobtn.click();
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

                    var nombreCompleto = persona.primer_nombre + ' ';
                    nombreCompleto += (persona.segundo_nombre != null) ? persona.segundo_nombre + ' ' : ' ';
                    nombreCompleto += persona.primer_apellido + ' ';
                    nombreCompleto += (persona.segundo_apellido != null) ? persona.segundo_apellido : ' ';

                    object += '<tr class="bg-white whitespace-nowrap border-b text-center font-bold border-b dark:bg-gray-800 dark:border-gray-700">';
                    object += '<td class="px-4 py-4">' + persona.numero_documento + '</td>';
                    object += '<td class="px-4 py-4">' + persona.primer_nombre + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += (persona.segundo_nombre != null) ? persona.segundo_nombre : '';
                    object += '</td>';
                    object += '<td class="px-4 py-4">' + persona.primer_apellido + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += (persona.segundo_apellido != null) ? persona.segundo_apellido : '';
                    object += '</td>';
                    object += '<td class="px-4 py-4">' + persona.genero + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += (persona.mayoria_edad == true) ? 'SI' : 'NO';
                    object += '</td>';
                    object += '<td class="px-4 py-4">' + persona.numero_telefono + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += '<button type="button" onclick="editarPersona(' + persona.persona_id + ')" class="border-b text-white bg-yellow-400 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"><svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 19"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/></button>&nbsp;';
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
    cargandobtn.click();
}
function agregarPersona() {
    $('#lblmodalprincipal').text('Agregar nueva persona');
    limpiarModal();
}
function guardarPersona() {
    if ($('#txtpersonaid').val() == '' || $('#txtpersonaid').val() == null) {
        advertenciaGuardar().then((confirmado) => {
            if (confirmado) {
                cargandobtn.click();
                //Agregar nueva persona
                var persona = new Object();
                persona.tipo_documento = $('#cbtipodocumento').val();
                persona.numero_documento = $('#txtnumerodocumento').val();
                persona.primer_nombre = $('#txtprimernombre').val().toUpperCase();
                persona.segundo_nombre = $('#txtsegundonombre').val().toUpperCase();
                persona.primer_apellido = $('#txtprimerapellido').val().toUpperCase();
                persona.segundo_apellido = $('#txtsegundoapellido').val().toUpperCase();
                persona.tipo_telefono = $('#cbtipotelefono').val();
                persona.numero_telefono = $('#txttelefono').val();
                persona.mayoria_edad = $('#ckmayoriaedad').prop('checked');
                persona.genero = $("input[name=rbtngenero]:checked").val();
                persona.estado_activo = true;

                $.ajax({
                    url: '/Persona/AgregarPersona',
                    type: 'POST',
                    data: persona,
                    success: function (response) {
                        if (response.message == 1) {
                            cargandobtn.click();
                            mostrarModalOperacion('exito');
                        } else {
                            cargandobtn.click();
                            mostrarModalOperacion('error');
                        }
                        obtenerPersonas();
                        limpiarModal();
                        $('#btncerrarmodalprincipal').trigger('click');
                    },
                    error: function () {
                    }
                });
            }
        });
        
    } else {
        advertenciaEditar().then((confirmado) => {
            if (confirmado) {
                cargandobtn.click();
                //Actualizar datos de persona
                var persona = new Object();
                persona.persona_id = $('#txtpersonaid').val();
                persona.tipo_documento = $('#cbtipodocumento').val();
                persona.numero_documento = $('#txtnumerodocumento').val();
                persona.primer_nombre = $('#txtprimernombre').val().toUpperCase();
                persona.segundo_nombre = $('#txtsegundonombre').val().toUpperCase();
                persona.primer_apellido = $('#txtprimerapellido').val().toUpperCase();
                persona.segundo_apellido = $('#txtsegundoapellido').val().toUpperCase();
                persona.tipo_telefono = $('#cbtipotelefono').val();
                persona.numero_telefono = $('#txttelefono').val();
                persona.mayoria_edad = $('#ckmayoriaedad').prop('checked');
                persona.genero = $("input[name=rbtngenero]:checked").val();
                persona.estado_activo = true;

                $.ajax({
                    url: '/Persona/ActualizarPersona',
                    type: 'PUT',
                    data: persona,
                    success: function (response) {
                        if (response.message == 1) {
                            cargandobtn.click();
                            mostrarModalOperacion('exito');
                        } else {
                            cargandobtn.click();
                            mostrarModalOperacion('error');
                        }
                        obtenerPersonas();
                        limpiarModal();
                        $('#btncerrarmodalprincipal').trigger('click');
                    },
                    error: function () {
                        cargandobtn.click();
                        errorbtn.click();
                    }
                });
            }
        });

        
    }
}
function advertenciaGuardar() {
    //Confirmacion de guardado espera que el usuario confirme o cancele
    return new Promise((resolve) => {
        $('#btnguardadomodal').trigger('click');
        $('#btnconfirmacionguardadomodal').one('click', function () {
            resolve(true);
        });
        $('#btncancelarguardadomodal').one('click', function () {
            resolve(false);
        });
        $('#btnguardadomodal').one('click', function () {
            resolve(false);
        });
    });
}
function advertenciaEditar() {
    //Confirmacion de edicion espera que el usuario confirme o cancele
    return new Promise((resolve) => {
        $('#btnedicionmodal').trigger('click');
        $('#btnconfirmacionedicionmodal').one('click', function () {
            resolve(true);
        });
        $('#btncancelaredicionmodal').one('click', function () {
            resolve(false);
        });
        $('#btnedicionmodal').one('click', function () {
            resolve(false);
        });
    });
}

function editarPersona(id) {
    //Colocar los datos de la persona en el modal
    cargandobtn.click();
    $.ajax({
        url: '/Persona/ObtenerPersonaPorId?id=' + id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (persona) {
            if (persona == null || persona == undefined || persona.length == 0) {

            } else {
                limpiarModal();
                $('#btncerrarmodalprincipal').trigger('click');
                $('#lblmodalprincipal').text('Editar persona');
                $('#txtpersonaid').val(persona.persona_id);
                $('#cbtipodocumento').val(persona.tipo_documento);
                $('#txtnumerodocumento').val(persona.numero_documento);
                $('#txtprimernombre').val(persona.primer_nombre);
                $('#txtsegundonombre').val(persona.segundo_nombre);
                $('#txtprimerapellido').val(persona.primer_apellido);
                $('#txtsegundoapellido').val(persona.segundo_apellido);
                $('#cbtipotelefono').val(persona.tipo_telefono);
                $('#txttelefono').val(persona.numero_telefono);
                $('#ckmayoriaedad').prop('checked', persona.mayoria_edad);
                $("input[name=rbtngenero][value='" + persona.genero + "']").prop('checked', true);
            }
        },
        error: function () {

        }
    });
    cargandobtn.click();
}
function eliminarPersona(id, nombreCompleto) {
    advertenciaEliminar(nombreCompleto).then((confirmado) => {
        if (confirmado) {
            cargandobtn.click();
            $.ajax({
                url: '/Persona/EliminarPersona?id=' + id,
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (response) {
                    if (response.message == 1) {
                        cargandobtn.click();
                        mostrarModalOperacion('exito');
                    } else {
                        cargandobtn.click();
                        mostrarModalOperacion('error');
                    }
                    obtenerPersonas();
                },
                error: function () {

                }
            });

        }
    });
}

function advertenciaEliminar(nombreCompleto) {
    //Confirmacion de eliminacion espera que el usuario confirme o cancele
    return new Promise((resolve) => {
        $('#btneliminarmodal').trigger('click');
        $('#lblnombrepersonaeliminar').text(nombreCompleto);
        $('#btnconfirmacioneliminarmodal').one('click', function () {
            resolve(true);
        });

        $('#btncancelareliminarmodal').one('click', function () {
            resolve(false);
        });
        $('#btneliminarmodal').one('click', function () {
            resolve(false);
        });
    });
}


function limpiarModal() {
    $('#txtpersonaid').val('');
    $('#cbtipodocumento').val('');
    $('#txtnumerodocumento').val('');
    $('#txtprimernombre').val('');
    $('#txtsegundonombre').val('');
    $('#txtprimerapellido').val('');
    $('#txtsegundoapellido').val('');
    $('#cbtipotelefono').val('');
    $('#txttelefono').val('');
    $('#ckmayoriaedad').prop('checked', false);
    $("input[name=rbtngenero][value='MASCULINO']").prop('checked', true);
}
function mostrarModalOperacion(nombremodal) {
    const modalbtn = document.getElementById(nombremodal + 'btn');
    modalbtn.click();
    const cerrarModalPromise = new Promise((resolve) => {
        $('#' + nombremodal +'aceptarbtn').on('click', function () {
            resolve('button');
        });

        setTimeout(() => {
            resolve('timeout');
        }, 3000);
    });
    cerrarModalPromise.then(() => {
        modalbtn.click();
    });
}