package medicamentos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Usuario;

public interface MedicoRepository extends JpaRepository<Medico, Integer>{
	
/*
	@Query("select p from Paciente p join p.medicos m where m.idMedico = ?1")
	List<Paciente> findPacientesByMedicoId(int idMedico);

*/

}
