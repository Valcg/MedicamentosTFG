package medicamentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import medicamentos.entities.Alerta;
import medicamentos.entities.HistorialDeToma;

public interface HistorialDeTomaRepository extends JpaRepository<HistorialDeToma, Integer> {

}
