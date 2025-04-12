package medicamentos.service;

import java.util.List;

import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;

public interface MedicoService  extends IntGenericoCrud<Medico, Integer> {
	
	List<Paciente> VerMisPacientes(int idMedico);
	Medico buscarPorIdUsuario(int idUsuario);
	Boolean asociarPacienteAMedico(String correoPaciente, int numeroColegiado) ;
	List<HistorialDeToma>VerHistorialDeMiPaciente(int idPaciente);
	Medico VerMiPerfilMedico(int nunmeroColegiado);

	



}
