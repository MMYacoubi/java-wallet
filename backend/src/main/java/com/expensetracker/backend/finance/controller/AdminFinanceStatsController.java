package com.expensetracker.backend.finance.controller;

import com.expensetracker.backend.finance.dto.FinanceStatsResponse;
import com.expensetracker.backend.finance.service.FinanceEntryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin – Statistiken", description = "Finanzstatistiken eines Benutzers (Admin)")
@SecurityRequirement(name = "cookieAuth")
@RestController
@RequestMapping("/admin/users/{userId}/stats")
public class AdminFinanceStatsController {

    private final FinanceEntryService entryService;

    public AdminFinanceStatsController(FinanceEntryService entryService) {
        this.entryService = entryService;
    }

    @Operation(summary = "Finanzstatistiken eines Benutzers abrufen")
    @GetMapping
    public FinanceStatsResponse get(@PathVariable Long userId) {
        return entryService.getStatsForUser(userId);
    }
}
