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

import medicamentos.entities.Caducidad;
import medicamentos.entities.Enabled;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.TipoUsuario;
import medicamentos.medicamentosDto.RecetaDto;
import medicamentos.repository.MedicamentoRepository;
import medicamentos.repository.MedicoRepository;
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
	        Paciente paciente = pacienteRepository.findById(recetaDTO.getIdPaciente())
	                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

	        // Verificar existencia del médico
	        Medico medico = medicoRepository.findById(recetaDTO.getNumeroColegiado())
	                .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

	        // Validar si el medicamento es nulo
	        if (recetaDTO.getMedicamento() == null) {
	            throw new RuntimeException("Medicamento no puede ser nulo");
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
	        return recetaRepository.save(receta);
	    } catch (Exception e) {
	        throw new RuntimeException("Error al crear la receta: " + e.getMessage());
	    }
	}

}

	

	



