$(function () {
    $('head').append('<style>.error-text { display: none; }</style>');
    $('#cuerpomodalprincipalpr').on('keypress', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
    $('#cbpais').select2();

    $('#cbprovincia').select2();

    $('#cbciudad').select2();
    //Restrinciones de los campos
    $('#txtnumerodocumentopr').inputmask('999-9999999-9');
    $('#cbtipodocumentopr').on('change', function () {
        var tipoDocumento = $(this).val();
        $('#txtnumerodocumentopr').inputmask(tipoDocumento === 'CÉDULA' ? '999-9999999-9' : 'AA9999999');
    });

    $('#txttelefonopr').inputmask('(999) 999-9999');
    $('#dpfechanacimientopr').inputmask('99/99/9999', {
        placeholder: 'DD/MM/YYYY',
        clearIncomplete: true
    });
    $('#txtprimernombrepr, #txtsegundonombrepr, #txtprimerapellidopr, #txtsegundoapellidopr').inputmask({
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

    $('#cuerpomodalprincipalpr').validate({
        rules: {
            cbtipodocumentopr: {
                required: true
            },
            txtnumerodocumentopr: {
                required: true
            },
            txtprimernombrepr: {
                required: true,
                lettersonly: true

            },
            txtprimerapellido: {
                required: true,
                lettersonly: true
            },
            cbtipotelefono: {
                required: true
            },
            cbciudad: {
                required: true
            },
            txttelefono: {
                required: true
            },
            dpfechanacimientopr: {
                required: true
            }
        },
        messages: {
            cbtipodocumentopr: {
                required: "Por favor, seleccione el tipo de documento."
            },
            txtnumerodocumentopr: {
                required: "Por favor, introduzca el número de documento."
            },
            txtprimernombrepr: {
                required: "Por favor, introduzca el primer nombre."

            },
            txtprimerapellidopr: {
                required: "Por favor, introduzca el primer apellido."
            },
            cbtipotelefonopr: {
                required: "Por favor, seleccione el tipo de teléfono."
            },
            txttelefonopr: {
                required: "Por favor, introduzca el número de teléfono."
            },
            cbciudad: {
                required: "Por favor, introduzca un pais, provincia y ciudad."
            },
            dpfechanacimientopr: {
                required: "Por favor, introduzca una fecha de nacimiento."
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
            guardarPersonaRelacionada();
            return false;
        }

    });

    obtenerPersonasRelacionadas();
    obtenerLocalidades();
    cargarEntidadesBancarias();
    cargarRoles();
});
function cargarEntidadesBancarias() {
    $.ajax({
        url: '/PersonaRelacionada/ObtenerEntidadesBancarias',
        method: 'GET',
        success: function (data) {
            var ul = $('#ulentidadbancaria');
            data.forEach(function (entidad) {
                var li = $('<li></li>');
                var div = $('<div></div>').addClass('flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600');
                var input = $('<input>')
                    .attr('id', 'rbtn' + entidad.nombre_entidad.toLowerCase().replace(/ /g, ''))
                    .attr('type', 'radio')
                    .attr('value', entidad.entidad_bancaria_id)
                    .attr('name', 'rbtnentidadbancaria')
                    .addClass('w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500');
                var label = $('<label></label>')
                    .attr('for', 'rbtn' + entidad.nombre_entidad.toLowerCase().replace(/ /g, ''))
                    .addClass('text-left w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300')
                    .text(entidad.nombre_entidad);
                div.append(input).append(label);
                li.append(div);
                ul.append(li);
            });

            // Add event listener for radio button change
            /*$('input[name="rbtnentidadbancaria"]').on('change', function () {
                var selectedId = $('input[name="rbtnentidadbancaria"]:checked').val();
                console.log('Selected Entity ID:', selectedId);
                // You can perform other actions here with the selectedId
            });*/
        }
    });
}
function obtenerLocalidades() {
    $.ajax({
        url: '/PersonaRelacionada/ObtenerLocalidades',
        method: 'GET',
        success: function (data) {
            cargarComboboxes(data);
        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}
function cargarComboboxes(contenidocombos) {

    var cbpais = document.getElementById("cbpais");
    var cbprovincia = document.getElementById("cbprovincia");
    var cbciudad = document.getElementById("cbciudad");
    for (var x in contenidocombos) {
        cbpais.options[cbpais.options.length] = new Option(x, x);
    }
    cbpais.onchange = function () {
        //empty Chapters- and Topics- dropdowns
        cbciudad.length = 1;
        cbprovincia.length = 1;
        //display correct values
        for (var y in contenidocombos[this.value]) {
            cbprovincia.options[cbprovincia.options.length] = new Option(y, y);
        }
    }
    cbprovincia.onchange = function () {
        //empty Chapters dropdown
        cbciudad.length = 1;
        //display correct values
        var z = contenidocombos[cbpais.value][this.value];
        for (var i = 0; i < z.length; i++) {
            cbciudad.options[cbciudad.options.length] = new Option(z[i], z[i]);
        }
    }
    /*$('#cbciudad').on('select2:select', function (e) {
        $('#txtciudad').val($("#select2-cbciudad-container").text());

    });*/
    limpiarModalPr();
}
function cargarRoles() {
    $.get('/PersonaRelacionada/ObtenerRoles', function (roles) {
        var listaRoles = $('#listaRoles');
        listaRoles.empty();
        $.each(roles, function (index, rol) {
            var li = $('<li>').addClass('w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600');
            var div = $('<div>').addClass('flex items-center ps-3');

            var checkbox = $('<input>')
                .attr('type', 'checkbox')
                .attr('id', 'ck' + rol.nombre_rol.toLowerCase().replace(/\s+/g, ''))
                .attr('name', 'rolesSeleccionados[]') // Agregar el atributo name aquí
                .val(rol.rol_id)
                .addClass('w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500');

            var label = $('<label>')
                .attr('for', 'ck' + rol.nombre_rol.toLowerCase().replace(/\s+/g, ''))
                .addClass('text-left w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300')
                .text(rol.nombre_rol);

            div.append(checkbox);
            div.append(label);
            li.append(div);
            listaRoles.append(li);
        });
    });
}
function agregarPersonaRelacionada()
{
    showHideModal('modalprincipalpr', 'show');
    $('#lblmodalprincipalpr').text('Agregar nueva persona relacionada');
    limpiarModalPr();
}
function filtrarlista(idinput, idul) {
    // Declare variables
    var input, filter, ul, li, label, i, txtValue;
    input = document.getElementById(idinput);
    filter = input.value.toUpperCase();
    ul = document.getElementById(idul);
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        label = li[i].getElementsByTagName("label")[0];
        txtValue = label.textContent || label.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
function obtenerPersonasRelacionadas() {
    showHideModal('cargando-modal', 'show');
    $.ajax({
        url: '/PersonaRelacionada/ObtenerPersonasRelacionadas',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (response) {
            if (response == null || response == undefined || response.length == 0) {
                var object = '';
                object += '<tr class="bg-white whitespace-nowrap border-b text-center font-bold border-b dark:bg-gray-800 dark:border-gray-700">';
                object += '<td colspan="9">' + 'Personas relacionadas no disponibles' + '</td>';
                object += '</tr>';

                $('#tblpersonasrbody').html(object);

            } else {
                var object = '';
                $.each(response, function (index, personar) {

                    var nombreCompleto = personar.primer_nombre + ' ';
                    nombreCompleto += (personar.segundo_nombre != null) ? personar.segundo_nombre + ' ' : ' ';
                    nombreCompleto += personar.primer_apellido + ' ';
                    nombreCompleto += (personar.segundo_apellido != null) ? personar.segundo_apellido : ' ';

                    var rolesNombres = personar.roles.map(function (rol) {
                        return rol.nombre_rol;
                    }).join('<br/>');
                    object += '<tr class="bg-white whitespace-nowrap border-b text-center font-bold border-b dark:bg-gray-800 dark:border-gray-700">';
                    object += '<td class="px-4 py-4">' + personar.numero_documento + '</td>';
                    object += '<td class="px-4 py-4">' + personar.primer_nombre + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += (personar.segundo_nombre != null) ? personar.segundo_nombre : '';
                    object += '</td>';
                    object += '<td class="px-4 py-4">' + personar.primer_apellido + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += (personar.segundo_apellido != null) ? personar.segundo_apellido : '';
                    object += '</td>';
                    object += '<td class="px-4 py-4">' + moment(personar.fecha_nacimiento).format('DD/MM/YYYY') + '</td>';
                    object += '<td class="px-4 py-4">' + rolesNombres + '</td>';
                    object += '<td class="px-4 py-4">' + personar.correo_electronico + '</td>';
                    object += '<td class="px-4 py-4">' + personar.numero_telefono_principal + '</td>';
                    object += '<td class="px-4 py-4">' + personar.tipo_pago + '</td>';
                    object += '<td class="px-4 py-4">' + personar.numero_cuenta + '</td>';
                    object += '<td class="px-4 py-4">' + personar.nombre_entidad_bancaria + '</td>';
                    object += '<td class="px-4 py-4">' + personar.nombre_pais + '</td>';
                    object += '<td class="px-4 py-4">' + personar.nombre_provincia + '</td>';
                    object += '<td class="px-4 py-4">' + personar.nombre_ciudad + '</td>';
                    object += '<td class="px-4 py-4">';
                    object += '<button type="button" onclick="editarPersonaRelacionada(' + personar.persona_relacionada_id + ')" class="border-b text-white bg-yellow-400 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"><svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 19"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/></button>&nbsp;';
                    object += '<button type="button" onclick="eliminarPersonaRelacionada(' + personar.persona_relacionada_id + ',`' + nombreCompleto + '`)" class="border-b text-white bg-red-600 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" ><svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 19"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" /></svg><span class="sr-only">Icon description</span></button>&nbsp;';
                    object += '</td > ';
                    object += '</tr>';
                });
                $('#tblpersonasrbody').html(object);
            }
        },
        error: function () {
        }
    });
    showHideModal('cargando-modal', 'hide');

}
function limpiarModalPr() {
    $('#txtpersonarid').val('');
    $('#cbtipodocumentopr').val('');
    $('#txtnumerodocumentopr').val('');
    $('#txtprimernombrepr').val('');
    $('#txtsegundonombrepr').val('');
    $('#txtprimerapellidopr').val('');
    $('#txtsegundoapellidopr').val('');
    $('#dpfechanacimientopr').val('');
    $('#ckpropietario').prop('checked', false);
    $('#ckadministrador').prop('checked', false);
    $('#ckencargadope').prop('checked', false);
    $('#ckvendedor').prop('checked', false);
    $('#cksuplidor').prop('checked', false);
    $('#ckbeneficiario').prop('checked', false);
    $('#txtemailpr').val('');
    $('#cbtipotelefonopr').val('');
    $('#txttelefonopr').val('');
    $('input[name="rbtntipopago"]').prop('checked', false);
    $('#txtnumerocuentapr').val('');
    $('input[name="rbtnentidadbancaria"]').prop('checked', false);
    $("#cbpais").val([]).trigger('change');

    //$("input[name=rbtngenero][value='MASCULINO']").prop('checked', true);
}
function obtenerIdCiudad(name) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'PersonaRelacionada/ObtenerCiudades',
            method: 'GET',
            success: function (data) {
                var city = data.find(function (city) {
                    return city.nombre_ciudad.toLowerCase() === name.toLowerCase();
                });
                if (city) {
                    resolve(city.ciudad_id);
                } else {
                    resolve(null);
                }
            },
            error: function () {
                reject();
            }
        });
    });

}
function obtenerRolesSeleccionados() {
    var rolesSeleccionados = [];
    $('input[name="rolesSeleccionados[]"]:checked').each(function () {
        rolesSeleccionados.push($(this).val());
    });
    return rolesSeleccionados;
}
function marcarRolesSeleccionados(roles) {
    $('input[name="rolesSeleccionados[]"]').prop('checked', false);

    roles.forEach(function (rol) {
        $('input[name="rolesSeleccionados[]"][value="' + rol + '"]').prop('checked', true);
    });
}
function guardarPersonaRelacionada() {

    if ($('#txtpersonarid').val() == '' || $('#txtpersonarid').val() == null) {
        advertenciaGuardar().then((confirmado) => {
            if (confirmado) {
                showHideModal('cargando-modal', 'show');
                //Agregar nueva persona relacionada
                var personar = new Object();
                personar.tipo_documento = $('#cbtipodocumentopr').val().toUpperCase();
                personar.numero_documento = $('#txtnumerodocumentopr').val().toUpperCase();
                personar.primer_nombre = $('#txtprimernombrepr').val().toUpperCase();
                personar.segundo_nombre = $('#txtsegundonombrepr').val().toUpperCase();
                personar.primer_apellido = $('#txtprimerapellidopr').val().toUpperCase();
                personar.segundo_apellido = $('#txtsegundoapellidopr').val().toUpperCase();
                personar.fecha_nacimiento = moment($('#dpfechanacimientopr').val(), 'DD/MM/YYYY').format('MM/DD/YYYY');
                personar.correo_electronico = $('#txtemailpr').val();
                personar.tipo_telefono_principal = $('#cbtipotelefonopr').val();
                personar.numero_telefono_principal = $('#txttelefonopr').val();
                personar.numero_cuenta = $('#txtnumerocuentapr').val();
                personar.tipo_pago = $("input[name=rbtntipopago]:checked").val();
                personar.entidad_bancaria_id = $("input[name=rbtnentidadbancaria]:checked").val();
                personar.roles_id = obtenerRolesSeleccionados();
                personar.estado_activo = true;
                //personar.mayoria_edad = $('#ckmayoriaedad').prop('checked');
                //personar.tipo_pago = $("input[name=rbtngenero]:checked").val();

                $.ajax({
                    url: '/PersonaRelacionada/ObtenerPersonaRelacionadaPorNumeroDocumento?ndocumento=' + personar.numero_documento,
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    success: function (response) {
                        if (response.message == 1) {
                            showHideModal('cargando-modal', 'hide');

                            mostrarModalOperacionPr('advertencia-modal');

                        } else {
                            obtenerIdCiudad($("#select2-cbciudad-container").text()).then((ciudadId) => {
                                personar.ciudad_id = ciudadId;
                                $.ajax({
                                    url: '/PersonaRelacionada/AgregarPersonaRelacionada',
                                    type: 'POST',
                                    data: personar,
                                    success: function (response) {
                                        showHideModal('cargando-modal', 'hide');
                                        if (response.message == 1) {
                                            mostrarModalOperacionPr('exito-modal');
                                        } else {
                                            mostrarModalOperacionPr('error-modal');
                                        }
                                        obtenerPersonasRelacionadas();
                                        limpiarModalPr();
                                        showHideModal('modalprincipalpr', 'hide');
                                    },
                                    error: function () {
                                        showHideModal('cargando-modal', 'hide');
                                        mostrarModalOperacionPr('error-modal');
                                    }
                                });
                            }).catch((error) => {

                            });
                        }
                    }
                });

            }
        });

    } else {
        advertenciaEditar().then((confirmado) => {
            if (confirmado) {
                showHideModal('cargando-modal', 'show');
                //Actualizar datos de persona
                var personar = new Object();
                personar.persona_relacionada_id = $('#txtpersonarid').val();
                personar.tipo_documento = $('#cbtipodocumentopr').val().toUpperCase();
                personar.numero_documento = $('#txtnumerodocumentopr').val().toUpperCase();
                personar.primer_nombre = $('#txtprimernombrepr').val().toUpperCase();
                personar.segundo_nombre = $('#txtsegundonombrepr').val().toUpperCase();
                personar.primer_apellido = $('#txtprimerapellidopr').val().toUpperCase();
                personar.segundo_apellido = $('#txtsegundoapellidopr').val().toUpperCase();
                personar.fecha_nacimiento = moment($('#dpfechanacimientopr').val(), 'DD/MM/YYYY').format('MM/DD/YYYY');
                personar.correo_electronico = $('#txtemailpr').val();
                personar.tipo_telefono_principal = $('#cbtipotelefonopr').val();
                personar.numero_telefono_principal = $('#txttelefonopr').val();
                personar.numero_cuenta = $('#txtnumerocuentapr').val();
                personar.tipo_pago = $("input[name=rbtntipopago]:checked").val();
                personar.entidad_bancaria_id = $("input[name=rbtnentidadbancaria]:checked").val();
                personar.roles_id = obtenerRolesSeleccionados();
                personar.estado_activo = true;
                obtenerIdCiudad($("#cbciudad").val()).then((ciudadId) => {
                    personar.ciudad_id = ciudadId;
                    $.ajax({
                        url: '/PersonaRelacionada/ActualizarPersonaRelacionada',
                        type: 'PUT',
                        data: personar,
                        success: function (response) {
                            showHideModal('cargando-modal', 'hide');
                            if (response.message == 1) {
                                mostrarModalOperacionPr('exito-modal');
                            } else {
                                mostrarModalOperacionPr('error-modal');
                            }
                            obtenerPersonasRelacionadas();
                            limpiarModalPr();
                            showHideModal('modalprincipalpr', 'hide');
                        },
                        error: function () {
                            //cargandobtn.click();
                            //mostrarModalOperacion('error');
                        }
                    });
                }).catch((error) => {
   
                });
            }
        });


    }
}
function advertenciaGuardar() {
    //Confirmacion de guardado espera que el usuario confirme o cancele
    return new Promise((resolve) => {
        showHideModal('guardadomodal', 'show');
        $('#btnconfirmacionguardadomodal').one('click', function () {
            resolve(true);
            showHideModal('guardadomodal', 'hide');

        });
        $('#btncancelarguardadomodal').one('click', function () {
            resolve(false);
        });
        $('#btnguardadomodal').one('click', function () {
            resolve(false);
        });
    });
}
function editarPersonaRelacionada(id) {
    //Colocar los datos de la persona en el modal
    $.ajax({
        url: '/PersonaRelacionada/ObtenerPersonaRelacionadaPorId?id=' + id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (personarelacionada) {
            if (personarelacionada == null || personarelacionada == undefined || personarelacionada.length == 0) {

            } else {
                limpiarModalPr();
                showHideModal('modalprincipalpr', 'show');
                $('#lblmodalprincipalpr').text('Editar persona relacionada');
                $('#txtpersonarid').val(personarelacionada.persona_relacionada_id);
                $("input[name=rbtnentidadbancaria][value='" + personarelacionada.entidad_bancaria_id + "']").prop('checked', true);
                $('#cbtipodocumentopr').val(personarelacionada.tipo_documento);
                $('#txtnumerodocumentopr').val(personarelacionada.numero_documento);
                $('#txtprimernombrepr').val(personarelacionada.primer_nombre);
                $('#txtsegundonombrepr').val(personarelacionada.segundo_nombre);
                $('#txtprimerapellidopr').val(personarelacionada.primer_apellido);
                $('#txtsegundoapellidopr').val(personarelacionada.segundo_apellido);
                $('#dpfechanacimientopr').val(moment(personarelacionada.fecha_nacimiento).format('DD/MM/YYYY')); 
                $('#txtemailpr').val(personarelacionada.correo_electronico);
                $('#cbtipotelefonopr').val(personarelacionada.tipo_telefono_principal);
                $('#txttelefonopr').val(personarelacionada.numero_telefono_principal);
                $("input[name=rbtntipopago][value='" + personarelacionada.tipo_pago + "']").prop('checked', true);
                $('#txtnumerocuentapr').val(personarelacionada.numero_cuenta);
                marcarRolesSeleccionados(personarelacionada.roles_id);
                cargarLocalidad(personarelacionada.ciudad_id);




            }
        },
        error: function () {

        }
    });
}
function cargarLocalidad(ciudadId) {
    $.ajax({
        url: '/PersonaRelacionada/ObtenerLocacionPorIdCiudad?id=' + ciudadId,
        method: 'GET',
        success: function (data) {

            $("#cbpais").val(data.pais).trigger('change');
            $("#cbprovincia").val(data.provincia).trigger('change');
            $("#cbciudad").val(data.ciudad).trigger('change');
            console.log("funciona");

        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}
function advertenciaEditar() {
    //Confirmacion de edicion espera que el usuario confirme o cancele
    return new Promise((resolve) => {
        showHideModal('edicionmodal', 'show');
        $('#btnconfirmacionedicionmodal').one('click', function () {
            resolve(true);
            showHideModal('edicionmodal', 'hide');

        });
        $('#btncancelaredicionmodal').one('click', function () {
            resolve(false);
        });
        $('#btnedicionmodal').one('click', function () {
            resolve(false);
        });
    });
}
function eliminarPersonaRelacionada(id, nombreCompleto) {
    advertenciaEliminar(nombreCompleto).then((confirmado) => {
        if (confirmado) {
            showHideModal('cargando-modal', 'show');
            $.ajax({
                url: '/PersonaRelacionada/EliminarPersonaRelacionada?id=' + id,
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (response) {
                    if (response.message == 1) {
                        showHideModal('cargando-modal', 'hide');
                        mostrarModalOperacionPr('exito-modal');
                    } else {
                        showHideModal('cargando-modal', 'hide');
                        mostrarModalOperacionPr('error-modal');
                    }
                    obtenerPersonasRelacionadas();
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
        showHideModal('eliminarmodal', 'show');
        $('#lblnombrepersonaeliminar').text(nombreCompleto);
        $('#btnconfirmacioneliminarmodal').one('click', function () {
            resolve(true);
            showHideModal('eliminarmodal', 'hide');

        });

        $('#btncancelareliminarmodal').one('click', function () {
            resolve(false);
        });
        $('#btneliminarmodal').one('click', function () {
            resolve(false);
        });
    });
}
function mostrarModalOperacionPr(nombremodal) {
    showHideModal(nombremodal, 'show');

    const cerrarModalPromise = new Promise((resolve) => {
        $('#' + nombremodal +'aceptarbtn').on('click', function () {
            resolve('button');
        });

        setTimeout(() => {
            resolve('timeout');
        }, 3000);
    });
    cerrarModalPromise.then(() => {
        showHideModal(nombremodal, 'hide');
    });
}
