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
    const modalpersonar = document.getElementById('modalmostrarpersonasrelacionadas');
    modalpersonar.addEventListener('hidden.bs.modal', event => {
        cargarListaPersonasRelacionadas();
        editarPersona($('#txtpersonaid').val());
    })
    setTimeout(function () {
        $("#cargandomodal").modal("hide");
    }, 1000);
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
        scrollY: '350px',
        "ajax": {
            "url": "/Persona/ObtenerPersonas",
            "type": "GET",
            "dataType": "json",
            "contentType": "application/json;charset=utf-8",
            "dataSrc": function (response) {
                if (!response || response.length === 0) {
                    $('#tblpersonasbody').html('<tr class="whitespace-nowrap"><td colspan="9">Personas no disponibles</td></tr>');
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
                    return '<button type="button" onclick="editarPersona(' + row.persona_id + ')" class="btn"><i class="fa-solid fa-pencil fa-lg" style="color: #FFD43B;"></i></button>&nbsp;' +
                        '<button type="button" onclick="eliminarPersona(' + row.persona_id + ', `' + nombreCompleto + '`)" class="btn"><i class="fa-solid fa-trash fa-lg" style="color: #ff0000;"></i></button>&nbsp;';
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
            content: '<br/><div class="text-center"><i class="fa-solid fa-floppy-disk fa-bounce fa-6x" style="color: #0091ff;"></i></div><br/>',
            buttons: {
                confirmar: {
                    text: 'Confirmar',
                    btnClass: 'btn-green',
                    keys: ['enter', 'shift'],
                    action: function () {
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

                                    $.alert({
                                        title: 'Error al guardar',
                                        content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-triangle-exclamation fa-beat-fade fa-6x" style="color: #FFD43B;"></i><br/><strong>El número de documento ya existe en al base de datos, intente de nuevo</strong></div></center>',
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
                                    $.ajax({
                                        url: '/Persona/AgregarPersona',
                                        type: 'POST',
                                        data: persona,
                                        success: function (response) {
                                            if (response.message == 1) {

                                                $.alert({
                                                    title: 'Guardado correctamente',
                                                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-6x" style="color: #04ff00;"></i><br/><br/><strong>El registro se guardó correctamente</strong></div></center>',
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
                                            $('#tblpersonas').DataTable().ajax.reload();
                                            setTimeout(function () {
                                                $("#cargandomodal").modal("hide");
                                            }, 1000);

                                            limpiarModal();
                                            $("#modalprincipal").modal("hide");
                                        },
                                        error: function () {
                                        }
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

                                    $.alert({
                                        title: 'Editado correctamente',
                                        content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-6x" style="color: #04ff00;"></i><br/><br/><strong>El registro se editó correctamente</strong></div></center>',
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
                                $('#tblpersonas').DataTable().ajax.reload();
                                setTimeout(function () {
                                    $("#cargandomodal").modal("hide");
                                }, 1000);

                                limpiarModal();
                                $("#modalprincipal").modal("hide");
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
}
function editarPersona(id) {
    //Colocar los datos de la persona en el modal
    $("#cargandomodal").modal("show");
    $.ajax({
        url: '/Persona/ObtenerPersonaPorId?id=' + id,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (persona) {
            if (persona == null || persona == undefined || persona.length == 0) {

            } else {
                limpiarModal();
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
    setTimeout(function () {
        $("#cargandomodal").modal("hide");
        $("#modalprincipal").modal("show");
    }, 1000);
}
function eliminarPersona(id, nombreCompleto) {
    
    $.confirm({
        title: 'Esta seguro que quiere eliminar la persona?',
        content: '<br/><div class="text-center"><i class="fa-solid fa-trash fa-shake fa-6x" style="color: #ff0000;"></i><br/><strong>'+nombreCompleto+'</strong></div><br/>',
        buttons: {
            confirmar: {
                text: 'Confirmar',
                btnClass: 'btn-red',
                keys: ['enter', 'shift'],
                action: function () {
                    $("#cargandomodal").modal("show");
                    $.ajax({
                        url: '/Persona/EliminarPersona?id=' + id,
                        type: 'DELETE',
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8',
                        success: function (response) {
                            if (response.message == 1) {
                                $.alert({
                                    title: 'Editado correctamente',
                                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-4x" style="color: #04ff00;"></i><br/><br/><strong>El registro se eliminó correctamente</strong></div></center>',
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
                            $('#tblpersonas').DataTable().ajax.reload();
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
function cargarListaPersonasRelacionadas() {
    $.get('/PersonaRelacionada/ObtenerPersonasRelacionadas', function (personasr) {
        var listaPerR = $('#listapersonasrelacionadas');
        listaPerR.empty();
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
            listaPerR.append(li);
        });
    });

}
