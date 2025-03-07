package medicamentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import medicamentos.entities.Medicamento;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Integer> {

}
