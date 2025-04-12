package medicamentos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;
import medicamentos.entities.HistorialDeToma;
import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;
import medicamentos.entities.Usuario;

public interface MedicoRepository extends JpaRepository<Medico, Integer>{
	

	@Query(value = """
		    SELECT p.* 
		    FROM pacientes p
		    JOIN usuarios u ON p.id_usuario = u.id_usuario
		    JOIN medicos_pacientes mp ON p.id_paciente = mp.id_paciente
		    WHERE mp.numero_colegiado = :numeroColegiado
		    """, nativeQuery = true)
		List<Paciente> findPacientesByMedico(int numeroColegiado);

	
	@Query("SELECT m FROM Medico m WHERE m.usuario.idUsuario = :idUsuario")
	 Medico findByIdUsuario(int idUsuario);
	
	@Query("SELECT h FROM HistorialDeToma h WHERE h.alerta.paciente.idPaciente = :idPaciente")
	List<HistorialDeToma> VerhistorialDeMisPacientes( int idPaciente);
	
	@Query("select R from Receta R where R.paciente.idPaciente = ?1 and R.medico.numeroColegiado = ?2")
	public List<Receta> VerRecetasDeMisPacientes(int idPaciente, int numeroColegiado);




}
