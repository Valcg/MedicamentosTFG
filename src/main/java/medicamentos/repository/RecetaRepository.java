package medicamentos.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import medicamentos.entities.Receta;



public interface RecetaRepository extends JpaRepository<Receta, Integer>{

}
