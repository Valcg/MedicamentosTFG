package medicamentos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;
import medicamentos.repository.MedicoRepository;
import medicamentos.repository.PacienteRepository;
import medicamentos.repository.UsuarioRepository;

@Service
public class MedicoServiceImpl implements MedicoService{

	@Autowired
	private MedicoRepository medicoRepository;
	@Autowired
	private PacienteRepository pacienteRepository;
	@Autowired
	private UsuarioRepository usuarioRepository;

	
	@Override
	public Medico alta(Medico entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Medico modificar(Medico entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int eliminarPorEntidad(Medico entidad) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Medico buscarUno(Integer codigo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Medico> buscarTodos() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Usuario> VerMisPacientes(int numeroColegiado) {
		// TODO Auto-generated method stub
		return medicoRepository.findUsuariosPacientesByMedico(numeroColegiado);
	}

	@Override
	public Medico buscarPorIdUsuario(int idUsuario) {
		return medicoRepository.findByIdUsuario(idUsuario);

	}

	@Override
	public Boolean asociarPacienteAMedico(String correoPaciente, int numeroColegiado) {
		 // Buscar al médico por su número de colegiado
	    Optional<Medico> medicoOpt = medicoRepository.findById(numeroColegiado);
	    if (medicoOpt.isEmpty()) {
	        throw new RuntimeException("El médico no existe.");
	    }
	    correoPaciente = correoPaciente.trim();
	    System.out.println("Correo a buscar: " + correoPaciente); 
	    // Buscar al paciente por su correo electrónico
	    Optional<Paciente> pacienteOpt = pacienteRepository.findByCorreo(correoPaciente);
	    if (pacienteOpt.isEmpty()) {
	        throw new RuntimeException("No se encontró un paciente con ese correo.");
	    }

	    Medico medico = medicoOpt.get();
	    Paciente paciente = pacienteOpt.get();

	    // Verificar si la relación ya existe
	    if (paciente.getMedicos().contains(medico)) {
	        throw new RuntimeException("El paciente ya está asociado a este médico.");
	    }

	    // Asociar paciente al médico
	    paciente.getMedicos().add(medico);
	    pacienteRepository.save(paciente); // Guardar los cambios en el paciente
	    
	    return true;
	}



	
}
