package medicamentos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medicamentos.entities.Medicamento;
import medicamentos.repository.MedicamentoRepository;


@Service
public class MedicamentoServiceImpl implements MedicamentoService {
	
	@Autowired
	private MedicamentoRepository medicamentoRepository;

	@Override
	public Medicamento alta(Medicamento entidad) {
	    // Comprobar si ya existe un medicamento con el mismo nombre
	    if (medicamentoRepository.existsByNombreMedicamento(entidad.getNombreMedicamento())) {
	        throw new IllegalArgumentException("Ya existe un medicamento con el nombre: " + entidad.getNombreMedicamento());
	    }

	    // Si no existe, guardar el medicamento
	    try {
	        return medicamentoRepository.save(entidad);
	    } catch (Exception e) {  // Captura de una excepción genérica
	        throw new RuntimeException("Error al guardar el medicamento: " + e.getMessage(), e);
	    }
	}


	@Override
	public Medicamento modificar(Medicamento entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int eliminarPorEntidad(Medicamento entidad) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public Medicamento buscarUno(Integer codigo) {
		if (medicamentoRepository.existsById(codigo)) {
	        return medicamentoRepository.findById(codigo).get();
	    } else {
	        return null; // Devuelve null si no se encuentra
	    }
	}

	@Override
	public List<Medicamento> buscarTodos() {
		   return medicamentoRepository.findAll(); 
	}


	@Override
	public List<Medicamento> buscarPorNombre(String nombreMedicamento) {
		// TODO Auto-generated method stub
        return medicamentoRepository.findByNombreMedicamentoContainingIgnoreCase(nombreMedicamento);
	}

}
