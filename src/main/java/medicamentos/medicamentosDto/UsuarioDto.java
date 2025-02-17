package medicamentos.medicamentosDto;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import medicamentos.entities.Enabled;
import medicamentos.entities.TipoUsuario;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UsuarioDto {

    private String nombre;
    private String apellido;
    private String contrasena;
    private String dni;
    private String correo;
    
    //Diz estuvo aquí


    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario")
    private TipoUsuario tipoUsuario; // Enum: "paciente" o "medico"

    @Enumerated(EnumType.STRING)
    @Column(name = "enabled")
    private Enabled enabled;  // Enum: "ACTIVO", "INACTIVO"
    private String diagnostico;        // Solo para pacientes
    private int numeroColegiado;    // Solo para médicos
    private String especialidad;       // Solo para médicos

}
