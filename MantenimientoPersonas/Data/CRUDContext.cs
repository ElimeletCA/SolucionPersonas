using MantenimientoPersonas.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System.Diagnostics;
using System.Reflection.Emit;

namespace MantenimientoPersonas.Data
{
    public class CRUDContext : IdentityDbContext<UserModel>
    {
        public CRUDContext(DbContextOptions<CRUDContext> options) : base(options)
        {
            try
            {
                var databaseCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;
                if (databaseCreator != null)
                {
                    if (!databaseCreator.CanConnect()) databaseCreator.Create();
                    if (!databaseCreator.HasTables()) databaseCreator.CreateTables();
                }
            }
            catch (System.Exception e)
            {
                Debug.WriteLine(e.Message);
            }
        }
        public DbSet<PersonaModel> Personas { get; set; }
        public DbSet<PersonaRelacionadaModel> PersonasRelacionadas { get; set; }
        public DbSet<CiudadModel> Ciudades { get; set; }
        public DbSet<ProvinciaModel> Provincias { get; set; }
        public DbSet<PaisModel> Paises { get; set; }
        public DbSet<RolModel> Roles { get; set; }
        public DbSet<EntidadBancariaModel> EntidadesBancarias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {
            modelbuilder.Entity<PersonaModel>().ToTable("Persona");
            modelbuilder.Entity<PersonaRelacionadaModel>().ToTable("PersonaRelacionada");
            modelbuilder.Entity<CiudadModel>().ToTable("Ciudad");
            modelbuilder.Entity<ProvinciaModel>().ToTable("Provincia");
            modelbuilder.Entity<PaisModel>().ToTable("Pais");
            modelbuilder.Entity<RolModel>().ToTable("Rol");
            modelbuilder.Entity<EntidadBancariaModel>().ToTable("EntidadBancaria");

            /*************************************/

            modelbuilder.Entity<PersonaRelacionadaModel>()
                   .HasOne(personarelacionada => personarelacionada.persona)
                   .WithMany(persona => persona.personas_relacionadas)
                   .HasForeignKey(personarelacionada => personarelacionada.persona_id)
                   .OnDelete(DeleteBehavior.ClientSetNull);

            /*************************************/

            modelbuilder.Entity<PersonaRelacionadaModel>()
                   .HasOne(personarelacionada => personarelacionada.ciudad)
                   .WithMany(ciudad => ciudad.personas_relacionadas)
                   .HasForeignKey(personarelacionada => personarelacionada.ciudad_id)
                   .OnDelete(DeleteBehavior.ClientSetNull);

            /*************************************/

            modelbuilder.Entity<PersonaRelacionadaModel>()
                   .HasOne(personarelacionada => personarelacionada.entidad_bancaria)
                   .WithMany(entidadbancaria => entidadbancaria.personas_relacionadas)
                   .HasForeignKey(personarelacionada => personarelacionada.entidad_bancaria_id)
                   .OnDelete(DeleteBehavior.ClientSetNull);

            /*************************************/

            modelbuilder.Entity<CiudadModel>()
                   .HasOne(ciudad => ciudad.provincia)
                   .WithMany(provincia => provincia.ciudades)
                   .HasForeignKey(ciudad => ciudad.provincia_id)
                   .OnDelete(DeleteBehavior.Cascade);

            /*************************************/

            modelbuilder.Entity<ProvinciaModel>()
                   .HasOne(provincia => provincia.pais)
                   .WithMany(pais => pais.provincias)
                   .HasForeignKey(provincia => provincia.pais_id)
                   .OnDelete(DeleteBehavior.Cascade);

            /*************************************/

            modelbuilder.Entity<PersonaRelacionadaModel>()
                   .HasMany(personasrelacionadas => personasrelacionadas.roles)
                   .WithMany("personas_relacionadas")
                   .UsingEntity(join => join.ToTable("PersonaRelacionadaRol"));

            /*************************************/

            var listaroles = new RolModel[]
            {
                new RolModel {rol_id=1, nombre_rol = "Propietario", descripcion_rol="Propietario"},
                new RolModel {rol_id=2, nombre_rol = "Administrador", descripcion_rol = "Administrador"},
                new RolModel {rol_id=3, nombre_rol = "Encargado Operacional", descripcion_rol = "Encargado Operacional"},
                new RolModel {rol_id=4, nombre_rol = "Vendedor", descripcion_rol = "Vendedor"},
                new RolModel {rol_id=5, nombre_rol = "Suplidor", descripcion_rol = "Suplidor"},
                new RolModel {rol_id=6, nombre_rol = "Beneficiario", descripcion_rol = "Beneficiario"}

            };
            /*************************************/
            var listaentidadesbancarias = new EntidadBancariaModel[]
            {
                new EntidadBancariaModel {entidad_bancaria_id=1, nombre_entidad = "Banco Popular"},
                new EntidadBancariaModel {entidad_bancaria_id=2, nombre_entidad = "Banco Banreservas"},
                new EntidadBancariaModel {entidad_bancaria_id=3, nombre_entidad = "Banco BHD"}
            };
            /*************************************/
            var listapaises = new PaisModel[]
            {
                new PaisModel {pais_id = 1, nombre_pais = "República Dominicana"},
                new PaisModel {pais_id = 2, nombre_pais = "Estados Unidos"}
            };
            /*************************************/
            var listaprovincias = new ProvinciaModel[]
            {
                new ProvinciaModel {provincia_id = 1, pais_id = 1, nombre_provincia ="Santo Domingo"},
                new ProvinciaModel {provincia_id = 2, pais_id = 1, nombre_provincia ="Santiago"},
                new ProvinciaModel {provincia_id = 3, pais_id = 2, nombre_provincia ="California"},
                new ProvinciaModel {provincia_id = 4, pais_id = 2, nombre_provincia ="Texas"}
            };
            /*************************************/
            var listaciudades = new CiudadModel[]
            {
                new CiudadModel {ciudad_id = 1, provincia_id = 1, nombre_ciudad ="Distrito Nacional"},
                new CiudadModel {ciudad_id = 2, provincia_id = 1, nombre_ciudad ="Santo Domingo Este"},
                new CiudadModel {ciudad_id = 3, provincia_id = 2, nombre_ciudad ="Santiago de los Caballeros"},
                new CiudadModel {ciudad_id = 4, provincia_id = 2, nombre_ciudad ="Tamboril"},
                new CiudadModel {ciudad_id = 5, provincia_id = 3, nombre_ciudad ="Los Ángeles"},
                new CiudadModel {ciudad_id = 6, provincia_id = 3, nombre_ciudad ="San Francisco"},
                new CiudadModel {ciudad_id = 7, provincia_id = 4, nombre_ciudad ="Houston"},
                new CiudadModel {ciudad_id = 8, provincia_id = 4, nombre_ciudad ="Dallas"},
            };
            modelbuilder.Entity<RolModel>().HasData(listaroles);
            modelbuilder.Entity<EntidadBancariaModel>().HasData(listaentidadesbancarias); 
            modelbuilder.Entity<PaisModel>().HasData(listapaises);
            modelbuilder.Entity<ProvinciaModel>().HasData(listaprovincias);
            modelbuilder.Entity<CiudadModel>().HasData(listaciudades);


            base.OnModelCreating(modelbuilder);


        }
    }
}
