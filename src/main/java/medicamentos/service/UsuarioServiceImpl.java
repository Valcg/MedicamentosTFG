package medicamentos.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mapping.AccessOptions.SetOptions.Propagation;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import medicamentos.entities.Enabled;
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
	//@Transactional()
	public String alta2(UsuarioDto usuarioDTO) {
	    try {
	        // Validar que el tipo de usuario sea válido
	        TipoUsuario tipoUsuario = usuarioDTO.getTipoUsuario();
	        
	        if (tipoUsuario == null) {
	            return "Error: Tipo de usuario no especificado.";
	        }

	        // Insertar el usuario en la tabla de usuarios
	        Usuario usuario = new Usuario();
	        usuario.setNombre(usuarioDTO.getNombre());
	        usuario.setApellido(usuarioDTO.getApellido());
	        usuario.setContrasena(usuarioDTO.getContrasena());
	        usuario.setDni(usuarioDTO.getDni());
	        usuario.setCorreo(usuarioDTO.getCorreo());
	        usuario.setTipoUsuario(tipoUsuario);
	        usuario.setEnabled(Enabled.ACTIVO);

	         //Verificar si ya existe un usuario con el mismo correo
	        if (usuarioRepository.existsByCorreo(usuarioDTO.getCorreo())) {
	            return "Error: El correo ya está registrado.";
	        }


	       Usuario newUser = usuarioRepository.save(usuario); // Guardar usuario
	       

	        // Dependiendo del tipo de usuario, insertamos en la tabla correspondiente
	        switch (tipoUsuario) {
	            case PACIENTE:
	                // Asegúrate de que el usuario sea un paciente
	                Paciente paciente = new Paciente();
	                paciente.setDiagnostico(usuarioDTO.getDiagnostico());
	                paciente.setUsuario(usuario);
	                pacienteRepository.save(paciente); // Guardar paciente
	                break;

	            case MEDICO:
	                // Verificar que el número de colegiado sea válido
	      //         MedicoColegiado medicoColegiado = medicoColegiadoRepository.findById(usuarioDTO.getNumeroColegiado());
	                if (!medicoColegiadoRepository.existsById(usuarioDTO.getNumeroColegiado())) {
	                    return "Error: El número de colegiado no está registrado.";
	                }

	                Medico medico = new Medico();
	                medico.setNumeroColegiado(usuarioDTO.getNumeroColegiado());
	                medico.setEspecialidad(usuarioDTO.getEspecialidad());
	                medico.setUsuario(newUser);
	                medicoRepository.save(medico); // Guardar médico
	                break;

	            default:
	                return "Error: Tipo de usuario inválido.";
	        }

	        return "Usuario creado exitosamente.";

	    } catch (Exception e) {
	        e.printStackTrace();
	        return "Error al crear el usuario: " + e.getMessage();
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


	@Override
	public Usuario buscarPorEmail(String correo) {
		// TODO Auto-generated method stub
		return usuarioRepository.findByCorreo(correo);
	}


	



}
