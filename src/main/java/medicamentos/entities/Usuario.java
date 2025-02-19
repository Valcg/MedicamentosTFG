package medicamentos.entities;

import java.io.Serializable;
import java.util.List;


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
@Table(name="Usuarios")
public class Usuario implements Serializable{/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_usuario")

	private int idUsuario;
	private String nombre;
	private String apellido;
	private String contrasena;
	private String dni;
	private String correo;
	@Enumerated(EnumType.STRING)
	@Column(name = "tipo_usuario") // ✅ Coincide con la BD
	private TipoUsuario tipoUsuario;
	
	@Enumerated(EnumType.STRING)
    @Column(name = "enabled") // ✅ Coincide con la BD
    private Enabled enabled;

	


}
