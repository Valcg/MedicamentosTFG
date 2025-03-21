package medicamentos.restController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import medicamentos.entities.Alerta;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.PacienteMedicamento;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;
import medicamentos.service.AlertaService;
import medicamentos.service.HistorialDeTomaService;
import medicamentos.service.MedicamentoService;
import medicamentos.service.PacienteService;


@RestController
@CrossOrigin(origins="*")
@RequestMapping("/pacientes")
public class PacienteRestController {
	
	@Autowired
	private  PacienteService pacienteService;
	
	@Autowired
	private  AlertaService alertaService;
	
	@Autowired
	private  HistorialDeTomaService historialDeTomaService;
	
	@Autowired
	private  MedicamentoService medicamentoService;
	
	

	
	@GetMapping("/VerMisRecetas/{idPaciente}")
	public ResponseEntity<List<Receta>> VerMisRecetas(@PathVariable int idPaciente) {
	    List<Receta> recetas = pacienteService.VerMisRecetas(idPaciente);
	    System.out.println("ver recetas "+ recetas );
	    
	    if (recetas.isEmpty()) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }
	    
	    return new ResponseEntity<>(recetas, HttpStatus.OK);
	}
	
	@GetMapping("/VerMisRecetasACTIVAS/{idPaciente}")
	public ResponseEntity<List<Receta>> VerMisRecetasACTIVAS(@PathVariable int idPaciente) {
	    List<Receta> recetas = pacienteService.VerMisRecetasACTIVAS(idPaciente);
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
	

	
	@PostMapping("/aceptarToma/{idAlerta}")
    public ResponseEntity<String> aceptarToma(@PathVariable int idAlerta) {
        try {
            boolean resultado = historialDeTomaService.AceptarToma(idAlerta);
            
            if (resultado) {
                return new ResponseEntity<>("Toma aceptada y registrada correctamente.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("La alerta ya fue confirmada previamente.", HttpStatus.BAD_REQUEST);
            }
        } catch (RuntimeException e) {
            // Si ocurre un error, por ejemplo, receta no encontrada o problema al guardar
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // Captura otros posibles errores
            return new ResponseEntity<>("Error interno en el servidor.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	 @GetMapping("VerCantidadDeMisMedicamentos/pacientes/{idPaciente}/medicamentos/{idMedicamento}")
	    public ResponseEntity<PacienteMedicamento> getMedicamentoDisponible(@PathVariable int idPaciente, 
	                                                                        @PathVariable int idMedicamento) {
	        PacienteMedicamento pacienteMedicamento = pacienteService.verMisMedicamentosDisponibles(idPaciente, idMedicamento);
	        if (pacienteMedicamento != null) {
	            return ResponseEntity.ok(pacienteMedicamento);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    }
	 
	 @PostMapping("/{idPaciente}/medicamentos/{idMedicamento}/agregar-stock")
	    public ResponseEntity<String> agregarStockSiNecesario(
	            @PathVariable int idPaciente,
	            @PathVariable int idMedicamento,
	            @RequestParam int cantidadCajas) {

	        // Llamamos al servicio que contiene la lógica de agregar stock
	        boolean stockActualizado = medicamentoService.agregarStockSiNecesario(idPaciente, idMedicamento, cantidadCajas);

	        // Devolvemos una respuesta adecuada
	        if (stockActualizado) {
	            return ResponseEntity.ok("Stock actualizado correctamente.");
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
	                                 .body("No se actualizó el stock. Revisa las condiciones.");
	        }
	    }
	 
	 @PostMapping("/verificar-stock/{idPaciente}/{idMedicamento}")
	    public ResponseEntity<String> verificarStock(@PathVariable int idPaciente, @PathVariable int idMedicamento) {
	        try {
	            boolean stockVerificado = medicamentoService.verificarStockPorPacienteYMedicamento(idPaciente, idMedicamento);
	            
	            if (stockVerificado) {
	                return ResponseEntity.ok("Stock verificado correctamente. Se ha generado una alerta de bajostock si es necesario.");
	            } else {
	                return ResponseEntity.ok("Stock suficiente, no es necesario generar alerta.");
	            }
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al verificar stock");
	        }
	    }
}
	


