package medicamentos.entities;

import java.time.LocalDateTime;

import jakarta.annotation.Generated;
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
@Table(name = "CONTACTOS_EMERGENCIA")
public class ContactoEmergencia {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contacto")
    private int idContacto;

    @ManyToOne
    @JoinColumn(name = "id_paciente",  referencedColumnName = "id_paciente")
    private Paciente paciente;
    
    private String nombre;

    private int telefono;

    @Enumerated(EnumType.STRING)
    @Column(name = "relacion_enum")
    private RelacionEnum relacionEnum;

    @Column(name = "relacion_especifica")
    private String relacionEspecifica;

    private String comentarios;
    
    private String correo;

    
    


    
}
