package medicamentos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mapping.AccessOptions.SetOptions.Propagation;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import medicamentos.entities.Medico;
import medicamentos.entities.MedicoColegiado;
import medicamentos.entities.Paciente;
import medicamentos.entities.TipoUsuario;
import medicamentos.entities.Usuario;
import medicamentos.medicamentosDto.UsuarioDto;
import medicamentos.repository.MedicoColegiadoRepository;
import medicamentos.repository.MedicoRepository;
import medicamentos.repository.PacienteRepository;
import medicamentos.repository.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService{

	@Autowired
	private UsuarioRepository usuarioRepository;
	@Autowired
	private PacienteRepository pacienteRepository;
	@Autowired
	private MedicoColegiadoRepository medicoColegiadoRepository;
	@Autowired
	private MedicoRepository medicoRepository;
	
	@Override
	@Transactional
	public String alta2(UsuarioDto usuarioDTO) {
	    try {
	    	
	            // Primero, asegurarse de que el tipo de usuario sea válido
	        TipoUsuario tipoUsuario = usuarioDTO.getTipoUsuario(); // Ya es un TipoUsuario, no es necesario llamar a valueOf

	            


	        switch (tipoUsuario) {
	            case paciente:
	                // Crear un paciente y asignar diagnóstico
	                Paciente paciente = new Paciente();
	                paciente.setDiagnostico(usuarioDTO.getDiagnostico());
	                pacienteRepository.save(paciente); // Guardar en la tabla PACIENTES

	                // Crear el usuario con la referencia al paciente
	                Usuario usuarioPaciente = new Usuario();
	                usuarioPaciente.setNombre(usuarioDTO.getNombre());
	                usuarioPaciente.setApellido(usuarioDTO.getApellido());
	                usuarioPaciente.setContrasena(usuarioDTO.getContrasena());
	                usuarioPaciente.setDni(usuarioDTO.getDni());
	                usuarioPaciente.setCorreo(usuarioDTO.getCorreo());
	                usuarioPaciente.setTipoUsuario(tipoUsuario); // Tipo paciente
	                usuarioPaciente.setIdReferenciaPaciente(paciente); // Referencia al paciente
	                usuarioPaciente.setEnabled(usuarioDTO.getEnabled());

	                usuarioRepository.save(usuarioPaciente); // Guardar el usuario con la referencia
	                break;

	            case medico:
	                // Verificar si el médico está registrado en MEDICOS_COLEGIADOS
	                Optional<MedicoColegiado> medicoColegiado = medicoColegiadoRepository.findByNumeroColegiado(usuarioDTO.getNumeroColegiado());
	                
	                if (!medicoColegiado.isPresent()) {
	                    return "Error: El número de colegiado no está registrado.";
	                }

	                // Crear un médico y asignar número de colegiado y especialidad
	                Medico medico = new Medico();
	                medico.setNumeroColegiado(usuarioDTO.getNumeroColegiado());
	                medico.setEspecialidad(usuarioDTO.getEspecialidad());
	                medicoRepository.save(medico); // Guardar en la tabla MEDICOS

	                // Crear el usuario con la referencia al médico
	                Usuario usuarioMedico = new Usuario();
	                usuarioMedico.setNombre(usuarioDTO.getNombre());
	                usuarioMedico.setApellido(usuarioDTO.getApellido());
	                usuarioMedico.setContrasena(usuarioDTO.getContrasena());
	                usuarioMedico.setDni(usuarioDTO.getDni());
	                usuarioMedico.setCorreo(usuarioDTO.getCorreo());
	                usuarioMedico.setTipoUsuario(tipoUsuario); // Tipo medico
	                usuarioMedico.setIdReferenciaMedico(medico); // Referencia al médico
	                usuarioMedico.setEnabled(usuarioDTO.getEnabled());
	                usuarioRepository.save(usuarioMedico); // Guardar el usuario con la referencia
	                break;

	            default:
	                return "Error: Tipo de usuario inválido.";
	        }

	        return "Usuario creado exitosamente.";

	    } catch (Exception e) {
	        e.printStackTrace();
	        return "Error al crear el usuario." + e.getMessage();
	    }
	}

	 
	@Override
	public Usuario alta(Usuario usuario) {
		return null;
	}


	@Override
	public Usuario modificar(Usuario entidad) {
		try {
			if (usuarioRepository.existsById(entidad.getIdUsuario())) {
				return usuarioRepository.save(entidad);
			} else {
				return null;
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		
	}

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		try {
			 
			if (usuarioRepository.existsById(codigo)) {
				usuarioRepository.deleteById(codigo);
				 return 1;
			} else {
				return 0;	
			}
			
			
			
		} catch (Exception e) {
			e.printStackTrace();
			return -1;
		}
	}

	@Override
	public int eliminarPorEntidad(Usuario entidad) {
		return eliminarPorCodigo(entidad.getIdUsuario());
	}

	@Override
	public Usuario buscarUno(Integer codigo) {
		// TODO Auto-generated method stub
		return usuarioRepository.findById(codigo).orElse(null);
	}

	@Override
	public List<Usuario> buscarTodos() {
		// TODO Auto-generated method stub
		return null;
	}




}
