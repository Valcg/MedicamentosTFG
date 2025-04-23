package medicamentos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Alerta;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;


public interface PacienteRepository extends JpaRepository<Paciente, Integer>{
	
	@Query("SELECT R FROM Receta R WHERE R.paciente.idPaciente = ?1 ORDER BY R.fechaInicio DESC")
	public List<Receta> Vermisrecetas(int idPaciente);

	@Query("SELECT r FROM Receta r WHERE r.paciente.idPaciente = :idPaciente AND r.caducidad = 'Activa'")
	List<Receta> findRecetasActivas(int idPaciente);
	
	@Query("SELECT h FROM HistorialDeToma h WHERE h.alerta.paciente.idPaciente = :idPaciente")
	List<HistorialDeToma> Vermihistorial( int idPaciente);
	
	@Query("select A from Alerta A where A.paciente.idPaciente = ?1 ")
	List<Alerta> VermisAlertas( int idPaciente);
	
	// Método para encontrar el paciente por id
	@Query("select p from Paciente p where p.idPaciente = ?1")
	Paciente findByIdPaciente(int idPaciente);
	
	@Query("SELECT p FROM Paciente p WHERE p.usuario.idUsuario = :idUsuario")
	 Paciente findByIdUsuario(int idUsuario);

	@Query("SELECT p FROM Paciente p WHERE p.usuario.correo = ?1")	 
	Optional<Paciente> findByCorreo(String correoPaciente);
	
	
    




}
