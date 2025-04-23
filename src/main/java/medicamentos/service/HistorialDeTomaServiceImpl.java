package medicamentos.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import medicamentos.entities.Alerta;
import medicamentos.entities.Caducidad;
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
	@Transactional
	@Override
	public boolean AceptarToma(int idAlerta) {
		System.out.println("entrnado al metodo");
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
	        System.out.println("receta" + receta);

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
	        System.out.println("medicamentos disponibles"+ pacienteMedicamento);
	        
	        if (pacienteMedicamento == null) {
	        	System.out.println("No se encontró el medicamento en stock para este paciente.");
	            throw new RuntimeException("No se encontró el medicamento en stock para este paciente.");
	        }
	        	int cantidadNueva = pacienteMedicamento.getCantidadDisponible() - dosisRecetada;
	        	System.out.println("nueva cantidad resta"+cantidadNueva);
	        pacienteMedicamento.setCantidadDisponible(cantidadNueva);
	        pacienteMedicamentoRepository.save(pacienteMedicamento);

	        // Marcar la alerta como confirmada después de realizar todas las acciones
	        alerta.setEstadoAlerta(EstadoAlerta.confirmado);
	        alertaRepository.save(alerta);
	        
	        // Contar las alertas pendientes para este medicamento y paciente
	        long alertasPendientes = alertaRepository.countByMedicamentoAndPacienteAndFechaHoraAlertaAfter(
	                alerta.getMedicamento(),
	                alerta.getPaciente(),
	                LocalDateTime.now()
	        );

	        // Si no hay más alertas pendientes, caducar la receta
	        if (alertasPendientes == 0) {
	        	 receta.setCaducidad(Caducidad.Caducada);
	            recetaRepository.save(receta);
	        }

	        return true; // Todo salió bien
	    } catch (Exception e) {
	        e.printStackTrace(); // Agregar el stacktrace para depurar mejor
	        return false; // Algo falló
	    }
	}
	
	
	@Transactional
	@Override
	public boolean confirmarTomaDesdeHistorial(int idAlerta) {
	    try {
	        // Buscar la alerta
	        Alerta alerta = alertaRepository.findById(idAlerta)
	                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));

	        // Verificar si ya fue confirmada
	        if (alerta.getEstadoAlerta() == EstadoAlerta.confirmado) {
	            return false; // Ya estaba confirmada
	        }

	        // Marcar la alerta como confirmada (aunque fue tarde)
	        alerta.setEstadoAlerta(EstadoAlerta.confirmadaTarde);
	        alertaRepository.save(alerta);

	        // Buscar receta activa
	        Receta receta = recetaRepository.findByPacienteIdAndMedicamentoIdAndCaducidadActiva(
	                alerta.getPaciente().getIdPaciente(),
	                alerta.getMedicamento().getIdMedicamento()
	        );

	        if (receta == null) {
	            throw new RuntimeException("No se encontró receta activa para este medicamento y paciente");
	        }

	        // Buscar stock del paciente
	        PacienteMedicamento pacienteMedicamento = pacienteMedicamentoRepository
	                .VermismedicamentosDisponibles(
	                        alerta.getPaciente().getIdPaciente(),
	                        alerta.getMedicamento().getIdMedicamento()
	                );

	        if (pacienteMedicamento == null) {
	            throw new RuntimeException("No se encontró stock del paciente para este medicamento");
	        }

	        // Restar dosis
	        int cantidadNueva = pacienteMedicamento.getCantidadDisponible() - receta.getDosis();
	        pacienteMedicamento.setCantidadDisponible(cantidadNueva);
	        pacienteMedicamentoRepository.save(pacienteMedicamento);
	        
	     // Contar las alertas pendientes para este medicamento y paciente
	        long alertasPendientes = alertaRepository.countByMedicamentoAndPacienteAndFechaHoraAlertaAfter(
	                alerta.getMedicamento(),
	                alerta.getPaciente(),
	                LocalDateTime.now()
	        );

	        // Si no hay más alertas pendientes, caducar la receta
	        if (alertasPendientes == 0) {
	            receta.setCaducidad(Caducidad.Caducada);
	            recetaRepository.save(receta);
	        }

	        return true;

	    } catch (Exception e) {
	        e.printStackTrace();
	        return false;
	    }
	}
	
	@Transactional
	public void registrarTomasNoConfirmadas() {
	    LocalDateTime ahora = LocalDateTime.now();

	    // Buscar alertas pasadas que no se han confirmado
	    List<Alerta> alertasVencidas = alertaRepository
	            .findByEstadoAlertaAndFechaHoraAlertaBefore(EstadoAlerta.sinConfirmar, ahora);

	    for (Alerta alerta : alertasVencidas) {
	        // Verificar si ya existe una entrada en el historial para evitar duplicados
	        boolean yaRegistrada = historialTomasRepository.existsByAlerta(alerta);

	        if (!yaRegistrada) {
	            // Insertar en historial como toma no confirmada
	            HistorialDeToma tomaNoConfirmada = HistorialDeToma.builder()
	                    .paciente(alerta.getPaciente())
	                    .alerta(alerta)
	                    .fechaHoraToma(alerta.getFechaHoraAlerta()) // Se registra la hora de la alerta
	                    .build();

	            historialTomasRepository.save(tomaNoConfirmada);

	            // (opcional) Puedes mantener el estado de la alerta como sinConfirmar o marcarla como "caducada"
	            // alerta.setEstadoAlerta(EstadoAlerta.caducada);
	            // alertaRepository.save(alerta);
	        }
	    }
	}



}

