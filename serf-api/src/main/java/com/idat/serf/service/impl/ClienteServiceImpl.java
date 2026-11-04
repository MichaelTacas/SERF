package com.idat.serf.service.impl;

import com.idat.serf.exception.RecursoNoEncontradoException;
import com.idat.serf.exception.ReglaNegocioException;
import com.idat.serf.model.Cliente;
import com.idat.serf.repository.ClienteRepository;
import com.idat.serf.repository.VentaRepository;
import com.idat.serf.service.ClienteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final VentaRepository ventaRepository;

    public ClienteServiceImpl(
            ClienteRepository clienteRepository,
            VentaRepository ventaRepository
    ) {
        this.clienteRepository = clienteRepository;
        this.ventaRepository = ventaRepository;
    }

    @Override
    public Cliente registrar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    @Override
    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente buscarPorId(Long id) {

        return clienteRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Cliente no encontrado con id: " + id
                        )
                );
    }

    @Override
    public Cliente actualizar(
            Long id,
            Cliente clienteActualizado
    ) {

        Cliente clienteExistente =
                buscarPorId(id);

        clienteExistente.setNombre(
                clienteActualizado.getNombre()
        );

        clienteExistente.setEmail(
                clienteActualizado.getEmail()
        );

        clienteExistente.setEmpresa(
                clienteActualizado.getEmpresa()
        );

        return clienteRepository.save(
                clienteExistente
        );
    }

    @Override
    public void eliminar(Long id) {

        Cliente cliente =
                buscarPorId(id);

        if (ventaRepository.existsByClienteId(id)) {

            throw new ReglaNegocioException(
                    "No se puede eliminar el cliente porque tiene ventas registradas"
            );
        }

        clienteRepository.delete(cliente);
    }
}