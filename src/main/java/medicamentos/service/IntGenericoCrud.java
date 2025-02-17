package medicamentos.service;

import java.util.List;

public interface IntGenericoCrud<E,K> {
	E alta(E entidad);
	E modificar(E entidad);
	int eliminarPorCodigo(K codigo);
	int eliminarPorEntidad(E entidad);
	E buscarUno(K codigo);
	List<E> buscarTodos();

}
