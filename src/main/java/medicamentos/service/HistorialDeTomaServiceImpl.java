package medicamentos.service;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class HistorialDeTomaServiceImpl implements HistorialDeTomaService{

	@Override
	public HistorialDeTomaService alta(HistorialDeTomaService entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public HistorialDeTomaService modificar(HistorialDeTomaService entidad) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int eliminarPorCodigo(Integer codigo) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int eliminarPorEntidad(HistorialDeTomaService entidad) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public HistorialDeTomaService buscarUno(Integer codigo) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<HistorialDeTomaService> buscarTodos() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean AceptarToma(int idAlerta) {
		// TODO Auto-generated method stub
		return false;
	}

}
