package medicamentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import medicamentos.entities.Medicamento;
import medicamentos.entities.PacienteMedicamento;


public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {

	boolean existsByNombreMedicamento(String nombreMedicamento);

    List<Medicamento> findByNombreMedicamentoContainingIgnoreCase(String nombreMedicamento);
    
   


}
