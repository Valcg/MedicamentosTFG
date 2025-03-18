package medicamentos.service;

import java.util.List;

import medicamentos.entities.Medicamento;
import medicamentos.entities.Medico;

public interface MedicamentoService extends IntGenericoCrud<Medicamento, Integer> {
	
	public List<Medicamento> buscarPorNombre(String cadenaDeTexto);

}
