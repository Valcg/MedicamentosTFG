package medicamentos.medicamentosDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ResultadoVerificacionStockDTO {
	

	    private boolean alertaGenerada;
	    private boolean yaExisteAlerta;
	    private boolean stockSuficiente;
	    private Integer idAlertaGenerada; 
	    private String mensaje;

	    
	


}
