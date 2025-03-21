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
			long alertasPendientes = alertaRepository.countByMedicamentoAndPacienteAndFechaHoraAlertaAfter(medicamento,
					pacienteMedicamento.getPaciente(), LocalDateTime.now());

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
	 public boolean verificarStockPorPacienteYMedicamento(int idPaciente, int idMedicamento) {
        // Obtener el registro de paciente-medicamento
        PacienteMedicamento pacienteMedicamento = pacienteMedicamentoRepository
                .findByPacienteIdAndMedicamentoId(idPaciente, idMedicamento);
        
        // Verificar si existe el medicamento
        Optional<Medicamento> medicamentoOptional = medicamentoRepository.findById(idMedicamento);

        // Si no existe el registro o el medicamento, retornamos false
        if (pacienteMedicamento == null || !medicamentoOptional.isPresent()) {
            return false; // No se puede verificar, ya sea porque no existe la relación o el medicamento
        }

        Medicamento medicamento = medicamentoOptional.get();
        int cantidadUnidadPorCaja = medicamento.getCantidadUnidad(); // Unidades por caja
        int stockActual = pacienteMedicamento.getCantidadDisponible(); // Stock disponible en paciente

        // Verificar si el stock es menor a la mitad de una caja
        if (stockActual < cantidadUnidadPorCaja / 2) {
            // Comprobar si hay alertas pendientes para este medicamento y paciente
            long alertasPendientes = alertaRepository.countByMedicamentoAndPacienteAndFechaHoraAlertaAfter(
                    medicamento, pacienteMedicamento.getPaciente(), LocalDateTime.now());

            // Si hay alertas pendientes, crear una nueva alerta de "bajostock"
            if (alertasPendientes > 0) {
                Alerta alertaBajoStock = Alerta.builder()
                        .paciente(pacienteMedicamento.getPaciente())
                        .medicamento(medicamento)
                        .fechaHoraAlerta(LocalDateTime.now()) // Fecha de la alerta
                        .estadoAlerta(EstadoAlerta.sinConfirmar)
                        .tipoAlerta(TipoAlerta.bajo_stock)
                        .build();
                alertaRepository.save(alertaBajoStock); // Guardar la alerta
                return true; // Alerta creada y stock verificado
            }
        }

        return false; // No es necesario crear alerta, el stock es suficiente o no hay alertas pendientes
    }
}


