package com.expensetracker.backend.finance.repository;

import com.expensetracker.backend.finance.model.FinanceEntry;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinanceEntryRepository extends JpaRepository<FinanceEntry, Long> {

    List<FinanceEntry> findAllByUserIdOrderByDateDesc(Long userId);

    Optional<FinanceEntry> findByIdAndUserId(Long id, Long userId);
}
