package medicamentos.entities;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

import jakarta.persistence.Column;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Data // Lombok generará los getters, setters, toString, equals, hashCode
@NoArgsConstructor // Lombok genera el constructor sin parámetros
@AllArgsConstructor // Lombok genera el constructor con parámetros
@Builder // Lombok genera el patrón Builder para crear la entidad de manera más sencilla
@Entity
@Table(name = "pacientes_medicamentos")
public class PacienteMedicamento implements Serializable{
	private static final long serialVersionUID = 1L;
	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID autoincremental
	    @Column(name = "id")
	    private Long id;


    @ManyToOne
    @JoinColumn(name = "id_paciente", referencedColumnName = "id_paciente")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_medicamento", referencedColumnName = "id_medicamento")
    private Medicamento medicamento;

    @Column(name = "cantidad_disponible")
    private Integer cantidadDisponible;

    // Getters y Setters
}



