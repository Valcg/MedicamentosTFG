package medicamentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import medicamentos.entities.Alerta;

public interface AlertaRepository extends JpaRepository<Alerta, Integer>{

}
