package com.idat.serf.mapper;

import com.idat.serf.dto.FilialRequest;
import com.idat.serf.dto.FilialResponse;
import com.idat.serf.model.Filial;
import org.springframework.stereotype.Component;

@Component
public class FilialMapper {

    public Filial toEntity(FilialRequest request) {
        Filial filial = new Filial();

        filial.setCodigo(request.getCodigo());
        filial.setNombre(request.getNombre());
        filial.setPais(request.getPais());
        filial.setCiudad(request.getCiudad());
        filial.setMonedaLocal(request.getMonedaLocal());
        filial.setActiva(request.isActiva());

        return filial;
    }

    public void actualizarEntidad(FilialRequest request, Filial filial) {
        filial.setCodigo(request.getCodigo());
        filial.setNombre(request.getNombre());
        filial.setPais(request.getPais());
        filial.setCiudad(request.getCiudad());
        filial.setMonedaLocal(request.getMonedaLocal());
        filial.setActiva(request.isActiva());
    }

    public FilialResponse toResponse(Filial filial) {
        FilialResponse response = new FilialResponse();

        response.setId(filial.getId());
        response.setCodigo(filial.getCodigo());
        response.setNombre(filial.getNombre());
        response.setPais(filial.getPais());
        response.setCiudad(filial.getCiudad());
        response.setMonedaLocal(filial.getMonedaLocal());
        response.setActiva(filial.isActiva());

        return response;
    }
}