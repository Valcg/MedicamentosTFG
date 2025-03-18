package medicamentos.service;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medicamentos.entities.Alerta;
import medicamentos.entities.Caducidad;
import medicamentos.entities.Enabled;
import medicamentos.entities.EstadoAlerta;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.PacienteMedicamento;
import medicamentos.entities.Receta;
import medicamentos.entities.TipoAlerta;
import medicamentos.entities.TipoUsuario;
import medicamentos.medicamentosDto.RecetaDto;
import medicamentos.repository.AlertaRepository;
import medicamentos.repository.MedicamentoRepository;
import medicamentos.repository.MedicoRepository;
import medicamentos.repository.PacienteMedicamentoRepository;
import medicamentos.repository.PacienteRepository;
import medicamentos.repository.RecetaRepository;

@Service
public class RecetaServiceImpl implements RecetaService {
	
	@Autowired
    private RecetaRepository recetaRepository;
	

	@Autowired
    private MedicamentoRepository medicamentoRepository;

	@Autowired
    private PacienteRepository pacienteRepository;

	@Autowired
    private MedicoRepository medicoRepository;
	

	@Autowired
    private PacienteMedicamentoRepository pacienteMedicamentoRepo;
	
	@Autowired
    private AlertaRepository alertaRepository;


    @Autowired
    private AlertaService alertaService;
    
  

    @Override

    public Receta alta(Receta receta) {
      
        return null;
    }


	@Override
	public Receta modificar(Receta entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int eliminarPorEntidad(Receta entidad) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Receta buscarUno(Integer codigo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Receta> buscarTodos() {
		// TODO Auto-generated method stub
		return null;
	}

	public Receta altaReceta(RecetaDto recetaDTO) {
	    try {
	        // Verificar existencia del paciente
	        Paciente paciente = pacienteRepository.findById(recetaDTO.getPaciente().getIdPaciente())
	                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

	        // Verificar existencia del médico
	        Medico medico = medicoRepository.findById(recetaDTO.getNumeroColegiado())
	                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

	        // Validar si el medicamento es nulo
	        if (recetaDTO.getMedicamento() == null) {
	            throw new RuntimeException("Medicamento no puede ser nulo");
	        }
	        
	        if (recetaRepository.countRecetasActivas(recetaDTO.getPaciente().getIdPaciente(), recetaDTO.getMedicamento().getIdMedicamento()) > 0) {
	            throw new IllegalStateException("Ya existe una receta activa para este medicamento. Por favor, caduque la anterior antes de crear una nueva.");
	        }

	        // Verificar existencia del medicamento
	        Medicamento medicamento = medicamentoRepository.findById(recetaDTO.getMedicamento().getIdMedicamento())
	                .orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

	        // Crear la receta
	        Receta receta = Receta.builder()
	                .paciente(paciente)
	                .medico(medico)
	                .medicamento(medicamento)
	                .fechaInicio(LocalDateTime.now()) // Fecha de inicio es hoy
	    	        .caducidad(Caducidad.Activa)
	    	        .dosis(recetaDTO.getDosis())
	    	        .duracionTratamiento(recetaDTO.getDuracionTratamiento())
	    	        .frecuencia(recetaDTO.getFrecuencia())
	                .build();

	        // Guardar la receta en la base de datos
	        recetaRepository.save(receta);
	        
	        PacienteMedicamento pacienteMedicamento = pacienteMedicamentoRepo.findByPacienteAndMedicamento(recetaDTO.getPaciente(),recetaDTO.getMedicamento());
	              
	        if (pacienteMedicamento == null) {
	        pacienteMedicamento = PacienteMedicamento.builder()
                    .paciente(paciente)
                    .medicamento(medicamento)
                    .cantidadDisponible(medicamento.getCantidadUnidad()) // Asignar un blíster completo al paciente
                    .build();
	        
	        }else {
	        	
	        	
	        }
	        pacienteMedicamentoRepo.save(pacienteMedicamento); 
	        
	        // Paso 2: Generar las alertas de medicación
            int dosisPorDia = 24 / recetaDTO.getFrecuencia(); // Calcular cuántas veces al día se toma el medicamento
            int totalAlertas = dosisPorDia * recetaDTO.getDuracionTratamiento(); // Total de alertas para todo el tratamiento

            // Hora de la primera alerta, basada en la hora de creación de la receta
            LocalDateTime fechaHoraAlerta = receta.getFechaInicio().plusHours(recetaDTO.getFrecuencia());

            // Generar alertas para todas las dosis
            for (int i = 0; i < totalAlertas; i++) {
                Alerta alerta = Alerta.builder()
                        .paciente(paciente)
                        .medicamento(medicamento)
                        .fechaHoraAlerta(fechaHoraAlerta)
                        .estadoAlerta(EstadoAlerta.sinConfirmar)
                        .tipoAlerta(TipoAlerta.medicacion)
                        .build();
                alertaRepository.save(alerta);

                // Incrementar la hora para la siguiente alerta
                fechaHoraAlerta = fechaHoraAlerta.plusHours(recetaDTO.getFrecuencia());
            }

            // Retornar la receta creada
            return receta;
	    } catch (Exception e) {
	        throw new RuntimeException("Error al crear la receta: " + e.getMessage());
	    }
	}


	@Override
	public long countRecetasActivas(int idPaciente, int idMedicamento) {
		// TODO Auto-generated method stub
		return recetaRepository.countRecetasActivas(idPaciente, idMedicamento);
	}


	@Override
	public Receta caducarReceta(int idReceta) {
		 Receta receta = recetaRepository.findById(idReceta)
		            .orElseThrow(() -> new RuntimeException("Receta no encontrada"));

		    // Verificar si hay alertas pendientes (futuras)
		    long alertasPendientes = alertaRepository.countByMedicamentoAndPacienteAndFechaHoraAlertaAfter(
		            receta.getMedicamento(), receta.getPaciente(), LocalDateTime.now());

		    if (alertasPendientes > 0) {
		        throw new IllegalStateException("No puede caducar la receta, aún hay alertas pendientes.");
		    }

		    receta.setCaducidad(Caducidad.Caducada);
		    return recetaRepository.save(receta);
	}

}

	

	



