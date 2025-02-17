package medicamentos.entities;

import java.io.Serializable;
import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name="Alertas")
public class Alerta implements Serializable{
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_alerta")
	private int idAlerta;

    @ManyToOne
    @JoinColumn(name="id_paciente", referencedColumnName = "id_paciente")
    private Paciente paciente;
    
    @ManyToOne
    @JoinColumn(name="id_medicamento", referencedColumnName = "id_medicamento")
    private Medicamento medicamento;
    
	@Column(name="fecha_hora_alerta")
    private Date fechaHoraAlerta ;
    
	@Enumerated(EnumType.STRING)
	private EstadoAlerta estadoAlerta;
	
	@Enumerated(EnumType.STRING)
	private TipoAlerta tipoAlerta;
	

}
