package medicamentos.medicamentosDto;


import java.time.LocalDateTime;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import medicamentos.entities.Caducidad;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;



@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data

public class RecetaDto {
	
	    private Integer idPaciente;
	    private Integer numeroColegiado;
	    private Medicamento medicamento;
	    private Integer dosis;
	    private Integer frecuencia;
	    private Integer duracionTratamiento;

	    private String fechaInicio;


    
    @Enumerated(EnumType.STRING)
    private Caducidad caducidad; // "Caducada" o "Activa"




}
