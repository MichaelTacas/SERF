package com.idat.serf.service;

import com.idat.serf.dto.AuthResponse;
import com.idat.serf.dto.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);
}