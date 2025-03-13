package medicamentos.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;



public interface RecetaRepository extends JpaRepository<Receta, Integer>{

	
	@Query("SELECT r FROM Receta r WHERE r.paciente.idPaciente = :idPaciente AND r.medicamento.idMedicamento = :idMedicamento AND r.caducidad = 'ACTIVA'")
	Receta findByPacienteIdAndMedicamentoIdAndCaducidadActiva(@Param("idPaciente") int idPaciente, @Param("idMedicamento") int idMedicamento);


}
