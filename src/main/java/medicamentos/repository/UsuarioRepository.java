package medicamentos.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Medico;
import medicamentos.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
	
	/*@Query("SELECT u FROM Usuario u JOIN Paciente p WHERE p.medicos IN :medicos")
	List<Usuario> findAllByMedicoIn(List<Medico> medicos);

*/
	@Query("SELECT u FROM Usuario u WHERE u.correo = ?1")
    Boolean existsByCorreo(String correo);

	Usuario findByCorreo(String correo);

}
