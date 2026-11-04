package com.idat.serf.patterns.singleton;

import com.idat.serf.model.Moneda;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class ConfiguracionGlobal {

    private static final ConfiguracionGlobal INSTANCIA =
            new ConfiguracionGlobal();

    private Moneda monedaCorporativa;
    private String formatoFecha;

    // Tipos de cambio académicos configurables hacia EUR.
    private BigDecimal tipoCambioCnyEur;
    private BigDecimal tipoCambioPenEur;
    private BigDecimal tipoCambioUsdEur;

    private ConfiguracionGlobal() {

        this.monedaCorporativa = Moneda.EUR;
        this.formatoFecha = "dd/MM/yyyy";

        // Valores académicos para demostrar el funcionamiento.
        this.tipoCambioCnyEur = new BigDecimal("0.13");
        this.tipoCambioPenEur = new BigDecimal("0.23");
        this.tipoCambioUsdEur = new BigDecimal("0.92");
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

    public BigDecimal getTipoCambioCnyEur() {
        return tipoCambioCnyEur;
    }

    public void setTipoCambioCnyEur(BigDecimal tipoCambioCnyEur) {
        validarTipoCambio(tipoCambioCnyEur);
        this.tipoCambioCnyEur = tipoCambioCnyEur;
    }

    public BigDecimal getTipoCambioPenEur() {
        return tipoCambioPenEur;
    }

    public void setTipoCambioPenEur(BigDecimal tipoCambioPenEur) {
        validarTipoCambio(tipoCambioPenEur);
        this.tipoCambioPenEur = tipoCambioPenEur;
    }

    public BigDecimal getTipoCambioUsdEur() {
        return tipoCambioUsdEur;
    }

    public void setTipoCambioUsdEur(BigDecimal tipoCambioUsdEur) {
        validarTipoCambio(tipoCambioUsdEur);
        this.tipoCambioUsdEur = tipoCambioUsdEur;
    }

    private void validarTipoCambio(BigDecimal tipoCambio) {

        if (tipoCambio == null
                || tipoCambio.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "El tipo de cambio debe ser mayor a cero"
            );
        }
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

        validarTipoCambio(tipoCambio);

        return monto
                .multiply(tipoCambio)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal convertirCnyAEur(BigDecimal montoCny) {

        return convertir(
                montoCny,
                tipoCambioCnyEur
        );
    }

    public BigDecimal convertirPenAEur(BigDecimal montoPen) {

        return convertir(
                montoPen,
                tipoCambioPenEur
        );
    }

    public BigDecimal convertirUsdAEur(BigDecimal montoUsd) {

        return convertir(
                montoUsd,
                tipoCambioUsdEur
        );
    }

    public BigDecimal convertirAEur(
            BigDecimal monto,
            Moneda monedaOrigen
    ) {

        if (monto == null || monedaOrigen == null) {
            throw new IllegalArgumentException(
                    "El monto y la moneda de origen son obligatorios"
            );
        }

        return switch (monedaOrigen) {

            case EUR ->
                    monto.setScale(
                            2,
                            RoundingMode.HALF_UP
                    );

            case PEN ->
                    convertirPenAEur(monto);

            case USD ->
                    convertirUsdAEur(monto);

            case CNY ->
                    convertirCnyAEur(monto);
        };
    }
}