package medicamentos.service;



public interface HistorialDeTomaService extends IntGenericoCrud<HistorialDeTomaService, Integer>{

	 public boolean AceptarToma(int idAlerta);

	public boolean confirmarTomaDesdeHistorial(int idAlerta);
	
	public void registrarTomasNoConfirmadas();

}
