package medicamentos.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import medicamentos.entities.Alerta;
import medicamentos.entities.EstadoAlerta;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.PacienteMedicamento;
import medicamentos.entities.Receta;
import medicamentos.repository.AlertaRepository;
import medicamentos.repository.HistorialDeTomaRepository;
import medicamentos.repository.PacienteMedicamentoRepository;
import medicamentos.repository.RecetaRepository;

@Service
public class HistorialDeTomaServiceImpl implements HistorialDeTomaService{
	@Autowired
	private  HistorialDeTomaRepository historialTomasRepository;
	@Autowired
    private  AlertaRepository alertaRepository;
	@Autowired
    private  PacienteMedicamentoRepository pacienteMedicamentoRepository;
	@Autowired
    private  RecetaRepository recetaRepository;
    
    
	@Override
	public HistorialDeTomaService alta(HistorialDeTomaService entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public HistorialDeTomaService modificar(HistorialDeTomaService entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int eliminarPorEntidad(HistorialDeTomaService entidad) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public HistorialDeTomaService buscarUno(Integer codigo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<HistorialDeTomaService> buscarTodos() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean AceptarToma(int idAlerta) {
		try {
	        // Buscar la alerta
	        Alerta alerta = alertaRepository.findById(idAlerta)
	                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));

	        // Verificar si la alerta ya fue confirmada
	        if (alerta.getEstadoAlerta() == EstadoAlerta.confirmado) {
	            return false; // Ya estaba confirmada, no se hace nada
	        }

	        // Registrar la toma en HISTORIAL_TOMAS
	        HistorialDeToma nuevaToma = HistorialDeToma.builder()
	                .paciente(alerta.getPaciente())
	                .fechaHoraToma(LocalDateTime.now())
	                .alerta(alerta)
	                .build();
	        historialTomasRepository.save(nuevaToma);

	        // Buscar la receta asociada con el paciente y el medicamento de la alerta
	        Receta receta = recetaRepository.findByPacienteIdAndMedicamentoIdAndCaducidadActiva(
	                alerta.getPaciente().getIdPaciente(),
	                alerta.getMedicamento().getIdMedicamento()
	        );

	        if (receta == null) {
	            throw new RuntimeException("No se encontró receta para este medicamento y paciente");
	        }

	        // Si la receta está presente, descontar dosis del stock
	        int dosisRecetada = receta.getDosis();
	        System.out.println("ID Paciente: " + alerta.getPaciente().getIdPaciente());
	        System.out.println("ID Medicamento: " + alerta.getMedicamento().getIdMedicamento());

	        PacienteMedicamento pacienteMedicamento = pacienteMedicamentoRepository.VermismedicamentosDisponibles(
	                alerta.getPaciente().getIdPaciente(),
	                alerta.getMedicamento().getIdMedicamento()
	        );
	        
	        if (pacienteMedicamento == null) {
	            throw new RuntimeException("No se encontró el medicamento en stock para este paciente.");
	        }

	        pacienteMedicamento.setCantidadDisponible(pacienteMedicamento.getCantidadDisponible() - dosisRecetada);
	        pacienteMedicamentoRepository.save(pacienteMedicamento);

	        // Marcar la alerta como confirmada después de realizar todas las acciones
	        alerta.setEstadoAlerta(EstadoAlerta.confirmado);
	        alertaRepository.save(alerta);

	        return true; // Todo salió bien
	    } catch (Exception e) {
	        e.printStackTrace(); // Agregar el stacktrace para depurar mejor
	        return false; // Algo falló
	    }
	}
	
	
	@Override
	public boolean confirmarToma(int idAlerta) {
	    try {
	        // Buscar la alerta en la base de datos
	        Alerta alerta = alertaRepository.findById(idAlerta).orElse(null);
	        if (alerta != null && alerta.getEstadoAlerta() == EstadoAlerta.sinConfirmar) {
	            // Cambiar el estado de la alerta a "confirmado"
	            alerta.setEstadoAlerta(EstadoAlerta.confirmado);
	            // Guardar la alerta con el nuevo estado
	            alertaRepository.save(alerta);
	            return true; // La toma fue confirmada correctamente
	        }
	        // Si la alerta no fue encontrada o ya está confirmada
	        return false;
	    } catch (Exception e) {
	        e.printStackTrace();
	        return false; // Si ocurre un error, retornamos false
	    }
	}


}

