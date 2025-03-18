package medicamentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import medicamentos.entities.Medicamento;


public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {

	boolean existsByNombreMedicamento(String nombreMedicamento);

    List<Medicamento> findByNombreMedicamentoContainingIgnoreCase(String nombreMedicamento);

}
