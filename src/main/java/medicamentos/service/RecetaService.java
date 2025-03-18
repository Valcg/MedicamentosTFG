package medicamentos.service;

import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.medicamentosDto.RecetaDto;

public interface RecetaService extends IntGenericoCrud<Receta, Integer>{
	
	public Receta altaReceta(RecetaDto recetaDTO);
	public long countRecetasActivas(int idPaciente, int idMedicamento);
	public Receta caducarReceta(int idReceta);
	
	
}
