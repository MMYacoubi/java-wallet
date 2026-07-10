package com.expensetracker.backend.auth.service;

import com.expensetracker.backend.auth.dto.AdminUserResponse;
import com.expensetracker.backend.auth.model.Role;
import com.expensetracker.backend.auth.model.User;
import com.expensetracker.backend.auth.repository.UserRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<AdminUserResponse> listUsers() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getUsername, String.CASE_INSENSITIVE_ORDER))
                .map(AdminUserService::toResponse)
                .toList();
    }

    public AdminUserResponse updateRole(String currentUsername, Long targetId, Role newRole) {
        if (newRole == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "role is required");
        }
        User target = loadUser(targetId);
        if (target.getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot change your own role");
        }
        target.setRole(newRole);
        return toResponse(userRepository.save(target));
    }

    public AdminUserResponse updateLocked(String currentUsername, Long targetId, boolean locked) {
        User target = loadUser(targetId);
        if (target.getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot lock your own account");
        }
        target.setLocked(locked);
        return toResponse(userRepository.save(target));
    }

    private User loadUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private static AdminUserResponse toResponse(User user) {
        return new AdminUserResponse(user.getId(), user.getUsername(), user.getRole(), user.isLocked());
    }
}
