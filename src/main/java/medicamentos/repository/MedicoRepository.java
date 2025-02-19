package medicamentos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Medico;
import medicamentos.entities.Paciente;
import medicamentos.entities.Usuario;

public interface MedicoRepository extends JpaRepository<Medico, Integer>{
	

	@Query(value = """
		    SELECT u.* 
		    FROM usuarios u
		    JOIN pacientes p ON u.id_usuario = p.id_usuario
		    JOIN medicos_pacientes mp ON p.id_paciente = mp.id_paciente
		    JOIN medicos m ON mp.numero_colegiado = m.numero_colegiado
		    WHERE m.numero_colegiado = :numeroColegiado
		    """, nativeQuery = true)
		List<Usuario> findUsuariosPacientesByMedico(int numeroColegiado);



}
