package medicamentos.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Alerta;
import medicamentos.entities.Medicamento;
import medicamentos.entities.Paciente;
import medicamentos.entities.PacienteMedicamento;


public interface PacienteMedicamentoRepository extends JpaRepository<PacienteMedicamento, Integer>{

	@Query("SELECT p FROM PacienteMedicamento p WHERE p.paciente.idPaciente = :idPaciente AND p.medicamento.idMedicamento = :idMedicamento")
	public PacienteMedicamento VermismedicamentosDisponibles(int idPaciente,int idMedicamento);

    PacienteMedicamento findByPacienteAndMedicamento(Paciente paciente, Medicamento medicamento);

    @Query("SELECT pm FROM PacienteMedicamento pm WHERE pm.paciente.idPaciente = :idPaciente AND pm.medicamento.idMedicamento = :idMedicamento")
    PacienteMedicamento findByPacienteIdAndMedicamentoId(int idPaciente,int idMedicamento);
    
    
   


	
}
