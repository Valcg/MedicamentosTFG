package medicamentos.service;

import medicamentos.entities.Alerta;
import medicamentos.entities.Paciente;
import medicamentos.entities.Receta;

public interface AlertaService extends IntGenericoCrud<Alerta, Integer>{

	public void confirmarAlerta(int idAlerta);
	
	public int contarAlertasDeHoy(Paciente paciente);
	
	  boolean confirmarAlertaBajoStock(int idAlerta);
	   boolean posponerAlertaBajoStock(int idAlerta);
	   public Alerta buscarAlertaBajoStockExistente(int idPaciente, int idMedicamento);

}
