package medicamentos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import medicamentos.entities.ContactoEmergencia;

public interface ContactoEmergenciaRepository extends JpaRepository<ContactoEmergencia, Integer> {
	
	List<ContactoEmergencia> findByPacienteUsuarioCorreo(String correo);


}
