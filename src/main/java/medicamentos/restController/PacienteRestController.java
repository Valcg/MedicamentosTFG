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

import medicamentos.entities.Alerta;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;
import medicamentos.service.PacienteService;


@RestController
@CrossOrigin(origins="*")
@RequestMapping("/pacientes")
public class PacienteRestController {
	
	@Autowired
	private  PacienteService pacienteService;
	
	
	@GetMapping("/VerMisRecetas/{idPaciente}")
	public ResponseEntity<List<Receta>> VerMisRecetas(@PathVariable int idPaciente) {
	    List<Receta> recetas = pacienteService.VerMisRecetas(idPaciente);
	    System.out.println("ver recetas "+ recetas );
	    
	    if (recetas.isEmpty()) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }
	    
	    return new ResponseEntity<>(recetas, HttpStatus.OK);
	}
	
	@GetMapping("/Vermihistorial/{idPaciente}")
	public ResponseEntity<List<HistorialDeToma>> Vermihistorial(@PathVariable int idPaciente) {
	    List<HistorialDeToma> historialDeToma = pacienteService.VerMihistorial(idPaciente);
	    System.out.println("ver historial "+ historialDeToma );
	    
	    if (historialDeToma.isEmpty()) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }
	    
	    return new ResponseEntity<>(historialDeToma, HttpStatus.OK);
	}
	
	@GetMapping("/VermisAlertas/{idPaciente}")
	public ResponseEntity<List<Alerta>> VermisAlertas(@PathVariable int idPaciente) {
	    List<Alerta> alertas = pacienteService.VerMisAlertas(idPaciente);
	    System.out.println("ver alertas "+ alertas );
	    
	    if (alertas.isEmpty()) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }
	    
	    return new ResponseEntity<>(alertas, HttpStatus.OK);
	}
	
	@GetMapping("/VermisMedicos/{idPaciente}")
	public ResponseEntity<List<Medico>> obtenerMedicosDePaciente(@PathVariable int idPaciente) {
	    List<Medico> medicos = pacienteService.obtenerMedicosPorPaciente(idPaciente);
	    System.out.println("ver medicos "+ medicos );
	    
	    if (medicos.isEmpty()) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }
	    
	    return new ResponseEntity<>(medicos, HttpStatus.OK);
	}
	
	@GetMapping("/VerMiPerfilPaciente/{idPaciente}")
	public ResponseEntity<Paciente> VerMiPerfil(@PathVariable int idPaciente) {
	    Paciente paciente = pacienteService.VerMiPerfilPaciente(idPaciente);
	    System.out.println("Ver mi perfil: " + paciente);

	    if (paciente == null) {
	        return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Si no se encuentra al paciente
	    }

	    return new ResponseEntity<>(paciente, HttpStatus.OK);  // Si se encuentra al paciente
	}
	
	
	

}
