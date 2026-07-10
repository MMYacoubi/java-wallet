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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Einträge", description = "Finanzeinträge des eingeloggten Benutzers")
@SecurityRequirement(name = "cookieAuth")
@RestController
@RequestMapping("/entries")
public class FinanceEntryController {

    private final FinanceEntryService entryService;

    public FinanceEntryController(FinanceEntryService entryService) {
        this.entryService = entryService;
    }

    @Operation(summary = "Neuen Eintrag anlegen",
            responses = @ApiResponse(responseCode = "201", description = "Eintrag erstellt"))
    @PostMapping
    public ResponseEntity<FinanceEntryResponse> create(Authentication authentication,
                                                       @RequestBody FinanceEntryRequest request) {
        FinanceEntryResponse created = entryService.create(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Alle eigenen Einträge auflisten")
    @GetMapping
    public List<FinanceEntryResponse> list(Authentication authentication) {
        return entryService.listOwn(authentication.getName());
    }

    @Operation(summary = "Einzelnen Eintrag abrufen")
    @GetMapping("/{id}")
    public FinanceEntryResponse get(Authentication authentication, @PathVariable Long id) {
        return entryService.getOwn(authentication.getName(), id);
    }

    @Operation(summary = "Eintrag aktualisieren")
    @PutMapping("/{id}")
    public FinanceEntryResponse update(Authentication authentication,
                                       @PathVariable Long id,
                                       @RequestBody FinanceEntryRequest request) {
        return entryService.update(authentication.getName(), id, request);
    }

    @Operation(summary = "Eintrag löschen",
            responses = @ApiResponse(responseCode = "204", description = "Eintrag gelöscht"))
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        entryService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
