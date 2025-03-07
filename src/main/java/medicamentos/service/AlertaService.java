package medicamentos.service;

import medicamentos.entities.Alerta;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;

public interface AlertaService extends IntGenericoCrud<Alerta, Integer>{

	boolean crearAlertasParaReceta(Receta nuevaReceta, Paciente paciente);

}
