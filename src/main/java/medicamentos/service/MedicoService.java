package medicamentos.service;

import java.util.List;

import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;

public interface MedicoService  extends IntGenericoCrud<Medico, Integer> {
	
	List<Usuario> VerMisPacientes(int idMedico);
	


}
