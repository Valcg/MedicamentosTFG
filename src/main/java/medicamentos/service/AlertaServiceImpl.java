package medicamentos.service;



import java.time.LocalDateTime;
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
	public boolean crearAlertasParaReceta(Receta receta, Paciente paciente) {
	    LocalDateTime ahora = LocalDateTime.now();
	    int frecuenciaHoras = receta.getFrecuencia(); // Se asume que es un int
	    int diasDuracion = receta.getDuracionTratamiento(); // Campo correcto
	    boolean alertasGuardadas = false;

	    // Obtenemos el medicamento asociado a la receta
	    Medicamento medicamento = receta.getMedicamento(); 

	    // Generamos las alertas para la cantidad de días del tratamiento
	    for (int i = 0; i < diasDuracion; i++) {
	        LocalDateTime fechaHoraAlerta = receta.getFechaInicio().plusDays(i); // Usa la fecha de inicio de la receta

	        // Luego generamos las alertas con la frecuencia indicada (cada X horas)
	        for (int j = 0; j < 24 / frecuenciaHoras; j++) {
	            fechaHoraAlerta = fechaHoraAlerta.plusHours(frecuenciaHoras);
	            
	            // Creamos la alerta para el único medicamento
	            Alerta alerta = new Alerta();
	            alerta.setFechaHoraAlerta(fechaHoraAlerta);
	            alerta.setPaciente(paciente);
	            alerta.setMedicamento(medicamento); // Solo un medicamento por receta
	            alerta.setEstadoAlerta(EstadoAlerta.sinConfirmar); // Asigna un estado inicial
	            alerta.setTipoAlerta(TipoAlerta.medicacion); // Tipo de alerta por medicación
	            alertaRepository.save(alerta);  // Guardamos la alerta
	            alertasGuardadas = true;
	        }
	    }
	    return alertasGuardadas;
	}


	
}
