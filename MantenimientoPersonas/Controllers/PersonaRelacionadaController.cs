using MantenimientoPersonas.Data;
using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MantenimientoPersonas.Controllers
{
    public class PersonaRelacionadaController : Controller
    {
        private readonly CRUDContext? _context;
        private static PersonaRelacionadaModel personarelacionadamodel;
        private readonly ILogger<PersonaController> _logger;

        public PersonaRelacionadaController(CRUDContext context, ILogger<PersonaController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpGet]
        public JsonResult ObtenerPersonaRelacionadaPorId(int id)
        {
            try {
                var personarelacionada = _context.PersonasRelacionadas
                    .Find(id);

                if (personarelacionada != null)
                {
                    // Obtener los rol_id de los roles asociados a la persona relacionada
                    var rolIds = _context.PersonasRelacionadas
                                        .Where(pr => pr.persona_relacionada_id == id)
                                        .SelectMany(pr => pr.roles.Select(r => r.rol_id))
                                        .ToArray();

                    // Asignar los rol_id a la propiedad roles_id de personarelacionada
                    personarelacionada.roles_id = rolIds;

                    // Retornar un JSON con la persona relacionada y sus roles_id
                    return Json(personarelacionada);
                }
                return Json(personarelacionada);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpGet]
        public IActionResult ObtenerLocalidades()
        {
            var paises = _context.Paises
                .Include(p => p.provincias)
                    .ThenInclude(p => p.ciudades)
                .ToList();

            var resultado = new Dictionary<string, Dictionary<string, List<string>>>();

            foreach (var pais in paises)
            {
                var provinciasDict = new Dictionary<string, List<string>>();

                foreach (var provincia in pais.provincias)
                {
                    provinciasDict[provincia.nombre_provincia] = provincia.ciudades.Select(c => c.nombre_ciudad).ToList();
                }

                resultado[pais.nombre_pais] = provinciasDict;
            }

            return Ok(resultado);
        }
        [HttpGet]
        public IActionResult ObtenerEntidadesBancarias()
        {
            try
            {
                var entidadesBancarias = _context.EntidadesBancarias
                    .Select(e => new { e.entidad_bancaria_id, e.nombre_entidad })
                    .ToList();

                return Json(entidadesBancarias);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpGet]
        public IActionResult ObtenerCiudades()
        {
            try
            {
                var ciudades = _context.Ciudades
                    .Select(c => new { c.ciudad_id, c.nombre_ciudad })
                    .ToList();

                return Json(ciudades);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpGet]
        public IActionResult ObtenerRoles()
        {
            try
            {
                var roles = _context.Roles
                    .Select(r => new { r.rol_id, r.nombre_rol })
                    .ToList();

                return Json(roles);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpGet]

        public JsonResult ObtenerPersonaRelacionadaPorNumeroDocumento(string ndocumento)
        {
            try
            {
                bool personaExiste = _context.PersonasRelacionadas.Any(p => p.numero_documento == ndocumento);

                if (personaExiste)
                {
                    return Json(new { message = 1 });
                }
                return Json(new { message = 0 });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpGet]
        public JsonResult ObtenerPersonasRelacionadas()
        {
            try
            {
                var personasrelacionadas = _context.PersonasRelacionadas
                    .Where(p => p.estado_activo == true)
                    .Include(p => p.entidad_bancaria)
                    .Include(p => p.ciudad)
                    .Select(p => new
                    {
                        p.persona_relacionada_id,
                        p.persona_id,
                        p.ciudad_id,
                        p.entidad_bancaria_id,
                        p.tipo_documento,
                        p.numero_documento,
                        p.primer_nombre,
                        p.segundo_nombre,
                        p.primer_apellido,
                        p.segundo_apellido,
                        p.fecha_nacimiento,
                        p.correo_electronico,
                        p.tipo_telefono_principal,
                        p.numero_telefono_principal,
                        p.tipo_pago,
                        p.numero_cuenta,
                        p.estado_activo,
                        p.roles,
                        nombre_ciudad = p.ciudad.nombre_ciudad,
                        nombre_provincia = p.ciudad.provincia.nombre_provincia,
                        nombre_pais = p.ciudad.provincia.pais.nombre_pais,
                        nombre_entidad_bancaria = p.entidad_bancaria.nombre_entidad
                    }).ToList();
                return Json(personasrelacionadas);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult AgregarPersonaRelacionada(PersonaRelacionadaModel personarelacionada)
        {
            //var errors = ModelState.Values.SelectMany(v => v.Errors);
            try {
            if (ModelState.IsValid)
            {
                if (personarelacionada.roles_id !=null)
                    {
                        List<RolModel> rolesaagregar = new List<RolModel>();
                        foreach (int rolid in personarelacionada.roles_id)
                        {
                            RolModel rol = _context.Roles.Single(r => r.rol_id == rolid);
                            rolesaagregar.Add(rol);
                        }
                        personarelacionada.roles = rolesaagregar;
                    }

                _context.PersonasRelacionadas.Add(personarelacionada);

                _context.SaveChanges();
                return Json(new { success = true, message = 1 });
            }
            else
            {
                return Json(new { success = false, message = 0 });
            }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        [HttpPut]
        public JsonResult ActualizarPersonaRelacionada(PersonaRelacionadaModel personarelacionada)
        {
            try
            {
                if (ModelState.IsValid)
                {


                        // Obtener la persona relacionada actual desde la base de datos con sus roles
                        var personaRelacionadaDB = _context.PersonasRelacionadas
                            .Include(pr => pr.roles)
                            .Single(pr => pr.persona_relacionada_id == personarelacionada.persona_relacionada_id);

                        List<RolModel> rolesAActualizar = new List<RolModel>();

                    // Eliminar roles que están en la base de datos pero no en rolesAActualizar
                    var rolesActuales = personaRelacionadaDB.roles.ToList();
                    foreach (var rolActual in rolesActuales)
                    {
                        if (!rolesAActualizar.Any(r => r.rol_id == rolActual.rol_id))
                        {
                            personaRelacionadaDB.roles.Remove(rolActual);
                        }
                    }
                    if (personarelacionada.roles_id != null)
                    {

                    // Obtener roles a agregar

                    foreach (int rolid in personarelacionada.roles_id)
                        {
                            RolModel rol = _context.Roles.Single(r => r.rol_id == rolid);
                            rolesAActualizar.Add(rol);
                        }

                       

                        // Agregar roles que están en rolesAActualizar pero no en la base de datos
                        foreach (var rolAAgregar in rolesAActualizar)
                        {
                            if (!personaRelacionadaDB.roles.Any(r => r.rol_id == rolAAgregar.rol_id))
                            {
                                personaRelacionadaDB.roles.Add(rolAAgregar);
                            }
                        }
                    }

                    personaRelacionadaDB.ciudad_id = personarelacionada.ciudad_id;
                        personaRelacionadaDB.entidad_bancaria_id = personarelacionada.entidad_bancaria_id;

                        personaRelacionadaDB.tipo_documento = personarelacionada.tipo_documento;
                        personaRelacionadaDB.numero_documento = personarelacionada.numero_documento;
                        personaRelacionadaDB.primer_nombre = personarelacionada.primer_nombre;
                        personaRelacionadaDB.segundo_nombre = personarelacionada.segundo_nombre;
                        personaRelacionadaDB.primer_apellido = personarelacionada.primer_apellido;
                        personaRelacionadaDB.segundo_apellido = personarelacionada.segundo_apellido;
                        personaRelacionadaDB.fecha_nacimiento = personarelacionada.fecha_nacimiento;
                        personaRelacionadaDB.correo_electronico = personarelacionada.correo_electronico;
                        personaRelacionadaDB.tipo_telefono_principal = personarelacionada.tipo_telefono_principal;
                        personaRelacionadaDB.numero_telefono_principal = personarelacionada.numero_telefono_principal;
                        personaRelacionadaDB.tipo_pago = personarelacionada.tipo_pago;
                        personaRelacionadaDB.numero_cuenta = personarelacionada.numero_cuenta;

                        personaRelacionadaDB.estado_activo = personarelacionada.estado_activo;
                        // Actualizar la entidad en el contexto y guardar cambios
                        _context.PersonasRelacionadas.Update(personaRelacionadaDB);
           
                    _context.SaveChanges();

                    return Json(new { success = true, message = 1 });
                }
                else
                {
                    return Json(new { success = false, message = 0 });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete]
        public JsonResult EliminarPersonaRelacionada(int id)
        {
            var personarelacionada = _context.PersonasRelacionadas.Find(id);
            if (personarelacionada != null)
            {
                personarelacionada.estado_activo = false;
                _context.SaveChanges();
                return Json(new { success = true, message = 1 });
            }
            else
            {
                return Json(new { success = true, message = 0 });
            }
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult PersonasRelacionadasPartial()
        {
            return PartialView("_mantenimientopersonasrelacionadas", personarelacionadamodel);
        }
        [HttpGet]
        public IActionResult ObtenerLocacionPorIdCiudad(int id)
        {
            var ciudad = _context.Ciudades
                .Include(c => c.provincia)
                    .ThenInclude(p => p.pais)
                .SingleOrDefault(c => c.ciudad_id == id);

            if (ciudad == null)
            {
                return NotFound(new { success = false, message = "Ciudad no encontrada" });
            }

            var resultado = new
            {
                ciudad = ciudad.nombre_ciudad,
                provincia = ciudad.provincia.nombre_provincia,
                pais = ciudad.provincia.pais.nombre_pais
            };

            return Ok(resultado);
        }
    }

}
