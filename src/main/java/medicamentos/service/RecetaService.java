package medicamentos.service;

import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.medicamentosDto.RecetaDto;

public interface RecetaService extends IntGenericoCrud<Receta, Integer>{
	
	public Receta altaReceta(RecetaDto recetaDTO);
	
}
