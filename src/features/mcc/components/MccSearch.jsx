import { useState, useCallback } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import debounce from 'lodash/debounce';

const MccSearch = ({ onSearch, placeholder = "Search by merchant name..." }) => {
    const [value, setValue] = useState('');

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
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: value && (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClear} edge="end" size="small">
                                <Clear />
                            </IconButton>
                        </InputAdornment>
                    ),
                    sx: {
                        borderRadius: 3,
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': {
                            boxShadow: 2,
                        },
                        '&.Mui-focused': {
                            boxShadow: 3,
                        },
                        transition: 'all 0.3s ease',
                    }
                }
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        border: 'none',
                    },
                },
            }}
        />
    );
};

export default MccSearch;
