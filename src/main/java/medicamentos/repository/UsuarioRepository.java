package medicamentos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Medico;
import medicamentos.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
	
	/*@Query("SELECT u FROM Usuario u JOIN Paciente p WHERE p.medicos IN :medicos")
	List<Usuario> findAllByMedicoIn(List<Medico> medicos);

*/

}
