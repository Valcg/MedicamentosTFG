package medicamentos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import medicamentos.entities.Medico;
import medicamentos.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
	
	@Query("select u from Usuario u where u.medico in ?1")
	List<Usuario> findAllByMedicoIn(List<Medico> medicos);


}
