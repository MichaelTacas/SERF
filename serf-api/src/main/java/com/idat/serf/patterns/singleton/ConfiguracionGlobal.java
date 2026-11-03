package com.idat.serf.patterns.singleton;

import com.idat.serf.model.Moneda;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class ConfiguracionGlobal {

    private static final ConfiguracionGlobal INSTANCIA =
            new ConfiguracionGlobal();

    private Moneda monedaCorporativa;
    private String formatoFecha;

    private ConfiguracionGlobal() {
        this.monedaCorporativa = Moneda.EUR;
        this.formatoFecha = "dd/MM/yyyy";
    }

    public static ConfiguracionGlobal getInstancia() {
        return INSTANCIA;
    }

    public Moneda getMonedaCorporativa() {
        return monedaCorporativa;
    }

    public void setMonedaCorporativa(Moneda monedaCorporativa) {
        this.monedaCorporativa = monedaCorporativa;
    }

    public String getFormatoFecha() {
        return formatoFecha;
    }

    public void setFormatoFecha(String formatoFecha) {
        this.formatoFecha = formatoFecha;
    }

    public BigDecimal convertir(
            BigDecimal monto,
            BigDecimal tipoCambio
    ) {
        if (monto == null || tipoCambio == null) {
            throw new IllegalArgumentException(
                    "El monto y el tipo de cambio son obligatorios"
            );
        }

        if (tipoCambio.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "El tipo de cambio debe ser mayor a cero"
            );
        }

        return monto.multiply(tipoCambio)
                .setScale(2, RoundingMode.HALF_UP);
    }
}