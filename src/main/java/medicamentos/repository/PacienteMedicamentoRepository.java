package medicamentos.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Alerta;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Paciente;
import medicamentos.entities.PacienteMedicamento;


public interface PacienteMedicamentoRepository extends JpaRepository<PacienteMedicamento, Integer>{

	@Query("select p from PacienteMedicamento p where p.paciente.idPaciente = ?1And p.medicamento.idMedicamento =?2 ")
	public PacienteMedicamento VermisedicamentosDisponibles(int idPaciente,int idMedicamento);

	
}
