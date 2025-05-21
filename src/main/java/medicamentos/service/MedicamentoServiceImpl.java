package medicamentos.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medicamentos.entities.Alerta;
import medicamentos.entities.EstadoAlerta;
import medicamentos.entities.Medicamento;
import medicamentos.entities.PacienteMedicamento;
import medicamentos.entities.TipoAlerta;
import medicamentos.medicamentosDto.ResultadoVerificacionStockDTO;
import medicamentos.repository.AlertaRepository;
import medicamentos.repository.MedicamentoRepository;
import medicamentos.repository.PacienteMedicamentoRepository;

@Service
public class MedicamentoServiceImpl implements MedicamentoService {

	@Autowired
	private MedicamentoRepository medicamentoRepository;

	@Autowired
	private PacienteMedicamentoRepository pacienteMedicamentoRepository;

	@Autowired
	private AlertaRepository alertaRepository;
	
	@Autowired
	private AlertaService alertaService;

	@Override
	public Medicamento alta(Medicamento entidad) {
		// Comprobar si ya existe un medicamento con el mismo nombre
		if (medicamentoRepository.existsByNombreMedicamento(entidad.getNombreMedicamento())) {
			throw new IllegalArgumentException(
					"Ya existe un medicamento con el nombre: " + entidad.getNombreMedicamento());
		}

		// Si no existe, guardar el medicamento
		try {
			return medicamentoRepository.save(entidad);
		} catch (Exception e) { // Captura de una excepción genérica
			throw new RuntimeException("Error al guardar el medicamento: " + e.getMessage(), e);
		}
	}

	@Override
	public Medicamento modificar(Medicamento entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int eliminarPorEntidad(Medicamento entidad) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Medicamento buscarUno(Integer codigo) {
		if (medicamentoRepository.existsById(codigo)) {
			return medicamentoRepository.findById(codigo).get();
		} else {
			return null; // Devuelve null si no se encuentra
		}
	}

	@Override
	public List<Medicamento> buscarTodos() {
		return medicamentoRepository.findAll();
	}

	@Override
	public List<Medicamento> buscarPorNombre(String nombreMedicamento) {
		// TODO Auto-generated method stub
		return medicamentoRepository.findByNombreMedicamentoContainingIgnoreCase(nombreMedicamento);
	}

	@Override
	public boolean agregarStockSiNecesario(int idPaciente, int idMedicamento, int cantidadCajas) {
		PacienteMedicamento pacienteMedicamento = pacienteMedicamentoRepository
				.findByPacienteIdAndMedicamentoId(idPaciente, idMedicamento);
		Optional<Medicamento> medicamentoOptional = medicamentoRepository.findById(idMedicamento);

		// Si el stock es menor a la mitad de una caja y hay alertas pendientes
		if (pacienteMedicamento != null && medicamentoOptional.isPresent()) {
			Medicamento medicamento = medicamentoOptional.get();
			int cantidadUnidadPorCaja = medicamento.getCantidadUnidad(); // Assuming there's a method to get the
																			// quantity per box
			int stockActual = pacienteMedicamento.getCantidadDisponible();

			// If stock is less than half a box and there are pending alerts
			long alertasPendientes = alertaRepository.countByMedicamentoAndPacienteAndFechaHoraAlertaAfterAndTipoAlerta(medicamento,
					pacienteMedicamento.getPaciente(), LocalDateTime.now(), 
	    		    EstadoAlerta.sinConfirmar, 
	    		    TipoAlerta.medicacion);

// If stock is less than half a box and there are pending alerts
			if (stockActual < cantidadUnidadPorCaja / 2 && alertasPendientes > 0) {
				int cantidadNueva = cantidadCajas * cantidadUnidadPorCaja;
				pacienteMedicamento.setCantidadDisponible(stockActual + cantidadNueva);
				pacienteMedicamentoRepository.save(pacienteMedicamento);
				return true; // Stock has been updated
			}
		}

		return false; // No update necessary
	}

	
	@Override
	public ResultadoVerificacionStockDTO verificarStockPorPacienteYMedicamento(int idPaciente, int idMedicamento) {
	    ResultadoVerificacionStockDTO resultado = new ResultadoVerificacionStockDTO();

	    PacienteMedicamento pacienteMedicamento = pacienteMedicamentoRepository
	            .findByPacienteIdAndMedicamentoId(idPaciente, idMedicamento);
	    Optional<Medicamento> medicamentoOptional = medicamentoRepository.findById(idMedicamento);

	    if (pacienteMedicamento == null || !medicamentoOptional.isPresent()) {
	        resultado.setStockSuficiente(true); // No hay relación, no aplica
	        return resultado;
	    }

	    Medicamento medicamento = medicamentoOptional.get();

	    // ¿Ya existe una alerta sin confirmar?
	  
	    Alerta alertaExistente = alertaService.buscarAlertaBajoStockExistente(idPaciente, idMedicamento);
	    if (alertaExistente != null) {
	        resultado.setYaExisteAlerta(true);
	        resultado.setIdAlertaGenerada(alertaExistente.getIdAlerta());
	        resultado.setMensaje("Ya existe una alerta de bajo stock sin confirmar.");

	        return resultado;
	    }

	    int cantidadUnidadPorCaja = medicamento.getCantidadUnidad();
	    int stockActual = pacienteMedicamento.getCantidadDisponible();
	    // Verificar si el stock es bajo
	    if (stockActual < cantidadUnidadPorCaja / 2) {
	        long alertasPendientes = alertaRepository.countByMedicamentoAndPacienteAndFechaHoraAlertaAfterAndTipoAlerta(
	                medicamento,
	                pacienteMedicamento.getPaciente(),
	                LocalDateTime.now(),
	                EstadoAlerta.sinConfirmar,
	                TipoAlerta.medicacion
	        );

	        if (alertasPendientes > 0) {
	            Alerta alertaBajoStock = Alerta.builder()
	                    .paciente(pacienteMedicamento.getPaciente())
	                    .medicamento(medicamento)
	                    .fechaHoraAlerta(LocalDateTime.now())
	                    .estadoAlerta(EstadoAlerta.sinConfirmar)
	                    .tipoAlerta(TipoAlerta.bajo_stock)
	                    .build();

	            alertaRepository.save(alertaBajoStock);

	            resultado.setAlertaGenerada(true);
	            resultado.setIdAlertaGenerada(alertaBajoStock.getIdAlerta());
	            resultado.setMensaje("Se ha generado una nueva alerta de bajo stock.");

	            return resultado;
	        }
	    }

	    resultado.setStockSuficiente(true);
	    resultado.setMensaje("Stock suficiente, no es necesario generar alerta.");

	    return resultado;
	}

	/*@Override
	public boolean verificarStockPorPacienteYMedicamento(int idPaciente, int idMedicamento) {
	    // Obtener la relación paciente-medicamento
	    PacienteMedicamento pacienteMedicamento = pacienteMedicamentoRepository
	            .findByPacienteIdAndMedicamentoId(idPaciente, idMedicamento);

	    // Obtener el medicamento como Optional
	    Optional<Medicamento> medicamentoOptional = medicamentoRepository.findById(idMedicamento);

	    // Si no existe la relación o el medicamento, salimos
	    if (pacienteMedicamento == null || !medicamentoOptional.isPresent()) {
	        return false;
	    }

	    Medicamento medicamento = medicamentoOptional.get();

	    // Verificar si ya hay una alerta de bajo stock sin confirmar
	    boolean yaExisteAlerta = alertaService.buscarAlertasBajoStock(idPaciente, idMedicamento);
	    if (yaExisteAlerta) {
	        return false;
	        // Ya hay una alerta activa
	    }

	    int cantidadUnidadPorCaja = medicamento.getCantidadUnidad();
	    int stockActual = pacienteMedicamento.getCantidadDisponible();

	    // Verificar si el stock es bajo
	    if (stockActual < cantidadUnidadPorCaja / 2) {
	        // Verificar si hay alertas de medicación futuras pendientes
	    	
	    	long alertasPendientes = alertaRepository.countByMedicamentoAndPacienteAndFechaHoraAlertaAfterAndTipoAlerta(
	    		    medicamento, 
	    		    pacienteMedicamento.getPaciente(), 
	    		    LocalDateTime.now(), 
	    		    EstadoAlerta.sinConfirmar, 
	    		    TipoAlerta.medicacion
	    		);
	    	System.out.println("alertas pendeintes"+alertasPendientes);


	        // Si hay alertas de medicación pendientes, crear alerta de bajo stock
	        if (alertasPendientes > 0) {
	            Alerta alertaBajoStock = Alerta.builder()
	                    .paciente(pacienteMedicamento.getPaciente())
	                    .medicamento(medicamento)
	                    .fechaHoraAlerta(LocalDateTime.now())
	                    .estadoAlerta(EstadoAlerta.sinConfirmar)
	                    .tipoAlerta(TipoAlerta.bajo_stock)
	                    .build();
	            alertaRepository.save(alertaBajoStock);
	            return true;
	        }
	    }

	    return false; // No cumple condiciones
	}

	*/
}


