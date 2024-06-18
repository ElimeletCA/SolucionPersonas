using MantenimientoPersonas.Data;
using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace MantenimientoPersonas.Controllers
{
    public class PersonaController : Controller
    {
        private readonly CRUDContext? _context;
        private readonly ILogger<PersonaController> _logger;


        public PersonaController(CRUDContext context, ILogger<PersonaController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult ObtenerPersonaPorId(int id)
        {
            try
            {
                var persona = _context.Personas.Find(id);

                if (persona != null)
                {
                    var prids = _context.Personas
                                        .Where(persona => persona.persona_id == id)
                                        .SelectMany(persona => persona.personas_relacionadas.Select(personarelacionada => personarelacionada.persona_relacionada_id))
                                        .ToArray();

                    persona.pr_id = prids;

                    // Retornar un JSON con la persona relacionada y sus roles_id
                    return Json(persona);
                }
                return Json(persona);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpGet]

        public JsonResult ObtenerPersonaPorNumeroDocumento(string ndocumento)
        {
            try
            {
                bool personaExiste = _context.Personas.Any(p => p.numero_documento == ndocumento);

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
        public JsonResult ObtenerPersonas()
        {
            var personas = _context.Personas.Where(p => p.estado_activo == true).ToList();
            return Json(personas);
        }
        [HttpPost]
        public JsonResult AgregarPersona(PersonaModel persona)
        {
            
            if (ModelState.IsValid)
            {
                _context.Personas.Add(persona);
                _context.SaveChanges();
                if (persona.pr_id != null)
                {
                    var personasrelacionadas = _context.PersonasRelacionadas.Where(pr => persona.pr_id.Contains(pr.persona_relacionada_id)).ToList();
                    foreach (var personarelacionada in personasrelacionadas)
                    {
                        personarelacionada.persona_id = persona.persona_id;
                    }

                    _context.SaveChanges();
                }

                return Json(new { success = true, message = 1 });
            }
            else
            {
                return Json(new { success = false, message = 0 });
            }



        }
        [HttpPut]
        public JsonResult ActualizarPersona(PersonaModel personat)
        {
            if (ModelState.IsValid)
            {


                if (personat.pr_id != null)
                {
                    
                    var persona = _context.Personas.Include(p => p.personas_relacionadas).FirstOrDefault(p => p.persona_id == personat.persona_id);
                    if (persona == null)
                    {
                        return Json(new { success = false, message = 0 });
                    }
                    var currentpersonasrelacionadas = persona.personas_relacionadas.Select(pr => pr.persona_relacionada_id).ToList();
                    var personasrelacionadasToAdd = personat.pr_id.Except(currentpersonasrelacionadas).ToList();

                    var personasrelacionadasToRemove = currentpersonasrelacionadas.Except(personat.pr_id).ToList();
                    if (personasrelacionadasToRemove.Any())
                    {
                        var personasrelacionadas = _context.PersonasRelacionadas.Where(pr => personasrelacionadasToRemove.Contains(pr.persona_relacionada_id)).ToList();
                        foreach (var personarelacionada in personasrelacionadas)
                        {
                            personarelacionada.persona_id = null;
                        }
                    }



                    if (personasrelacionadasToAdd.Any())
                    {
                        var personasrelacionadas = _context.PersonasRelacionadas.Where(pr => personasrelacionadasToAdd.Contains(pr.persona_relacionada_id)).ToList();
                        foreach (var personarelacionada in personasrelacionadas)
                        {
                            personarelacionada.persona_id = persona.persona_id;
                        }
                    }
                    persona.tipo_documento = personat.tipo_documento;
                    persona.numero_documento = personat.numero_documento;
                    persona.primer_nombre = personat.primer_nombre;
                    persona.segundo_nombre = personat.segundo_nombre;
                    persona.primer_apellido = personat.primer_apellido;
                    persona.segundo_apellido = personat.segundo_apellido;
                    persona.numero_telefono = personat.numero_telefono;
                    persona.tipo_telefono = personat.tipo_telefono;
                    persona.mayoria_edad = personat.mayoria_edad;
                    persona.genero = personat.genero;
                    persona.estado_activo = personat.estado_activo;
                    _context.Personas.Update(persona);
                }
                else
                {
                    int[] ints = { };
                    var persona = _context.Personas.Include(p => p.personas_relacionadas).FirstOrDefault(p => p.persona_id == personat.persona_id);
                    if (persona == null)
                    {
                        return Json(new { success = false, message = 0 });
                    }
                    var currentpersonasrelacionadas = persona.personas_relacionadas.Select(pr => pr.persona_relacionada_id).ToList();
                    var personasrelacionadasToAdd = ints.Except(currentpersonasrelacionadas).ToList();

                    var personasrelacionadasToRemove = currentpersonasrelacionadas.Except(ints).ToList();
                    if (personasrelacionadasToRemove.Any())
                    {
                        var personasrelacionadas = _context.PersonasRelacionadas.Where(pr => personasrelacionadasToRemove.Contains(pr.persona_relacionada_id)).ToList();
                        foreach (var personarelacionada in personasrelacionadas)
                        {
                            personarelacionada.persona_id = null;
                        }
                    }



                    if (personasrelacionadasToAdd.Any())
                    {
                        var personasrelacionadas = _context.PersonasRelacionadas.Where(pr => personasrelacionadasToAdd.Contains(pr.persona_relacionada_id)).ToList();
                        foreach (var personarelacionada in personasrelacionadas)
                        {
                            personarelacionada.persona_id = persona.persona_id;
                        }
                    }
                    persona.tipo_documento = personat.tipo_documento;
                    persona.numero_documento = personat.numero_documento;
                    persona.primer_nombre = personat.primer_nombre;
                    persona.segundo_nombre = personat.segundo_nombre;
                    persona.primer_apellido = personat.primer_apellido;
                    persona.segundo_apellido = personat.segundo_apellido;
                    persona.numero_telefono = personat.numero_telefono;
                    persona.tipo_telefono = personat.tipo_telefono;
                    persona.mayoria_edad = personat.mayoria_edad;
                    persona.genero = personat.genero;
                    persona.estado_activo = personat.estado_activo;
                    _context.Personas.Update(persona);
                }


                _context.SaveChanges();

                return Json(new { success = true, message = 1 });
            }
            else
            {
                return Json(new { success = true, message = 0 });
            }
        }

        [HttpDelete]
        public JsonResult EliminarPersona(int id)
        {
            var persona = _context.Personas.Find(id);
            if (persona != null)
            {
                persona.estado_activo = false;
                _context.SaveChanges();
                return Json(new { success = true, message = 1 });
            }
            else
            {
                return Json(new { success = true, message = 0 });
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
