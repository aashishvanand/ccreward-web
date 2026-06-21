"use client";

import { useState, useCallback, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, useTheme, alpha } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import debounce from 'lodash/debounce';

const MccSearch = ({ onSearch, initialValue = '', placeholder = "Search by merchant name (e.g., Netflix, Amazon)..." }) => {
    const theme = useTheme();
    const [value, setValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);

    // Trigger search when initialValue is provided
    useEffect(() => {
        if (initialValue) {
            setValue(initialValue);
            onSearch(initialValue);
        }
    }, [initialValue]);

    // Debounce the search callback
    const debouncedSearch = useCallback(
        debounce((query) => {
            onSearch(query);
        }, 500),
        [onSearch]
    );

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedSearch(newValue);
    };

    const handleClear = () => {
        setValue('');
        onSearch('');
    };

    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search 
                                sx={{ 
                                    color: isFocused ? 'primary.main' : 'text.secondary',
                                    fontSize: 28,
                                    transition: 'color 0.3s'
                                }} 
                            />
                        </InputAdornment>
                    ),
                    endAdornment: value && (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClear} edge="end" size="small" aria-label="Clear search">
                                <Clear />
                            </IconButton>
                        </InputAdornment>
                    ),
                    sx: {
                        borderRadius: 4,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                        backdropFilter: 'blur(12px)',
                        boxShadow: isFocused 
                            ? `0 8px 30px ${alpha(theme.palette.primary.main, 0.2)}`
                            : `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                        border: `1px solid ${isFocused ? theme.palette.primary.main : alpha(theme.palette.divider, 0.1)}`,
                        padding: '12px 16px',
                        fontSize: '1.1rem',
                        transition: 'box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: `0 8px 25px ${alpha(theme.palette.common.black, 0.1)}`,
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                        },
                    }
                }
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    padding: 0,
                    '& fieldset': {
                        border: 'none',
                    },
                },
            }}
        />
    );
};

export default MccSearch;
