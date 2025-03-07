package medicamentos.medicamentosDto;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import medicamentos.entities.Caducidad;
import medicamentos.entities.Medicamento;
import medicamentos.entities.TipoUsuario;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecetaDto {
	
	    private Integer idPaciente;
	    private Integer numeroColegiado;
	    private Medicamento medicamento;
	    private String dosis;
	    private Integer frecuencia;
	    private Integer duracionTratamiento;

	    private String fechaInicio;


    
    @Enumerated(EnumType.STRING)
    private Caducidad caducidad; // "Caducada" o "Activa"

}
