package medicamentos.entities;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="medicos")
public class Medico implements Serializable{/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	 @Id
		@Column(name="numero_colegiado")
	    private Integer numeroColegiado;
	    private String especialidad;
	    @OneToOne
	    @JoinColumn(name="id_usuario")
	    private Usuario usuario;
	    
	    
	   
}
