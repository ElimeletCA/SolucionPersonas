using MantenimientoPersonas.Data;
using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace MantenimientoPersonas.Controllers
{
    public class PersonaController : Controller
    {
        private readonly CRUDContext _context;
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
            var persona = _context.Personas.Find(id);
            return Json(persona);
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
                return Json(new { success = true, message = 1 });
            }
            else
            {
                return Json(new { success = false, message = 0 });
            }
        }
        [HttpPut]
        public JsonResult ActualizarPersona(PersonaModel persona)
        {
            if (ModelState.IsValid)
            {
                _context.Personas.Update(persona);
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
