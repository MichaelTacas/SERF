package com.idat.serf.patterns.composite;

import java.util.ArrayList;
import java.util.List;

public class SeccionReporte implements ComponenteReporte {

    private final String titulo;
    private final List<ComponenteReporte> componentes;

    public SeccionReporte(String titulo) {
        this.titulo = titulo;
        this.componentes = new ArrayList<>();
    }

    public void agregar(ComponenteReporte componente) {
        componentes.add(componente);
    }

    public void eliminar(ComponenteReporte componente) {
        componentes.remove(componente);
    }

    public List<ComponenteReporte> getComponentes() {
        return new ArrayList<>(componentes);
    }

    @Override
    public String generarContenido() {

        StringBuilder resultado = new StringBuilder();

        resultado.append(titulo)
                .append("\n");

        for (ComponenteReporte componente : componentes) {

            resultado.append("  ")
                    .append(
                            componente
                                    .generarContenido()
                                    .replace("\n", "\n  ")
                    )
                    .append("\n");
        }

        return resultado.toString();
    }

    public String getTitulo() {
        return titulo;
    }
}