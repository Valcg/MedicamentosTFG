package medicamentos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import medicamentos.entities.MedicoColegiado;


public interface MedicoColegiadoRepository extends JpaRepository<MedicoColegiado, Integer>{

	Optional<MedicoColegiado> findByNumeroColegiado(int numeroColegiado);

}
