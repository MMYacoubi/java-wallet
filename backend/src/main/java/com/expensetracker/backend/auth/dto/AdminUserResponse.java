package com.expensetracker.backend.auth.dto;

import com.expensetracker.backend.auth.model.Role;

public record AdminUserResponse(Long id, String username, Role role, boolean locked) {
}
