package medicamentos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medicamentos.entities.Alerta;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;
import medicamentos.repository.PacienteRepository;
import medicamentos.repository.UsuarioRepository;

@Service
public class PacienteServiceImpl implements PacienteService{
	
	@Autowired
	private PacienteRepository pacienteRepository;
	@Autowired
	private UsuarioRepository usuarioRepository;


	@Override
	public Paciente alta(Paciente entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Paciente modificar(Paciente entidad) {
			return null;
	}
	

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int eliminarPorEntidad(Paciente entidad) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Paciente buscarUno(Integer codigo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Paciente> buscarTodos() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Receta> VerMisRecetas(int idPaciente) {
		return pacienteRepository.Vermisrecetas(idPaciente);
	}

	@Override
	public List<HistorialDeToma> VerMihistorial(int idPaciente) {
		return pacienteRepository.Vermihistorial(idPaciente);
	}

	@Override
	public List<Alerta> VerMisAlertas(int idPaciente) {
		return pacienteRepository.VermisAlertas(idPaciente);
	}

	@Override
	public List<Usuario> VerMisMedicos(int idPaciente) {
	    // Paso 1: Obtener el paciente
	    Paciente paciente = pacienteRepository.findByIdPaciente(idPaciente);

	    // Paso 2: Obtener la lista de médicos del paciente
	    List<Medico> medicos = paciente.getMedicos(); // Esto es de la relación ManyToMany

	    // Paso 3: Consultar a los usuarios asociados con estos médicos
	    List<Usuario> usuariosMedicos = usuarioRepository.findAllByMedicoIn(medicos);

	    return usuariosMedicos;
	}


}
