package medicamentos.service;

import medicamentos.entities.Usuario;
import medicamentos.medicamentosDto.UsuarioDto;

public interface UsuarioService extends IntGenericoCrud<Usuario, Integer>{

	String alta2(UsuarioDto usuarioDTO);
	
}
