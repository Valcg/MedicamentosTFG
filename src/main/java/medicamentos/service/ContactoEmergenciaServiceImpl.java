package medicamentos.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import medicamentos.entities.ContactoEmergencia;
import medicamentos.repository.ContactoEmergenciaRepository;
@Service
public class ContactoEmergenciaServiceImpl implements ContactoEmergenciaService{

	 @Autowired
	    private ContactoEmergenciaRepository contactoEmergenciaRepository; 
	 
	@Override
    public ContactoEmergencia alta(ContactoEmergencia entidad) {
        try {
            return contactoEmergenciaRepository.save(entidad);
        } catch (Exception e) {
            System.err.println("Error al dar de alta el contacto de emergencia: " + e.getMessage());
            return null;
        }
    }

	 @Override
	    public ContactoEmergencia modificar(ContactoEmergencia entidad) {
	        try {
	            if (contactoEmergenciaRepository.existsById(entidad.getIdContacto())) {
	                return contactoEmergenciaRepository.save(entidad);
	            }
	        } catch (Exception e) {
	            System.err.println("Error al modificar el contacto de emergencia: " + e.getMessage());
	        }
	        return null;
	    }
	 @Override
	    public int eliminarPorCodigo(Integer codigo) {
	        try {
	            if (contactoEmergenciaRepository.existsById(codigo)) {
	                contactoEmergenciaRepository.deleteById(codigo);
	                return 1;
	            }
	        } catch (Exception e) {
	            System.err.println("Error al eliminar el contacto por código: " + e.getMessage());
	        }
	        return 0;
	    }

	    @Override
	    public int eliminarPorEntidad(ContactoEmergencia entidad) {
	        try {
	            if (entidad != null && contactoEmergenciaRepository.existsById(entidad.getIdContacto())) {
	                contactoEmergenciaRepository.delete(entidad);
	                return 1;
	            }
	        } catch (Exception e) {
	            System.err.println("Error al eliminar el contacto por entidad: " + e.getMessage());
	        }
	        return 0;
	    }

	    @Override
	    public ContactoEmergencia buscarUno(Integer codigo) {
	        try {
	            return contactoEmergenciaRepository.findById(codigo).orElse(null);
	        } catch (Exception e) {
	            System.err.println("Error al buscar el contacto por ID: " + e.getMessage());
	            return null;
	        }
	    }
	
	@Override
	public List<ContactoEmergencia> buscarTodos() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<ContactoEmergencia> buscarContactosDePacienteCorreo(String correo) {
		try {
	        return contactoEmergenciaRepository.findByPacienteUsuarioCorreo(correo);
	    } catch (Exception e) {
	        System.err.println("Error al buscar contactos por paciente: " + e.getMessage());
	        return null;
	    }

	}
}
