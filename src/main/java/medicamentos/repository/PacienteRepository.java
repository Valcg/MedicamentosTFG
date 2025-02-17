package medicamentos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Alerta;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;


public interface PacienteRepository extends JpaRepository<Paciente, Integer>{
	
	@Query("select R from Receta R where R.paciente.idPaciente = ?1 ")
	public List<Receta> Vermisrecetas(int idPaciente);
	
	@Query("SELECT h FROM HistorialDeToma h WHERE h.alerta.paciente.idPaciente = :idPaciente")
	List<HistorialDeToma> Vermihistorial( int idPaciente);
	
	@Query("select A from Alerta A where A.paciente.idPaciente = ?1 ")
	List<Alerta> VermisAlertas( int idPaciente);
	
	@Query("""
		    SELECT u FROM Usuario u
		    JOIN Medico m ON u.medico.idReferenciaMedico = m.idMedico
		    JOIN Paciente p ON m MEMBER OF p.medicos
		    WHERE p.idPaciente = :idPaciente
		""")

	List<Usuario> VermisMedicos( int idPaciente);


}
