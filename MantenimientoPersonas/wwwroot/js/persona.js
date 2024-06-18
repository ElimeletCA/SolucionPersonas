$(document).ready(function () {
    $("#cargandomodal").modal("show");


    obtenerPersonas();
    cargarListaPersonasRelacionadas();
    
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
            error.addClass('text-danger fw-bolder');
            error.insertAfter(element);
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
            guardarPersona();
            return false;
        }

    });
    
    setTimeout(function () {
        $("#cargandomodal").modal("hide");
    }, 2000);
});


function abrirMantenimientoPersonasRe(){
    $('#cuerpomodalmostrarpersonasrelacionadas').load('/PersonaRelacionada/PersonasRelacionadasPartial');
    $("#modalmostrarpersonasrelacionadas").modal("show");

}
function obtenerPersonas() {
    $('#tblpersonas').DataTable({
        layout: {
            topStart: {
                buttons: [
                    {
                        text: 'Agregar nueva persona',
                        className: '',
                        action: function (e, dt, node, config) {
                            agregarPersona();
                        }
                    }
                ]
            }
        },
        paging: false,
        scrollCollapse: true,
        scrollY: '500px',
        "ajax": {
            "url": "/Persona/ObtenerPersonas",
            "type": "GET",
            "dataType": "json",
            "contentType": "application/json;charset=utf-8",
            "dataSrc": function (response) {
                if (!response || response.length === 0) {
                    $('#tblpersonasbody').html('<tr class="bg-white whitespace-nowrap border-b text-center font-bold border-b dark:bg-gray-800 dark:border-gray-700"><td colspan="9">Personas no disponibles</td></tr>');
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
            { "data": "genero" },
            {
                "data": "mayoria_edad",
                "render": function (data, type, row) {
                    return data ? 'SI' : 'NO';
                }
            },
            { "data": "numero_telefono" },
            {
                "data": null,
                "render": function (data, type, row) {
                    var nombreCompleto = row.primer_nombre + ' ' + (row.segundo_nombre ? row.segundo_nombre + ' ' : '') + row.primer_apellido + ' ' + (row.segundo_apellido ? row.segundo_apellido : '');
                    return '<button type="button" onclick="editarPersona(' + row.persona_id + ')" class=""></button>&nbsp;' +
                        '<button type="button" onclick="eliminarPersona(' + row.persona_id + ', `' + nombreCompleto + '`)" class=""></button>&nbsp;';
                }
            }
        ]
    });
}
function agregarPersona() {
    //$('#tblpersonas').DataTable().ajax.reload();
    //    $("#cargandomodal").modal("show");

    $('#lblmodalprincipal').text('Agregar nueva persona');
    limpiarModal();
    $("#modalprincipal").modal("show");




}
function obtenerPersonasReSeleccionadas() {
    var PersonasReSeleccionadas = [];
    $('input[name="personasreseleccionadas[]"]:checked').each(function () {
        PersonasReSeleccionadas.push($(this).val());
    });
    return PersonasReSeleccionadas;
}
function marcarPersonasReSeleccionadas(prids) {
    $('input[name="personasreseleccionadas[]"]').prop('checked', false);

    prids.forEach(function (id) {
        $('input[name="personasreseleccionadas[]"][value="' + id + '"]').prop('checked', true);
    });
}
function guardarPersona() {
    if ($('#txtpersonaid').val() == '' || $('#txtpersonaid').val() == null) {
        $.confirm({
            title: 'Esta seguro que quiere guardar la persona?',
            content: '',
            buttons: {
                confirm:  {
                    text: 'Something else',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function () {
                        $.alert('Something?');
                    }                },
                cancel: function () {
                    $.alert('Canceled!');
                },
                somethingElse: {
                    text: 'Something else',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function () {
                        $.alert('Something else?');
                    }
                }
            }
        });
        /*$.confirm({
            content: '<i class="bi bi-floppy-fill"></i>',
            buttons: {
                aceptar: {
                    btnClass: 'btn-blue',
                    btnAceptar: function () {
                        $.alert('Something else?');

                        $("#cargandomodal").modal("show");
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
                        persona.pr_id = obtenerPersonasReSeleccionadas();

                        persona.estado_activo = true;
                        $.ajax({
                            url: '/Persona/ObtenerPersonaPorNumeroDocumento?ndocumento=' + persona.numero_documento,
                            type: 'GET',
                            dataType: 'json',
                            contentType: 'application/json;charset=utf-8',
                            success: function (response) {
                                if (response.message == 1) {
                                    setTimeout(function () {
                                        $("#cargandomodal").modal("hide");
                                    }, 1000);

                                    $.confirm({
                                        title: 'Error al guardar',
                                        content: 'El número de documento que intenta almacenar ya existe en al base de datos, por favor verifique e intente de nuevo',
                                        type: 'orange',
                                        typeAnimated: true,
                                        buttons: {
                                            tryAgain: {
                                                text: 'Intentar de nuevo',
                                                btnClass: 'btn-warning',
                                                action: function () {
                                                }
                                            },
                                            close: function () {
                                            }
                                        }
                                    });

                                } else {
                                    $.ajax({
                                        url: '/Persona/AgregarPersona',
                                        type: 'POST',
                                        data: persona,
                                        success: function (response) {
                                            if (response.message == 1) {
                                                setTimeout(function () {
                                                    $("#cargandomodal").modal("hide");
                                                }, 1000);
                                                $.confirm({
                                                    title: 'Guardado exitoso',
                                                    content: '<img class="w-24 h-24" src="~/resources/images/exito.webp" alt="" />',
                                                    type: 'green',
                                                    typeAnimated: true,
                                                    buttons: {
                                                        tryAgain: {
                                                            text: 'Aceptar',
                                                            btnClass: 'btn-success',
                                                            action: function () {
                                                            }
                                                        },
                                                        close: function () {
                                                        }
                                                    }
                                                });
                                            } else {
                                                setTimeout(function () {
                                                    $("#cargandomodal").modal("hide");
                                                }, 1000);
                                                $.confirm({
                                                    title: 'Error',
                                                    content: '<img class="w-24 h-24" src="~/resources/images/error.webp" alt="" />',
                                                    type: 'red',
                                                    typeAnimated: true,
                                                    buttons: {
                                                        tryAgain: {
                                                            text: 'Intentar de nuevo',
                                                            btnClass: 'btn-red',
                                                            action: function () {
                                                            }
                                                        },
                                                        close: function () {
                                                        }
                                                    }
                                                });                                            }
                                            obtenerPersonas();
                                            limpiarModal();
                                            $("#modalprincipal").modal("hide");
                                        },
                                        error: function () {
                                        }
                                    });
                                }
                            }
                        });
                    }                },
                cancelar: {
                    btnClass: 'btn-dark',
                    Cancelar: function () { }
                },
            }
        });*/        
    } else {
        advertenciaEditar().then((confirmado) => {
            if (confirmado) {
                showHideModal('cargando-modal', 'show');
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
                persona.pr_id = obtenerPersonasReSeleccionadas();
                persona.estado_activo = true;

                $.ajax({
                    url: '/Persona/ActualizarPersona',
                    type: 'PUT',
                    data: persona,
                    success: function (response) {
                        if (response.message == 1) {
                            showHideModal('cargando-modal', 'hide');
                            mostrarModalOperacion('exito-modal');
                        } else {
                            showHideModal('cargando-modal', 'hide');
                            mostrarModalOperacion('error-modal');
                        }
                        obtenerPersonas();
                        limpiarModal();

                        showHideModal('modalprincipal', 'hide');
                    },
                    error: function () {
                        showHideModal('cargando-modal', 'hide');
                        showHideModal('error-modal', 'show');
                    }
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

function editarPersona(id) {
    //Colocar los datos de la persona en el modal
    showHideModal('cargando-modal', 'show');
    $.ajax({
        url: '/Persona/ObtenerPersonaPorId?id=' + id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (persona) {
            if (persona == null || persona == undefined || persona.length == 0) {

            } else {
                limpiarModal();
                showHideModal('modalprincipal', 'show');
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
                marcarPersonasReSeleccionadas(persona.pr_id);

            }
        },
        error: function () {

        }
    });
    showHideModal('cargando-modal', 'hide');
}
function eliminarPersona(id, nombreCompleto) {
    advertenciaEliminar(nombreCompleto).then((confirmado) => {
        if (confirmado) {
            showHideModal('cargando-modal', 'show');
            $.ajax({
                url: '/Persona/EliminarPersona?id=' + id,
                type: 'DELETE',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (response) {
                    if (response.message == 1) {
                        showHideModal('cargando-modal', 'hide');
                        mostrarModalOperacion('exito-modal');
                    } else {
                        showHideModal('cargando-modal', 'hide');
                        mostrarModalOperacion('error-modal');
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


function cargarListaPersonasRelacionadas() {
    $.get('/PersonaRelacionada/ObtenerPersonasRelacionadas', function (personasr) {
        var listaRoles = $('#listapersonasrelacionadas');
        listaRoles.empty();
        $.each(personasr, function (index, personarr) {
            var nombreCompleto = personarr.primer_nombre + ' ';
            nombreCompleto += (personarr.segundo_nombre != null) ? personarr.segundo_nombre + ' ' : ' ';
            nombreCompleto += personarr.primer_apellido + ' ';
            nombreCompleto += (personarr.segundo_apellido != null) ? personarr.segundo_apellido : ' ';
            var li = $('<li>').addClass('list-group-item');
            var div = $('<div>').addClass('text-start ');

            var checkbox = $('<input>')
                .attr('type', 'checkbox')
                .attr('id', 'ck' + nombreCompleto.toLowerCase().replace(/\s+/g, ''))
                .attr('name', 'personasreseleccionadas[]') 
                .val(personarr.persona_relacionada_id)
                .addClass('form-check-input me-1');

            var label = $('<label>')
                .attr('for', 'ck' + nombreCompleto.toLowerCase().replace(/\s+/g, ''))
                .addClass('form-check-label')
                .text(nombreCompleto);

            div.append(checkbox);
            div.append(label);
            li.append(div);
            listaRoles.append(li);
        });
    });

}
