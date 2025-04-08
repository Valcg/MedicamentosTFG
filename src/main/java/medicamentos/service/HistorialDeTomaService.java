package medicamentos.service;



public interface HistorialDeTomaService extends IntGenericoCrud<HistorialDeTomaService, Integer>{

	 public boolean AceptarToma(int idAlerta);

	public boolean confirmarToma(int idAlerta);
}
