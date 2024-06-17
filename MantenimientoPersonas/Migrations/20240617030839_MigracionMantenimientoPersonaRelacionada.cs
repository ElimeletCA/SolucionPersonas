using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MantenimientoPersonas.Migrations
{
    public partial class MigracionMantenimientoPersonaRelacionada : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EntidadBancaria",
                columns: table => new
                {
                    entidad_bancaria_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_entidad = table.Column<string>(type: "nvarchar(40)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntidadBancaria", x => x.entidad_bancaria_id);
                });

            migrationBuilder.CreateTable(
                name: "Pais",
                columns: table => new
                {
                    pais_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_pais = table.Column<string>(type: "nvarchar(40)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pais", x => x.pais_id);
                });

            migrationBuilder.CreateTable(
                name: "Rol",
                columns: table => new
                {
                    rol_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nombre_rol = table.Column<string>(type: "nvarchar(40)", nullable: false),
                    descripcion_rol = table.Column<string>(type: "nvarchar(250)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rol", x => x.rol_id);
                });

            migrationBuilder.CreateTable(
                name: "Provincia",
                columns: table => new
                {
                    provincia_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    pais_id = table.Column<int>(type: "int", nullable: false),
                    nombre_provincia = table.Column<string>(type: "nvarchar(40)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Provincia", x => x.provincia_id);
                    table.ForeignKey(
                        name: "FK_Provincia_Pais_pais_id",
                        column: x => x.pais_id,
                        principalTable: "Pais",
                        principalColumn: "pais_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ciudad",
                columns: table => new
                {
                    ciudad_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    provincia_id = table.Column<int>(type: "int", nullable: false),
                    nombre_ciudad = table.Column<string>(type: "nvarchar(40)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ciudad", x => x.ciudad_id);
                    table.ForeignKey(
                        name: "FK_Ciudad_Provincia_provincia_id",
                        column: x => x.provincia_id,
                        principalTable: "Provincia",
                        principalColumn: "provincia_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PersonaRelacionada",
                columns: table => new
                {
                    persona_relacionada_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    persona_id = table.Column<int>(type: "int", nullable: true),
                    ciudad_id = table.Column<int>(type: "int", nullable: true),
                    entidad_bancaria_id = table.Column<int>(type: "int", nullable: true),
                    tipo_documento = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    numero_documento = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    primer_nombre = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    segundo_nombre = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    primer_apellido = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    segundo_apellido = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    fecha_nacimiento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    correo_electronico = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    tipo_telefono_principal = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    numero_telefono_principal = table.Column<string>(type: "nvarchar(15)", nullable: true),
                    tipo_pago = table.Column<string>(type: "nvarchar(15)", nullable: true),
                    numero_cuenta = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    estado_activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonaRelacionada", x => x.persona_relacionada_id);
                    table.ForeignKey(
                        name: "FK_PersonaRelacionada_Ciudad_ciudad_id",
                        column: x => x.ciudad_id,
                        principalTable: "Ciudad",
                        principalColumn: "ciudad_id");
                    table.ForeignKey(
                        name: "FK_PersonaRelacionada_EntidadBancaria_entidad_bancaria_id",
                        column: x => x.entidad_bancaria_id,
                        principalTable: "EntidadBancaria",
                        principalColumn: "entidad_bancaria_id");
                    table.ForeignKey(
                        name: "FK_PersonaRelacionada_Persona_persona_id",
                        column: x => x.persona_id,
                        principalTable: "Persona",
                        principalColumn: "persona_id");
                });

            migrationBuilder.CreateTable(
                name: "PersonaRelacionadaRol",
                columns: table => new
                {
                    personas_relacionadaspersona_relacionada_id = table.Column<int>(type: "int", nullable: false),
                    rolesrol_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonaRelacionadaRol", x => new { x.personas_relacionadaspersona_relacionada_id, x.rolesrol_id });
                    table.ForeignKey(
                        name: "FK_PersonaRelacionadaRol_PersonaRelacionada_personas_relacionadaspersona_relacionada_id",
                        column: x => x.personas_relacionadaspersona_relacionada_id,
                        principalTable: "PersonaRelacionada",
                        principalColumn: "persona_relacionada_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonaRelacionadaRol_Rol_rolesrol_id",
                        column: x => x.rolesrol_id,
                        principalTable: "Rol",
                        principalColumn: "rol_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "EntidadBancaria",
                columns: new[] { "entidad_bancaria_id", "nombre_entidad" },
                values: new object[,]
                {
                    { 1, "Banco Popular" },
                    { 2, "Banco Banreservas" },
                    { 3, "Banco BHD" }
                });

            migrationBuilder.InsertData(
                table: "Pais",
                columns: new[] { "pais_id", "nombre_pais" },
                values: new object[,]
                {
                    { 1, "República Dominicana" },
                    { 2, "Estados Unidos" }
                });

            migrationBuilder.InsertData(
                table: "Rol",
                columns: new[] { "rol_id", "descripcion_rol", "nombre_rol" },
                values: new object[,]
                {
                    { 1, "Propietario", "Propietario" },
                    { 2, "Administrador", "Administrador" },
                    { 3, "Encargado Operacional", "Encargado Operacional" },
                    { 4, "Vendedor", "Vendedor" },
                    { 5, "Suplidor", "Suplidor" },
                    { 6, "Beneficiario", "Beneficiario" }
                });

            migrationBuilder.InsertData(
                table: "Provincia",
                columns: new[] { "provincia_id", "nombre_provincia", "pais_id" },
                values: new object[,]
                {
                    { 1, "Santo Domingo", 1 },
                    { 2, "Santiago", 1 },
                    { 3, "California", 2 },
                    { 4, "Texas", 2 }
                });

            migrationBuilder.InsertData(
                table: "Ciudad",
                columns: new[] { "ciudad_id", "nombre_ciudad", "provincia_id" },
                values: new object[,]
                {
                    { 1, "Distrito Nacional", 1 },
                    { 2, "Santo Domingo Este", 1 },
                    { 3, "Santiago de los Caballeros", 2 },
                    { 4, "Tamboril", 2 },
                    { 5, "Los Ángeles", 3 },
                    { 6, "San Francisco", 3 },
                    { 7, "Houston", 4 },
                    { 8, "Dallas", 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ciudad_provincia_id",
                table: "Ciudad",
                column: "provincia_id");

            migrationBuilder.CreateIndex(
                name: "IX_PersonaRelacionada_ciudad_id",
                table: "PersonaRelacionada",
                column: "ciudad_id");

            migrationBuilder.CreateIndex(
                name: "IX_PersonaRelacionada_entidad_bancaria_id",
                table: "PersonaRelacionada",
                column: "entidad_bancaria_id");

            migrationBuilder.CreateIndex(
                name: "IX_PersonaRelacionada_persona_id",
                table: "PersonaRelacionada",
                column: "persona_id");

            migrationBuilder.CreateIndex(
                name: "IX_PersonaRelacionadaRol_rolesrol_id",
                table: "PersonaRelacionadaRol",
                column: "rolesrol_id");

            migrationBuilder.CreateIndex(
                name: "IX_Provincia_pais_id",
                table: "Provincia",
                column: "pais_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PersonaRelacionadaRol");

            migrationBuilder.DropTable(
                name: "PersonaRelacionada");

            migrationBuilder.DropTable(
                name: "Rol");

            migrationBuilder.DropTable(
                name: "Ciudad");

            migrationBuilder.DropTable(
                name: "EntidadBancaria");

            migrationBuilder.DropTable(
                name: "Provincia");

            migrationBuilder.DropTable(
                name: "Pais");
        }
    }
}
