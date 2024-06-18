$(function () {
    $("#cargandomodal").modal("show");

    $('head').append('<style>.error-text { display: none; }</style>');
    $('#cuerpomodalprincipalpr').on('keypress', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });

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
            cbpais: {
                required: true
            },
            cbprovincia: {
                required: true
            },
            cbciudad: {
                required: true
            },
            cbtipopago: {
                required: true
            },
            cbentidadbancaria: {
                required: true
            },
            txttelefono: {
                required: true
            },
            dpfechanacimientopr: {
                required: true
            },
            txtnumerocuentapr: {
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
            txtnumerocuentapr: {
                required: "Por favor, introduzca el número de cuenta."
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
            cbtipopago: {
                required: "Por favor, introduzca un tipo de pago."
            },
            cbentidadbancaria: {
                required: "Por favor, introduzca una entidad bancaria."
            },
            cbpais: {
                required: "Por favor, introduzca un pais."
            },
            cbprovincia: {
                required: "Por favor, introduzca una provincia."
            },
            cbciudad: {
                required: "Por favor, introduzca una ciudad."
            },
            dpfechanacimientopr: {
                required: "Por favor, introduzca una fecha de nacimiento."
            }
        },
        errorPlacement: function (error, element) {
            error.addClass('text-danger fw-bolder');
            if (element.hasClass("select2-hidden-accessible")) {
                error.insertAfter(element.next('span.select2'));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element) {
            $(element).addClass('border border-3 border-danger');
        },
        unhighlight: function (element) {
            $(element).removeClass('border border-3 border-danger');
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
    setTimeout(function () {
        $("#cargandomodal").modal("hide");
    }, 2000);
});
function cargarEntidadesBancarias() {
    $.ajax({
        url: '/PersonaRelacionada/ObtenerEntidadesBancarias',
        method: 'GET',
        success: function (data) {
            var select = $('#cbentidadbancaria');
            select.empty();
            data.forEach(function (entidad) {
                var option = $('<option></option>')
                    .attr('value', entidad.entidad_bancaria_id)
                    .text(entidad.nombre_entidad);
                select.append(option);
            });
        },
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

    $('#cbpais').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#cuerpomodalprincipalpr')

    });
    $('#cbprovincia').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#cuerpomodalprincipalpr')

    });
    $('#cbciudad').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#cuerpomodalprincipalpr')

    });
    $('#cbentidadbancaria').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#cuerpomodalprincipalpr')

    });
    $('#cbtipopago').select2({
        theme: 'bootstrap-5',
        dropdownParent: $('#cuerpomodalprincipalpr')

    });

    limpiarModalPr();
}
function cargarRoles() {
    $.get('/PersonaRelacionada/ObtenerRoles', function (roles) {
        var listaRoles = $('#listaRoles');
        listaRoles.empty();
        $.each(roles, function (index, rol) {
            var li = $('<li>').addClass('list-group-item');
            var div = $('<div>').addClass('text-start');

            var checkbox = $('<input>')
                .attr('type', 'checkbox')
                .attr('id', 'ck' + rol.nombre_rol.toLowerCase().replace(/\s+/g, ''))
                .attr('name', 'rolesSeleccionados[]') // Agregar el atributo name aquí
                .val(rol.rol_id)
                .addClass('form-check-input me-1');

            var label = $('<label>')
                .attr('for', 'ck' + rol.nombre_rol.toLowerCase().replace(/\s+/g, ''))
                .addClass('form-check-label')
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
    $('#lblmodalprincipalpr').text('Agregar nueva persona relacionada');
    limpiarModalPr();
    $("#modalprincipalpr").modal("show");


}

function obtenerPersonasRelacionadas() {
    $('#tblpersonasr').DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        text: 'Agregar nueva persona relacionada',
                        className: '',
                        action: function (e, dt, node, config) {
                            agregarPersonaRelacionada();
                        }
                    }
                ]
            }
        },
        paging: false,
        scrollCollapse: true,
        scrollY: '350px',
        "ajax": {
            "url": "/PersonaRelacionada/ObtenerPersonasRelacionadas",
            "type": "GET",
            "dataType": "json",
            "contentType": "application/json;charset=utf-8",
            "dataSrc": function (response) {
                if (!response || response.length === 0) {
                    $('#tblpersonasbody').html('<tr class="whitespace-nowrap"><td colspan="16">Personas no disponibles</td></tr>');
                    return [];
                }

                return response;
            }
        },
        "columns": [
            { "data": "numero_documento" },
            { "data": "primer_nombre" },
            {
                "data": "segundo_nombre",
                "render": function (data, type, row) {
                    return data != null ? data : '';
                }
            },
            { "data": "primer_apellido" },
            {
                "data": "segundo_apellido",
                "render": function (data, type, row) {
                    return data != null ? data : '';
                }
            },
            {
                "data": "fecha_nacimiento",
                "render": function (data, type, row) {
                    return data ? moment(data).format('DD/MM/YYYY') : '';
                }
            },
            {
                "data": "roles",
                "className": "scroll-cell",
                "render": function (data, type, row) {
                    return data.map(function (rol) { return rol.nombre_rol; }).join('<br/>');
                }
            },
            { "data": "correo_electronico" },
            { "data": "numero_telefono_principal" },
            { "data": "tipo_pago" },
            { "data": "numero_cuenta" },
            {
                "data": "nombre_entidad_bancaria",
                "render": function (data, type, row) {
                    return data ? data + '&nbsp;' : '';
                }
            },
            {
                "data": "nombre_pais",
                "render": function (data, type, row) {
                    return data ? data + '&nbsp;' : '';
                }
            },
            {
                "data": "nombre_provincia",
                "render": function (data, type, row) {
                    return data ? data + '&nbsp;' : '';
                }
            },
            {
                "data": "nombre_ciudad",
                "render": function (data, type, row) {
                    return data ? data + '&nbsp;' : '';
                }
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    var nombreCompleto = row.primer_nombre + ' ' + (row.segundo_nombre ? row.segundo_nombre + ' ' : '') + row.primer_apellido + ' ' + (row.segundo_apellido ? row.segundo_apellido : '');
                    return '<button type="button" onclick="editarPersonaRelacionada(' + row.persona_relacionada_id + ')" class="btn"><i class="fa-solid fa-pencil fa-lg" style="color: #FFD43B;"></i></button>&nbsp;' +
                        '<button type="button" onclick="eliminarPersonaRelacionada(' + row.persona_relacionada_id + ', `' + nombreCompleto + '`)" class="btn"><i class="fa-solid fa-trash fa-lg" style="color: #ff0000;"></i></button>&nbsp;';
                }
            }
        ]
    });

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
    $('#cbtipopago').val('');
    $('#txtnumerocuentapr').val('');
    $('#cbentidadbancaria').val('');
    $("#cbpais").val([]).trigger('change');
    
    $("label.error").hide();
    $(".error").removeClass("error");
    $('.form-select').each(function () { $(this).removeClass('border border-3 border-danger'); });
    $('.form-control').each(function () { $(this).removeClass('border border-3 border-danger'); });

    
    //$("input[name=rbtngenero][value='MASCULINO']").prop('checked', true);
}
$(document.body).on("change", "#cbpais", function () {
    $("#cbpais-error").hide();
});
$(document.body).on("change", "#cbprovincia", function () {
    $("#cbprovincia-error").hide();
});
$(document.body).on("change", "#cbciudad", function () {
    $("#cbciudad-error").hide();
});
$(document.body).on("change", "#cbtipopago", function () {
    $("#cbtipopago-error").hide();
});
$(document.body).on("change", "#cbentidadbancaria", function () {
    $("#cbentidadbancaria-error").hide();
});
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
        $.confirm({
            title: 'Esta seguro que quiere guardar la persona?',
            content: '<br/><div class="text-center"><i class="fa-solid fa-floppy-disk fa-bounce fa-6x" style="color: #0091ff;"></i></div><br/>',
            buttons: {
                confirmar: {
                    text: 'Confirmar',
                    btnClass: 'btn-green',
                    keys: ['enter', 'shift'],
                    action: function () {
                        $("#cargandomodal").modal("show");
                        //Agregar nueva persona relacionada
                        var personar = new Object();
                        personar.tipo_documento = $('#cbtipodocumentopr').val().toUpperCase();
                        personar.numero_documento = $('#txtnumerodocumentopr').val().toUpperCase();
                        personar.primer_nombre = $('#txtprimernombrepr').val().toUpperCase();
                        personar.segundo_nombre = $('#txtsegundonombrepr').val().toUpperCase();
                        personar.primer_apellido = $('#txtprimerapellidopr').val().toUpperCase();
                        personar.segundo_apellido = $('#txtsegundoapellidopr').val().toUpperCase();
                        personar.fecha_nacimiento = $('#dpfechanacimientopr').val();
                        personar.correo_electronico = $('#txtemailpr').val();
                        personar.tipo_telefono_principal = $('#cbtipotelefonopr').val();
                        personar.numero_telefono_principal = $('#txttelefonopr').val();
                        personar.numero_cuenta = $('#txtnumerocuentapr').val();
                        personar.tipo_pago = $('#cbtipopago').val();
                        personar.entidad_bancaria_id = $('#cbentidadbancaria').val();

                        personar.roles_id = obtenerRolesSeleccionados();
                        personar.estado_activo = true;
                        $.ajax({
                            url: '/PersonaRelacionada/ObtenerPersonaRelacionadaPorNumeroDocumento?ndocumento=' + personar.numero_documento,
                            type: 'GET',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            success: function (response) {
                                if (response.message == 1) {

                                    $.alert({
                                        title: 'Error al guardar',
                                        content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-triangle-exclamation fa-beat-fade fa-6x" style="color: #FFD43B;"></i><br/><strong>El número de documento ya existe en al base de datos, intente de nuevo</strong></div></center>',
                                        autoClose: 'tryAgain|3000',

                                        type: 'orange',
                                        typeAnimated: true,
                                        buttons: {
                                            tryAgain: {
                                                text: 'Intentar de nuevo',
                                                btnClass: 'btn-warning',
                                                action: function () {
                                                }
                                            }
                                        }
                                    });
                                    setTimeout(function () {
                                        $("#cargandomodal").modal("hide");
                                    }, 1000);

                                } else {
                                    obtenerIdCiudad($('#cbciudad').val()).then((ciudadId) => {
                                        personar.ciudad_id = ciudadId;
                                        $.ajax({
                                            url: '/PersonaRelacionada/AgregarPersonaRelacionada',
                                            type: 'POST',
                                            data: personar,
                                            success: function (response) {
                                                if (response.message == 1) {

                                                    $.alert({
                                                        title: 'Guardado correctamente',
                                                        content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-6x" style="color: #04ff00;"></i><br/><br/><strong>El registro se guardó correctamente</strong></div></center>',
                                                        autoClose: 'tryAgain|3000',

                                                        type: 'green',
                                                        typeAnimated: true,
                                                        buttons: {
                                                            tryAgain: {
                                                                text: 'Aceptar',
                                                                btnClass: 'btn-success',
                                                                action: function () {
                                                                }
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    $.alert({
                                                        title: 'Error al guardar',
                                                        content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-exclamation fa-shake fa-6x" style="color: #ff0000;"></i><br/><strong>Hubo un error al guardar, intente de nuevo</strong></div></center>',
                                                        autoClose: 'tryAgain|3000',

                                                        type: 'red',
                                                        typeAnimated: true,
                                                        buttons: {
                                                            tryAgain: {
                                                                text: 'Intentar de nuevo',
                                                                btnClass: 'btn-danger',
                                                                action: function () {
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                                limpiarModalPr();
                                                $('#tblpersonasr').DataTable().ajax.reload();
                                                setTimeout(function () {
                                                    $("#modalprincipalpr").modal("hide");

                                                    $("#cargandomodal").modal("hide");

                                                }, 1000);

                                            },
                                            error: function () {
                                            }
                                        });
                                    }).catch((error) => {

                                    });
                                }
                            }
                        });
                    }
                },
                cancelar: {
                    text: 'Cancelar',
                    btnClass: 'btn-dark',
                    keys: ['enter', 'shift'],
                    action: function () {
                    }
                }
            }
        });

    } else {
        $.confirm({
            title: 'Esta seguro que quiere editar la persona?',
            content: '<br/><div class="text-center"><i class="fa-solid fa-square-pen fa-shake fa-6x" style="color: #FFD43B;"></i></div><br/>',
            buttons: {
                confirmar: {
                    text: 'Confirmar',
                    btnClass: 'btn-green',
                    keys: ['enter', 'shift'],
                    action: function () {
                        $("#cargandomodal").modal("show");
                        //Actualizar datos de persona
                        var personar = new Object();
                        personar.persona_relacionada_id = $('#txtpersonarid').val();
                        personar.tipo_documento = $('#cbtipodocumentopr').val().toUpperCase();
                        personar.numero_documento = $('#txtnumerodocumentopr').val().toUpperCase();
                        personar.primer_nombre = $('#txtprimernombrepr').val().toUpperCase();
                        personar.segundo_nombre = $('#txtsegundonombrepr').val().toUpperCase();
                        personar.primer_apellido = $('#txtprimerapellidopr').val().toUpperCase();
                        personar.segundo_apellido = $('#txtsegundoapellidopr').val().toUpperCase();
                        personar.fecha_nacimiento = $('#dpfechanacimientopr').val();
                        personar.correo_electronico = $('#txtemailpr').val();
                        personar.tipo_telefono_principal = $('#cbtipotelefonopr').val();
                        personar.numero_telefono_principal = $('#txttelefonopr').val();
                        personar.numero_cuenta = $('#txtnumerocuentapr').val();
                        personar.tipo_pago = $('#cbtipopago').val();
                        personar.entidad_bancaria_id = $('#cbentidadbancaria').val();
                        personar.roles_id = obtenerRolesSeleccionados();
                        personar.estado_activo = true;

                        obtenerIdCiudad($("#cbciudad").val()).then((ciudadId) => {
                            personar.ciudad_id = ciudadId;
                            $.ajax({
                                url: '/PersonaRelacionada/ActualizarPersonaRelacionada',
                                type: 'PUT',
                                data: personar,
                                success: function (response) {
                                    if (response.message == 1) {
                                        $.alert({
                                            title: 'Editado correctamente',
                                            content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-6x" style="color: #04ff00;"></i><br/><br/><strong>El registro se editó correctamente</strong></div></center>',
                                            autoClose: 'tryAgain|3000',

                                            type: 'green',
                                            typeAnimated: true,
                                            buttons: {
                                                tryAgain: {
                                                    text: 'Aceptar',
                                                    btnClass: 'btn-success',
                                                    action: function () {
                                                    }
                                                }
                                            }
                                        });
                                    } else {

                                        $.alert({
                                            title: 'Error al editar',
                                            content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-exclamation fa-shake fa-6x" style="color: #ff0000;"></i><br/><strong>Hubo un error al editar, intente de nuevo</strong></div></center>',
                                            autoClose: 'tryAgain|3000',

                                            type: 'red',
                                            typeAnimated: true,
                                            buttons: {
                                                tryAgain: {
                                                    text: 'Intentar de nuevo',
                                                    btnClass: 'btn-danger',
                                                    action: function () {
                                                    }
                                                }
                                            }
                                        });                                    }
                                    $('#tblpersonasr').DataTable().ajax.reload();
                                    limpiarModalPr();
                                    setTimeout(function () {
                                        $("#modalprincipalpr").modal("hide");
                                        $("#cargandomodal").modal("hide");

                                    }, 1000);
                                },
                                error: function () {
                                    //cargandobtn.click();
                                    //mostrarModalOperacion('error');
                                }
                            });
                        }).catch((error) => {

                        });
                    }
                },
                cancelar: {
                    text: 'Cancelar',
                    btnClass: 'btn-dark',
                    keys: ['enter', 'shift'],
                    action: function () {
                    }
                }
            }
        });



    }
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
                $('#lblmodalprincipalpr').text('Editar persona relacionada');
                $('#txtpersonarid').val(personarelacionada.persona_relacionada_id);
                $('#cbentidadbancaria').val(personarelacionada.nombre_entidad);
                $('#cbtipodocumentopr').val(personarelacionada.tipo_documento);
                $('#txtnumerodocumentopr').val(personarelacionada.numero_documento);
                $('#txtprimernombrepr').val(personarelacionada.primer_nombre);
                $('#txtsegundonombrepr').val(personarelacionada.segundo_nombre);
                $('#txtprimerapellidopr').val(personarelacionada.primer_apellido);
                $('#txtsegundoapellidopr').val(personarelacionada.segundo_apellido);
                $('#dpfechanacimientopr').val(moment(personarelacionada.fecha_nacimiento).format('YYYY-MM-DD')); 
                $('#txtemailpr').val(personarelacionada.correo_electronico);
                $('#cbtipotelefonopr').val(personarelacionada.tipo_telefono_principal);
                $('#txttelefonopr').val(personarelacionada.numero_telefono_principal);
                $('#cbtipopago').val(personarelacionada.tipo_pago);
                $('#txtnumerocuentapr').val(personarelacionada.numero_cuenta);
                $('#cbentidadbancaria').val(personarelacionada.entidad_bancaria_id);

                marcarRolesSeleccionados(personarelacionada.roles_id);
                cargarLocalidad(personarelacionada.ciudad_id);
                $("#modalprincipalpr").modal("show");





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

        },
        error: function (error) {
            console.error('Error:', error);
        }
    });
}

function eliminarPersonaRelacionada(id, nombreCompleto) {
    $.confirm({
        title: 'Esta seguro que quiere eliminar la persona?',
        content: '<br/><div class="text-center"><i class="fa-solid fa-trash fa-shake fa-6x" style="color: #ff0000;"></i><br/><strong>' + nombreCompleto + '</strong></div><br/>',
        buttons: {
            confirmar: {
                text: 'Confirmar',
                btnClass: 'btn-red',
                keys: ['enter', 'shift'],
                action: function () {
                    $("#cargandomodal").modal("show");
                    $.ajax({
                        url: '/PersonaRelacionada/EliminarPersonaRelacionada?id=' + id,
                        type: 'DELETE',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        success: function (response) {
                            if (response.message == 1) {
                                $.alert({
                                    title: 'Editado correctamente',
                                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-4x" style="color: #04ff00;"></i><br/><br/><strong>El registro se eliminó correctamente</strong></div></center>',
                                    autoClose: 'tryAgain|3000',

                                    type: 'green',
                                    typeAnimated: true,
                                    buttons: {
                                        tryAgain: {
                                            text: 'Aceptar',
                                            btnClass: 'btn-success',
                                            action: function () {
                                            }
                                        }
                                    }
                                });
                            } else {
                                $.alert({
                                    title: 'Error al eliminar',
                                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-exclamation fa-shake fa-6x" style="color: #ff0000;"></i><br/><strong>Hubo un error al eliminar, intente de nuevo</strong></div></center>',
                                    autoClose: 'tryAgain|3000',

                                    type: 'red',
                                    typeAnimated: true,
                                    buttons: {
                                        tryAgain: {
                                            text: 'Intentar de nuevo',
                                            btnClass: 'btn-danger',
                                            action: function () {
                                            }
                                        }
                                    }
                                });
                            }
                            $('#tblpersonasr').DataTable().ajax.reload();
                            setTimeout(function () {
                                $("#cargandomodal").modal("hide");
                            }, 1000);
                        },
                        error: function () {

                        }
                    });
                }
            },
            cancelar: {
                text: 'Cancelar',
                btnClass: 'btn-dark',
                keys: ['enter', 'shift'],
                action: function () {
                }
            }
        }
    });
}
