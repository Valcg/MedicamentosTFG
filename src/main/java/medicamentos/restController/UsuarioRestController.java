package medicamentos.restController;

import java.nio.file.Files;
import java.nio.file.Path; // This is the correct one for file operations
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Value;

import medicamentos.entities.Enabled;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
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

	@PutMapping("/medicos/cambiarEstado")
	public ResponseEntity<?> cambiarEstadoUsuario(@RequestParam String correo, @RequestParam boolean activar) {
	    Usuario usuario = usuarioService.buscarPorEmail(correo);
	    
	    if (usuario != null) {
	        usuario.setEnabled(activar ? Enabled.ACTIVO : Enabled.DESACTIVO);
	        usuarioService.modificar(usuario);
	        
	        String estado = activar ? "activado" : "desactivado";
	        return ResponseEntity.ok("El usuario con correo " + correo + " ha sido " + estado + ".");
	    }
	    
	    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario con correo " + correo + " no encontrado.");
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
	    
	    @PostMapping("/inicioSesion")
	    public ResponseEntity<?> iniciarSesion(@RequestBody Usuario usuario) {
	        
	        // BUSCAR EL USUARIO POR SU CORREO
	        Usuario usuario1 = usuarioService.buscarPorEmail(usuario.getCorreo());
	        
	        // SI EL USUARIO NO EXISTE, DEVOLVER ERROR 404
	        if (usuario1 == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
	        }
	        
	        // SI LA CONTRASEÑA NO COINCIDE, DEVOLVER ERROR 401
	        if (!usuario1.getContrasena().equals(usuario.getContrasena())) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
	        }

	        // NO DEVOLVER LA CONTRASEÑA POR SEGURIDAD
	        usuario1.setContrasena(null);

	        // CREAR UN MAPA PARA DEVOLVER DATOS
	        Map<String, Object> respuesta = new HashMap<>();
	        respuesta.put("tipoUsuario", usuario1.getTipoUsuario().name()); // GUARDAR EL TIPO DE USUARIO COMO STRING

	        // VERIFICAR SI EL USUARIO ES PACIENTE O MÉDICO
	        switch (usuario1.getTipoUsuario()) {
	            case PACIENTE:
	                Paciente paciente = pacienteService.buscarPorIdUsuario(usuario1.getIdUsuario());
	                if (paciente != null) {
	                    respuesta.put("id", paciente.getIdPaciente()); // GUARDAR ID DEL PACIENTE
	                    return ResponseEntity.ok(respuesta); // DEVOLVER RESPUESTA EXITOSA
	                } else {
	                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Paciente no encontrado");
	                }

	            case MEDICO:
	                Medico medico = medicoService.buscarPorIdUsuario(usuario1.getIdUsuario());
	                if (medico != null) {
	                    respuesta.put("id", medico.getNumeroColegiado()); // GUARDAR NÚMERO DE COLEGIADO DEL MÉDICO
	                    return ResponseEntity.ok(respuesta); // DEVOLVER RESPUESTA EXITOSA
	                } else {
	                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Médico no encontrado");
	                }

	            default:
	                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Tipo de usuario desconocido");
	        }
	    }
	    

}





