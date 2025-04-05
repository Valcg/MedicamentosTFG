package medicamentos.restController;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;
import medicamentos.medicamentosDto.RecetaDto;
import medicamentos.service.HistorialDeTomaService;
import medicamentos.service.MedicamentoService;
import medicamentos.service.MedicoService;
import medicamentos.service.RecetaService;

import medicamentos.service.PacienteService;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/medicos")
public class MedicoRestController {
	
	@Autowired
	private  MedicoService medicoService;
	@Autowired
	private  PacienteService pacienteService;
	@Autowired
	private  RecetaService recetaService;
	
	@Autowired
	private  HistorialDeTomaService historialDeTomaService;
	@Autowired
	private  MedicamentoService medicamentoService;
	
	
	
	


	
	@GetMapping("/VerMisPacientes/{numeroColegiado}")
	public ResponseEntity<List<Usuario>> VerMisPacientes(@PathVariable int numeroColegiado) {
	    List<Usuario> MisPacientes = medicoService.VerMisPacientes(numeroColegiado);
	    System.out.println("ver mis pacientes "+ MisPacientes );
	    
	    if (MisPacientes.isEmpty()) {
	        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	    }
	    
	    return new ResponseEntity<>(MisPacientes, HttpStatus.OK);
	}
	
    @PostMapping("/asociarPaciente/{numeroColegiado}")
    
    public ResponseEntity<String> asociarPaciente(@RequestParam String correo,@PathVariable int numeroColegiado) {
        try {
            Boolean asociado = medicoService.asociarPacienteAMedico(correo, numeroColegiado);
            return asociado ? ResponseEntity.ok("Paciente asociado correctamente") :
                              ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo asociar el paciente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
   
    
    @GetMapping("/VerHistorialDeMisPacientes/{idPaciente}")
    public ResponseEntity<List<HistorialDeToma>> getHistorialDeToma(@PathVariable int idPaciente) {
        List<HistorialDeToma> historialDeToma = medicoService.VerHistorialDeMiPaciente(idPaciente);
        if (!historialDeToma.isEmpty()) {
            return ResponseEntity.ok(historialDeToma);
        } else {
            return ResponseEntity.noContent().build();  // 204 No Content si no hay historial
        }
    }
    
	/* RECETAS*/
	
	@PostMapping("/CrearReceta")
	public ResponseEntity<String> crearReceta(@RequestBody RecetaDto receta) {
		System.out.println(receta);
	    try {
	        Receta recetaCreada = recetaService.altaReceta(receta);
	        
	        if (recetaCreada != null) {
	            return new ResponseEntity<>("Receta creada exitosamente", HttpStatus.CREATED);
	        } else {
	            return new ResponseEntity<>("No se pudo crear la receta", HttpStatus.BAD_REQUEST);
	        }
	    } catch (Exception e) {
	        return new ResponseEntity<>("Error al crear la receta: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
	
	   @PostMapping("/CaducarReceta/{idReceta}")
	    public ResponseEntity<String> caducarReceta(@PathVariable int idReceta) {
	        try {
	            recetaService.caducarReceta(idReceta);
	            return ResponseEntity.ok("Receta caducada correctamente.");
	        } catch (IllegalStateException e) {
	            return ResponseEntity.badRequest().body(e.getMessage());
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                    .body("Error al caducar la receta: " + e.getMessage());
	        }
	    }
	   
	   /*MEDICAMENTOS*/
	   
	   @PostMapping("/AltaMedicamentos")
	    public ResponseEntity<Medicamento> altaMedicamento(@RequestBody Medicamento medicamento) {
	        Medicamento nuevoMedicamento = medicamentoService.alta(medicamento);
	        return ResponseEntity.ok(nuevoMedicamento);
	    }
	   
	  
	   @GetMapping("/BuscarTodosLosMedicamentos")
	   public ResponseEntity<List<Medicamento>> obtenerTodos(HttpServletRequest request) {
	       System.out.println("URL recibida: " + request.getRequestURL());
	       List<Medicamento> medicamentos = medicamentoService.buscarTodos();
	       if (!medicamentos.isEmpty()) {
	           return ResponseEntity.ok(medicamentos);
	       } else {
	           return ResponseEntity.noContent().build();
	       }
	   }

	   
	   @GetMapping("/BuscarUnMedicamento/{codigo}")
	    public ResponseEntity<Medicamento> obtenerMedicamento(@PathVariable Integer codigo) {
	        Medicamento medicamento = medicamentoService.buscarUno(codigo);
	        if (medicamento != null) {
	            return ResponseEntity.ok(medicamento); // Devuelve el medicamento si se encuentra
	        } else {
	            return ResponseEntity.notFound().build(); // Devuelve 404 si no se encuentra
	        }
	    }
	   @GetMapping("/BuscarUnMedicamentoPorNombre/{nombreMedicamento}")
	   public ResponseEntity<List<Medicamento>> buscarMedicamentos(@PathVariable String nombreMedicamento) {
	       List<Medicamento> medicamentos = medicamentoService.buscarPorNombre(nombreMedicamento);
	       if (!medicamentos.isEmpty()) {
	           return ResponseEntity.ok(medicamentos); // Devuelve la lista si se encuentran medicamentos
	       } else {
	           return ResponseEntity.noContent().build(); // Devuelve 204 No Content si no se encuentran resultados
	       }
	   }
	   
		 @GetMapping("/buscarPorCorreo")
		    public ResponseEntity<Paciente> buscarPorCorreo(@RequestParam String correo) {
		        Optional<Paciente> paciente = pacienteService.buscarUsuarioCorreo(correo);

		        return paciente.map(ResponseEntity::ok)
		                       .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
		    }


	}


	


