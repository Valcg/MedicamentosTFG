package medicamentos.service;

import java.util.List;

import medicamentos.entities.Alerta;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;

public interface PacienteService extends IntGenericoCrud<Paciente, Integer> {
	
	List<Receta> VerMisRecetas(int idPaciente);
	List<HistorialDeToma> VerMihistorial(int idPaciente);
	List<Alerta> VerMisAlertas(int idPaciente);
	List<Medico> obtenerMedicosPorPaciente(int idPaciente);
	Paciente VerMiPerfilPaciente(int idPaciente);
	





}
