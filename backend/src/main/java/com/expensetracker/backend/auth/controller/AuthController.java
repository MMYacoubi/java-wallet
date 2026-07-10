package com.expensetracker.backend.auth.controller;

import com.expensetracker.backend.auth.dto.AuthRequest;
import com.expensetracker.backend.auth.dto.MeResponse;
import com.expensetracker.backend.auth.dto.MessageResponse;
import com.expensetracker.backend.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Auth", description = "Registrierung, Login, Logout und aktueller Benutzer")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Neuen Benutzer registrieren",
            responses = {
                    @ApiResponse(responseCode = "201", description = "Erfolgreich registriert"),
                    @ApiResponse(responseCode = "400", description = "Username oder Passwort fehlt"),
                    @ApiResponse(responseCode = "409", description = "Username bereits vergeben")
            })
    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@RequestBody AuthRequest request) {
        if (request.username() == null || request.username().isBlank()
                || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Username and password required"));
        }
        if (authService.usernameExists(request.username())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new MessageResponse("Username already taken"));
        }
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Registered"));
    }

    @Operation(summary = "Einloggen (setzt Session-Cookie)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Erfolgreich eingeloggt"),
                    @ApiResponse(responseCode = "401", description = "Ungültige Zugangsdaten")
            })
    @PostMapping("/login")
    public ResponseEntity<MessageResponse> login(@RequestBody AuthRequest request,
                                                 HttpServletRequest httpRequest,
                                                 HttpServletResponse httpResponse) {
        authService.login(request, httpRequest, httpResponse);
        return ResponseEntity.ok(new MessageResponse("Logged in"));
    }

    @Operation(summary = "Ausloggen (Session invalidieren)",
            security = @SecurityRequirement(name = "cookieAuth"))
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(new MessageResponse("Logged out"));
    }

    @Operation(summary = "Aktuell eingeloggten Benutzer abrufen",
            security = @SecurityRequirement(name = "cookieAuth"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Benutzer-Daten",
                            content = @Content(schema = @Schema(implementation = MeResponse.class))),
                    @ApiResponse(responseCode = "401", description = "Nicht authentifiziert")
            })
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(authService.currentUser(authentication.getName()));
    }
}
