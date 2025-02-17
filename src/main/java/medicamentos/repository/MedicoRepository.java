package medicamentos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Usuario;

public interface MedicoRepository extends JpaRepository<Medico, Integer>{
	
	
	@Query("SELECT u FROM Usuario u JOIN u.paciente p WHERE u.medico.idReferenciaMedico = ?1")
	List<Usuario> findPacientesByMedicoId(int idMedico);

}
