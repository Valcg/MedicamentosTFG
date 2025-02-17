package medicamentos.restController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import medicamentos.entities.Enabled;
import medicamentos.entities.Usuario;
import medicamentos.medicamentosDto.UsuarioDto;
import medicamentos.service.UsuarioService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/usuarios")
public class UsuarioRestController {
	
	@Autowired 
	private UsuarioService usuarioService;
	
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

	        // Retornar el resultado al cliente
	        if ("Usuario creado exitosamente.".equals(resultado)) {
	            return ResponseEntity.ok(resultado); // Retorna 200 OK con mensaje de éxito
	        } else {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resultado); // Retorna 400 Bad Request en caso de error
	        }
	    }
	}




