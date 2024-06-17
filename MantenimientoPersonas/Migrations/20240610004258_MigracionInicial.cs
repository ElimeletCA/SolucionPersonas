using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MantenimientoPersonas.Migrations
{
    public partial class MigracionInicial : Migration
    {
        
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Persona",
                columns: table => new
                {
                    persona_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tipo_documento = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    numero_documento = table.Column<string>(type: "nvarchar(15)", nullable: false),
                    primer_nombre = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    segundo_nombre = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    primer_apellido = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    segundo_apellido = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    tipo_telefono = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    numero_telefono = table.Column<string>(type: "nvarchar(15)", nullable: true),
                    mayoria_edad = table.Column<bool>(type: "bit", nullable: false),
                    genero = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    estado_activo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Persona", x => x.persona_id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Persona");
        }
    }
}
