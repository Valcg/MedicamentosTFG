package medicamentos.entities;

import java.io.Serializable;
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
	
	 
	@ManyToOne
    @JoinColumn(name = "id_paciente",referencedColumnName = "id_paciente")  // Aquí debe estar el nombre de la columna en Receta
    private Paciente paciente;
	 
	 @ManyToOne
	 @ToString.Exclude // ❌ Evita el ciclo infinito
	 @JoinColumn(name="id_medico", referencedColumnName = "id_medico")   
	 private Medico medico;
	 
	private String dosis;
	private int frecuencia;
	@Column(name="duracion_tratamiento")
	private String duracionTratamiento;
	
	   @ManyToMany
	   @ToString.Exclude  // ❌ Evita la recursión infinita
	    @JoinTable(
	      name = "recetas_medicamentos",  // Nombre de la tabla intermedia
	      joinColumns = @JoinColumn(name = "id_receta"),  // Clave foránea a Receta
	      inverseJoinColumns = @JoinColumn(name = "id_medicamento")  // Clave foránea a Medicamento
	    )
	    private List<Medicamento> medicamentos;
	
	@Enumerated(EnumType.STRING)
	private Caducidad caducidad;


}
