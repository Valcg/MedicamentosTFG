package medicamentos.entities;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@Table(name="Pacientes")
public class Paciente implements Serializable{/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_paciente")
	private int idPaciente;
	private String diagnostico;

@ManyToMany
@ToString.Exclude  
@JsonBackReference
	
	@JoinTable(
			// aqui le digo como se conforma la tabla intermedia
		name="medicos_pacientes"
		, joinColumns={
			@JoinColumn(name="id_paciente")
			}
		, inverseJoinColumns={
			@JoinColumn(name="id_medico")
			}
		)
		private List<Medico> medicos;

    
    
    
    /*
    @ManyToMany
    @JoinTable(
      name = "FAMILIARES_PACIENTES",  // Nombre de la tabla intermedia
      joinColumns = @JoinColumn(name = "id_paciente"),  // Clave foránea a Paciente
      inverseJoinColumns = @JoinColumn(name = "id_familiar") // Clave foránea a Familiar
    )
    private List<Familiar> familiares;*/

}
