package com.expensetracker.backend.finance.service;

import com.expensetracker.backend.auth.model.User;
import com.expensetracker.backend.auth.repository.UserRepository;
import com.expensetracker.backend.finance.dto.FinanceEntryRequest;
import com.expensetracker.backend.finance.dto.FinanceEntryResponse;
import com.expensetracker.backend.finance.dto.FinanceStatsResponse;
import com.expensetracker.backend.finance.model.EntryType;
import com.expensetracker.backend.finance.model.FinanceEntry;
import com.expensetracker.backend.finance.repository.FinanceEntryRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FinanceEntryService {

    private static final String CURRENCY = "EUR";

    private final FinanceEntryRepository entryRepository;
    private final UserRepository userRepository;

    public FinanceEntryService(FinanceEntryRepository entryRepository, UserRepository userRepository) {
        this.entryRepository = entryRepository;
        this.userRepository = userRepository;
    }

    public FinanceEntryResponse create(String username, FinanceEntryRequest request) {
        validate(request);
        User user = loadUser(username);
        FinanceEntry entry = new FinanceEntry(
                user,
                request.amount(),
                CURRENCY,
                request.description(),
                request.date(),
                request.type()
        );
        return FinanceEntryResponse.from(entryRepository.save(entry));
    }

    public List<FinanceEntryResponse> listOwn(String username) {
        User user = loadUser(username);
        return entryRepository.findAllByUserIdOrderByDateDesc(user.getId()).stream()
                .map(FinanceEntryResponse::from)
                .toList();
    }

    public FinanceEntryResponse getOwn(String username, Long id) {
        User user = loadUser(username);
        FinanceEntry entry = entryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return FinanceEntryResponse.from(entry);
    }

    public FinanceEntryResponse update(String username, Long id, FinanceEntryRequest request) {
        validate(request);
        User user = loadUser(username);
        FinanceEntry entry = entryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        entry.setAmount(request.amount());
        entry.setDescription(request.description());
        entry.setDate(request.date());
        entry.setType(request.type());
        return FinanceEntryResponse.from(entryRepository.save(entry));
    }

    public void delete(String username, Long id) {
        User user = loadUser(username);
        FinanceEntry entry = entryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        entryRepository.delete(entry);
    }

    public List<FinanceEntryResponse> listForUser(Long userId) {
        User user = loadUserById(userId);
        return entryRepository.findAllByUserIdOrderByDateDesc(user.getId()).stream()
                .map(FinanceEntryResponse::from)
                .toList();
    }

    public FinanceEntryResponse getForUser(Long userId, Long id) {
        User user = loadUserById(userId);
        FinanceEntry entry = entryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return FinanceEntryResponse.from(entry);
    }

    public FinanceEntryResponse createForUser(Long userId, FinanceEntryRequest request) {
        validate(request);
        User user = loadUserById(userId);
        FinanceEntry entry = new FinanceEntry(
                user,
                request.amount(),
                CURRENCY,
                request.description(),
                request.date(),
                request.type()
        );
        return FinanceEntryResponse.from(entryRepository.save(entry));
    }

    public FinanceEntryResponse updateForUser(Long userId, Long id, FinanceEntryRequest request) {
        validate(request);
        User user = loadUserById(userId);
        FinanceEntry entry = entryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        entry.setAmount(request.amount());
        entry.setDescription(request.description());
        entry.setDate(request.date());
        entry.setType(request.type());
        return FinanceEntryResponse.from(entryRepository.save(entry));
    }

    public FinanceStatsResponse getStatsForUser(Long userId) {
        User user = loadUserById(userId);
        List<FinanceEntry> entries = entryRepository.findAllByUserIdOrderByDateDesc(user.getId());
        long incomeCount = 0;
        long expenseCount = 0;
        BigDecimal incomeTotal = BigDecimal.ZERO;
        BigDecimal expenseTotal = BigDecimal.ZERO;
        for (FinanceEntry entry : entries) {
            if (entry.getType() == EntryType.INCOME) {
                incomeCount++;
                incomeTotal = incomeTotal.add(entry.getAmount());
            } else {
                expenseCount++;
                expenseTotal = expenseTotal.add(entry.getAmount());
            }
        }
        return new FinanceStatsResponse(
                entries.size(),
                incomeCount,
                expenseCount,
                incomeTotal,
                expenseTotal
        );
    }

    public void deleteForUser(Long userId, Long id) {
        User user = loadUserById(userId);
        FinanceEntry entry = entryRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        entryRepository.delete(entry);
    }

    private User loadUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    private User loadUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void validate(FinanceEntryRequest request) {
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount must be > 0");
        }
        if (request.date() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "date is required");
        }
        if (request.type() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type is required");
        }
    }
}
