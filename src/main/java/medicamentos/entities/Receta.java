package medicamentos.entities;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="Recetas")
public class Receta implements Serializable{/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_receta")
	private int idReceta;
	
	@Column(name="fecha_inicio")
	private LocalDateTime fechaInicio;
	 
	
	
	@ManyToOne
    @JoinColumn(name = "id_paciente",referencedColumnName = "id_paciente")  // Aquí debe estar el nombre de la columna en Receta
    private Paciente paciente;
	 
	 @ManyToOne
	 @ToString.Exclude // ❌ Evita el ciclo infinito
	 @JoinColumn(name="numero_colegiado", referencedColumnName = "numero_colegiado")   
	 private Medico medico;
	 
	private int dosis;
	private int frecuencia;
	@Column(name="duracion_tratamiento")
	private int duracionTratamiento;
	
	 @ManyToOne
	    @JoinColumn(name="id_medicamento", referencedColumnName = "id_medicamento", nullable = false) 
	    private Medicamento medicamento;
	
	@Enumerated(EnumType.STRING)
	private Caducidad caducidad;


}
