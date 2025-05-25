package medicamentos.service;



import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import medicamentos.entities.Alerta;
import medicamentos.entities.EstadoAlerta;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.TipoAlerta;
import medicamentos.repository.AlertaRepository;
import medicamentos.repository.HistorialDeTomaRepository;
import medicamentos.repository.MedicamentoRepository;
import medicamentos.repository.PacienteRepository;

@Service
public class AlertaServiceImpl implements AlertaService {
	
	@Autowired
    private AlertaRepository alertaRepository;
	

	@Autowired
    private PacienteRepository pacienteRepository;
	
	@Autowired
    private MedicamentoRepository medicamentoRepository;
	
	@Autowired
    private HistorialDeTomaRepository historialDeTomaRepository;


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

	
    @Override
    @Transactional
    public boolean confirmarAlertaBajoStock(int idAlerta) {
        try {
            System.out.println("Intentando confirmar alerta con ID: " + idAlerta);
            Alerta alerta = alertaRepository.findById(idAlerta)
                    .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));

            System.out.println("Tipo de alerta: " + alerta.getTipoAlerta());
            System.out.println("Estado actual de la alerta: " + alerta.getEstadoAlerta());

            if (alerta.getTipoAlerta() == TipoAlerta.bajo_stock &&
                alerta.getEstadoAlerta() != EstadoAlerta.confirmado) {

                // Verificamos si ya hay una entrada en el historial para esta alerta
                boolean yaRegistrada = historialDeTomaRepository.existsByAlerta(alerta);

                if (!yaRegistrada) {
                    // Confirmar la alerta
                    alerta.setEstadoAlerta(EstadoAlerta.confirmado);
                    alertaRepository.save(alerta);
                    System.out.println("Alerta confirmada con éxito.");

                    // Crear nueva entrada en el historial de tomas
                    HistorialDeToma nuevaToma = HistorialDeToma.builder()
                            .paciente(alerta.getPaciente())
                            .fechaHoraToma(LocalDateTime.now())
                            .alerta(alerta)
                            .build();

                    historialDeTomaRepository.save(nuevaToma);
                    System.out.println("Historial de toma registrado para alerta de bajo stock.");
                } else {
                    System.out.println("La alerta ya fue registrada previamente en el historial.");
                }

                return true;
            }

            System.out.println("No se cumplen las condiciones para confirmar la alerta.");
            return false;
        } catch (Exception e) {
            System.err.println("Error al confirmar la alerta: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

	/* @Override
	 @Transactional
	 public boolean confirmarAlertaBajoStock(int idAlerta) {
	     try {
	         System.out.println("Intentando confirmar alerta con ID: " + idAlerta);
	         Alerta alerta = alertaRepository.findById(idAlerta)
	                 .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));

	         System.out.println("Tipo de alerta: " + alerta.getTipoAlerta());
	         System.out.println("Estado actual de la alerta: " + alerta.getEstadoAlerta());

	         if (alerta.getTipoAlerta() == TipoAlerta.bajo_stock &&
	             alerta.getEstadoAlerta() != EstadoAlerta.confirmado) {

	             alerta.setEstadoAlerta(EstadoAlerta.confirmado);
	             alertaRepository.save(alerta);
	             System.out.println("Alerta confirmada con éxito.");
	             return true;
	         }

	         System.out.println("No se cumplen las condiciones para confirmar la alerta.");
	         return false;
	     } catch (Exception e) {
	         System.err.println("Error al confirmar la alerta: " + e.getMessage());
	         e.printStackTrace();
	         return false;
	     }
	 }*/


	@Override
	public Alerta buscarAlertaBajoStockExistente(int idPaciente, int idMedicamento) {
	    try {
	        Paciente paciente = pacienteRepository.findById(idPaciente).orElse(null);
	        Medicamento medicamento = medicamentoRepository.findById(idMedicamento).orElse(null);

	        if (paciente == null || medicamento == null) {
	            return null;
	        }

	        // Buscar alerta sin confirmar y de tipo bajo_stock
	        return alertaRepository.findAlertasBajoStock(
	                paciente,
	                medicamento,
	                EstadoAlerta.sinConfirmar,
	                TipoAlerta.bajo_stock
	        );

	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	}








	
}
