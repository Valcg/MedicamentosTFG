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



	
}
