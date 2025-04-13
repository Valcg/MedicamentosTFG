package medicamentos.service;

import java.util.List;

import medicamentos.entities.Alerta;
import medicamentos.entities.ContactoEmergencia;

public interface ContactoEmergenciaService extends IntGenericoCrud<ContactoEmergencia, Integer> {

	List<ContactoEmergencia> buscarContactosDePacienteCorreo(String correo);

}
