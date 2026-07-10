package com.expensetracker.backend.auth.controller;

import com.expensetracker.backend.auth.dto.AdminUserResponse;
import com.expensetracker.backend.auth.dto.LockUpdateRequest;
import com.expensetracker.backend.auth.dto.RoleUpdateRequest;
import com.expensetracker.backend.auth.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin – Benutzer", description = "Benutzerverwaltung für Admins")
@SecurityRequirement(name = "cookieAuth")
@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @Operation(summary = "Alle Benutzer auflisten")
    @GetMapping
    public List<AdminUserResponse> list() {
        return adminUserService.listUsers();
    }

    @Operation(summary = "Rolle eines Benutzers ändern")
    @PutMapping("/{id}/role")
    public AdminUserResponse updateRole(Authentication authentication,
                                        @PathVariable Long id,
                                        @RequestBody RoleUpdateRequest request) {
        return adminUserService.updateRole(authentication.getName(), id, request.role());
    }

    @Operation(summary = "Benutzer sperren oder entsperren")
    @PutMapping("/{id}/lock")
    public AdminUserResponse updateLock(Authentication authentication,
                                        @PathVariable Long id,
                                        @RequestBody LockUpdateRequest request) {
        return adminUserService.updateLocked(authentication.getName(), id, request.locked());
    }
}
