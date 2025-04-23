package medicamentos.service;



import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medicamentos.entities.Alerta;
import medicamentos.entities.EstadoAlerta;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.TipoAlerta;
import medicamentos.repository.AlertaRepository;

@Service
public class AlertaServiceImpl implements AlertaService {
	
	@Autowired
    private AlertaRepository alertaRepository;

	@Override
	public Alerta alta(Alerta entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Alerta modificar(Alerta entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int eliminarPorEntidad(Alerta entidad) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Alerta buscarUno(Integer codigo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Alerta> buscarTodos() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void confirmarAlerta(int idAlerta) {
		  try {
		        // Buscar la alerta por su ID
		        Alerta alerta = alertaRepository.findById(idAlerta)
		                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));

		        // Cambiar el estado de la alerta a 'confirmado'
		        alerta.setEstadoAlerta(EstadoAlerta.confirmado);
		        

		        // Guardar los cambios en la base de datos
		        alertaRepository.save(alerta);
		        
		    } catch (Exception e) {
		        throw new RuntimeException("Error al confirmar la alerta: " + e.getMessage());
		    }
		
	}
	/*
	 * public void confirmarAlerta(int idAlerta) {
    try {
        // Buscar la alerta por su ID
        Alerta alerta = alertaRepository.findById(idAlerta)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));

        // Cambiar el estado de la alerta a 'confirmado'
        alerta.setEstadoAlerta(EstadoAlerta.confirmado);
        alertaRepository.save(alerta);

        // Obtener la receta relacionada con la alerta
        Receta receta = alerta.getReceta();
        if (receta == null) {
            throw new RuntimeException("La alerta no tiene una receta asociada");
        }

        // Obtener paciente y medicamento de la receta
        Paciente paciente = receta.getPaciente();
        Medicamento medicamento = receta.getMedicamento();

        // Buscar el registro de PacienteMedicamento
        PacienteMedicamento pacienteMedicamento = pacienteMedicamentoRepository
                .findByPacienteAndMedicamento(paciente, medicamento)
                .orElseThrow(() -> new RuntimeException("No se encontró stock para el paciente y medicamento"));

        // Restar la dosis
        int nuevaCantidad = pacienteMedicamento.getCantidadDisponible() - receta.getDosis();
        pacienteMedicamento.setCantidadDisponible(nuevaCantidad);

        // Guardar los cambios
        pacienteMedicamentoRepository.save(pacienteMedicamento);

    } catch (Exception e) {
        throw new RuntimeException("Error al confirmar la alerta: " + e.getMessage());
    }
}
	 * */



    public int contarAlertasDeHoy(Paciente paciente) {
        // Obtener el inicio y fin del día actual
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioDelDia = hoy.atStartOfDay();
        LocalDateTime finDelDia = hoy.atTime(LocalTime.MAX);

        // Obtener todas las alertas del paciente
        List<Alerta> alertas = alertaRepository.findByPaciente(paciente);

        // Filtrar las alertas que están dentro del rango de hoy
        long cantidadDeAlertasDeHoy = alertas.stream()
                .filter(alerta -> !alerta.getFechaHoraAlerta().isBefore(inicioDelDia) && !alerta.getFechaHoraAlerta().isAfter(finDelDia))
                .count();

        return (int) cantidadDeAlertasDeHoy;
    }




	
}
