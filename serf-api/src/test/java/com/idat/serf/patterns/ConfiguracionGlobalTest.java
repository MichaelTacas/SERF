package com.idat.serf.patterns;

import com.idat.serf.patterns.singleton.ConfiguracionGlobal;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertSame;

class ConfiguracionGlobalTest {

    @Test
    void debeRetornarLaMismaInstancia() {

        ConfiguracionGlobal instancia1 =
                ConfiguracionGlobal.getInstancia();

        ConfiguracionGlobal instancia2 =
                ConfiguracionGlobal.getInstancia();

        assertSame(instancia1, instancia2);
    }
}