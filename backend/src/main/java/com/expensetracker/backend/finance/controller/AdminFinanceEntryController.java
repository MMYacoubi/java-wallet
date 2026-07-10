package com.expensetracker.backend.finance.controller;

import com.expensetracker.backend.finance.dto.FinanceEntryRequest;
import com.expensetracker.backend.finance.dto.FinanceEntryResponse;
import com.expensetracker.backend.finance.service.FinanceEntryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Admin – Einträge", description = "Finanzeinträge eines beliebigen Benutzers (Admin)")
@SecurityRequirement(name = "cookieAuth")
@RestController
@RequestMapping("/admin/users/{userId}/entries")
public class AdminFinanceEntryController {

    private final FinanceEntryService entryService;

    public AdminFinanceEntryController(FinanceEntryService entryService) {
        this.entryService = entryService;
    }

    @Operation(summary = "Alle Einträge eines Benutzers auflisten")
    @GetMapping
    public List<FinanceEntryResponse> list(@PathVariable Long userId) {
        return entryService.listForUser(userId);
    }

    @Operation(summary = "Einzelnen Eintrag eines Benutzers abrufen")
    @GetMapping("/{id}")
    public FinanceEntryResponse get(@PathVariable Long userId, @PathVariable Long id) {
        return entryService.getForUser(userId, id);
    }

    @Operation(summary = "Neuen Eintrag für einen Benutzer anlegen",
            responses = @ApiResponse(responseCode = "201", description = "Eintrag erstellt"))
    @PostMapping
    public ResponseEntity<FinanceEntryResponse> create(@PathVariable Long userId,
                                                       @RequestBody FinanceEntryRequest request) {
        FinanceEntryResponse created = entryService.createForUser(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Eintrag eines Benutzers aktualisieren")
    @PutMapping("/{id}")
    public FinanceEntryResponse update(@PathVariable Long userId,
                                       @PathVariable Long id,
                                       @RequestBody FinanceEntryRequest request) {
        return entryService.updateForUser(userId, id, request);
    }

    @Operation(summary = "Eintrag eines Benutzers löschen",
            responses = @ApiResponse(responseCode = "204", description = "Eintrag gelöscht"))
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long userId, @PathVariable Long id) {
        entryService.deleteForUser(userId, id);
        return ResponseEntity.noContent().build();
    }
}
