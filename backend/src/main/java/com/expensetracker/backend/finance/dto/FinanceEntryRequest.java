package com.expensetracker.backend.finance.dto;

import com.expensetracker.backend.finance.model.EntryType;
import java.math.BigDecimal;
import java.time.LocalDate;

public record FinanceEntryRequest(
        BigDecimal amount,
        String description,
        LocalDate date,
        EntryType type
) {
}
