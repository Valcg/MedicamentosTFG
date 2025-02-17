package medicamentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import medicamentos.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

}
