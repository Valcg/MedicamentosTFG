package medicamentos.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import medicamentos.entities.Alerta;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Paciente;

public interface AlertaRepository extends JpaRepository<Alerta, Integer>{
	
	@Query("SELECT COUNT(a) FROM Alerta a WHERE a.medicamento = :medicamento AND a.paciente = :paciente AND a.fechaHoraAlerta > :fechaActual AND a.estadoAlerta = 'sinConfirmar'")
	long countByMedicamentoAndPacienteAndFechaHoraAlertaAfter(@Param("medicamento") Medicamento medicamento, 
	                                                          @Param("paciente") Paciente paciente, 
	                                                          @Param("fechaActual") LocalDateTime fechaActual);

	

}
