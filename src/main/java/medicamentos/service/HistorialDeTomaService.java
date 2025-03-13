package medicamentos.service;



public interface HistorialDeTomaService extends IntGenericoCrud<HistorialDeTomaService, Integer>{

	 public boolean AceptarToma(int idAlerta);
}
