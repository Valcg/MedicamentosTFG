package medicamentos.restController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import medicamentos.entities.Enabled;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.TipoUsuario;
import medicamentos.entities.Usuario;
import medicamentos.medicamentosDto.UsuarioDto;
import medicamentos.service.MedicoService;
import medicamentos.service.PacienteService;
import medicamentos.service.UsuarioService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/usuarios")
public class UsuarioRestController {
	
	@Autowired 
	private UsuarioService usuarioService;
	@Autowired 
	private MedicoService medicoService;
	@Autowired 
	private PacienteService pacienteService;
	
	@PutMapping("/modificar")
	public ResponseEntity<?> modificar(@RequestBody Usuario usuario) {
	    Usuario usuarioModificado = usuarioService.modificar(usuario);

	    if (usuarioModificado != null) {
	        return new ResponseEntity<Usuario>(usuarioModificado, HttpStatus.OK);
	    } else {
	        return new ResponseEntity<String>("Modificación no realizada", HttpStatus.BAD_REQUEST);
	    }
	}

	@PutMapping("/desactivar")
	public ResponseEntity<?> cancelar(@RequestBody Usuario usuario){
		Usuario usuarioCancelado = usuarioService.buscarUno(usuario.getIdUsuario());
		if(usuarioCancelado != null) {
			  usuarioCancelado.setEnabled(Enabled.DESACTIVO);
		        usuarioService.modificar(usuarioCancelado);
		        
		        // Devolver el usuario desactivado
		        return new ResponseEntity<>(usuarioCancelado, HttpStatus.OK);
		    }
		    
		    // Si el usuario no existe, devolver un mensaje detallado
		    return new ResponseEntity<>("Usuario no encontrado o no válido", HttpStatus.NOT_FOUND);
		}
	
	    @PostMapping("/alta2")
	    public ResponseEntity<String> altaUsuario(@RequestBody UsuarioDto usuarioDTO) {
	        // Llamar al servicio para crear el usuario
	        String resultado = usuarioService.alta2(usuarioDTO);

	        // Retornar el resultado aclientel cliente
	        if ("Usuario creado exitosamente.".equals(resultado)) {
	            return ResponseEntity.ok(resultado); // Retorna 200 OK con mensaje de éxito
	        } else {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resultado); // Retorna 400 Bad Request en caso de error
	        }
	    }
	    
	    
	    @GetMapping("/inicioSesion")
	    public ResponseEntity<?> iniciarSesion(@RequestBody Usuario usuario) {
	        Usuario usuario1 = usuarioService.buscarPorEmail(usuario.getCorreo());
	        
	        if (usuario1 == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	        }
	        
	        if (!usuario1.getContrasena().equals(usuario.getContrasena())) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
	        }
	       
	        
	        usuario1.setContrasena(null);
	        

	        switch (usuario1.getTipoUsuario()) {
	        case PACIENTE:
	            Paciente paciente = pacienteService.buscarPorIdUsuario(usuario1.getIdUsuario());
	            if (paciente != null) {
	                // Devuelve el id del paciente
	                return ResponseEntity.ok(paciente.getIdPaciente());
	            } else {
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Paciente no encontrado");
	            }

	        case MEDICO:
	            Medico medico = medicoService.buscarPorIdUsuario(usuario1.getIdUsuario());
	            if (medico != null) {
	                // Devuelve el numero de colegiado del médico
	                return ResponseEntity.ok(medico.getNumeroColegiado());
	            } else {
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Médico no encontrado");
	            }

	        default:
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tipo de usuario desconocido");
	        }
	    }


	}




