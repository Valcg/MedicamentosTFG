package medicamentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import medicamentos.entities.PacienteMedicamento;

public interface PacienteMedicamentoRepository extends JpaRepository<PacienteMedicamento, Integer>{

}
