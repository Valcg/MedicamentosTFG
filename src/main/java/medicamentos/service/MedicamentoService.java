package medicamentos.service;

import java.util.List;

import medicamentos.entities.Medicamento;
import medicamentos.entities.Medico;
import medicamentos.medicamentosDto.ResultadoVerificacionStockDTO;

public interface MedicamentoService extends IntGenericoCrud<Medicamento, Integer> {
	
	public List<Medicamento> buscarPorNombre(String cadenaDeTexto);
	public boolean agregarStockSiNecesario(int idPaciente, int idMedicamento, int cantidadCajas);
	public ResultadoVerificacionStockDTO verificarStockPorPacienteYMedicamento(int idPaciente, int idMedicamento);
	
	

	
}
