package com.expensetracker.backend.finance.dto;

import java.math.BigDecimal;

public record FinanceStatsResponse(
        long totalCount,
        long incomeCount,
        long expenseCount,
        BigDecimal incomeTotal,
        BigDecimal expenseTotal
) {
}
