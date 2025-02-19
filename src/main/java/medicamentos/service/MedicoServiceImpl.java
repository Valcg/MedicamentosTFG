package medicamentos.service;

import java.util.List;

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



	
}
