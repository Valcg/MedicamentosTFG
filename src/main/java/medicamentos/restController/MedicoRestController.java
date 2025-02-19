package medicamentos.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;
import medicamentos.service.MedicoService;
import medicamentos.service.PacienteService;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/medicos")
public class MedicoRestController {
	
	@Autowired
	private  MedicoService medicoService;
	
	
	@GetMapping("/VerMisPacientes/{numeroColegiado}")
	public ResponseEntity<List<Usuario>> VerMisPacientes(@PathVariable int numeroColegiado) {
	    List<Usuario> MisPacientes = medicoService.VerMisPacientes(numeroColegiado);
	    System.out.println("ver mis pacientes "+ MisPacientes );
	    
	    if (MisPacientes.isEmpty()) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }
	    
	    return new ResponseEntity<>(MisPacientes, HttpStatus.OK);
	}
	

}
