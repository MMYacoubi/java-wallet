package com.expensetracker.backend.finance.dto;

import com.expensetracker.backend.finance.model.EntryType;
import com.expensetracker.backend.finance.model.FinanceEntry;
import java.math.BigDecimal;
import java.time.LocalDate;

public record FinanceEntryResponse(
        Long id,
        BigDecimal amount,
        String description,
        LocalDate date,
        EntryType type
) {
    public static FinanceEntryResponse from(FinanceEntry entry) {
        return new FinanceEntryResponse(
                entry.getId(),
                entry.getAmount(),
                entry.getDescription(),
                entry.getDate(),
                entry.getType()
        );
    }
}
