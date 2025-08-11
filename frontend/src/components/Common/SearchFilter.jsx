import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Slider,
  Typography,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';

const SearchFilter = ({
  searchValue,
  onSearchChange,
  filters = {},
  onFilterChange,
  onClearFilters,
  sportOptions = [],
  priceRange = [0, 1000],
  showAdvanced = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filterKey, value) => {
    onFilterChange({ ...filters, [filterKey]: value });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== '' && value !== null &&
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  return (
    <Box>
      {/* Search Bar */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          placeholder="Search venues..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            endAdornment: searchValue && (
              <IconButton onClick={() => onSearchChange('')} size="small">
                <Clear />
              </IconButton>
            ),
          }}
        />
        
        <Button
          variant="outlined"
          onClick={() => setShowFilters(!showFilters)}
          startIcon={<FilterList />}
          endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
          sx={{ flexShrink: 0 }}
        >
          Filters
          {getActiveFilterCount() > 0 && (
            <Chip
              label={getActiveFilterCount()}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Button>
      </Box>

      {/* Filters Panel */}
      <Collapse in={showFilters}>
        <Box
          sx={{
            p: 3,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            mb: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Filters</Typography>
            <Button
              onClick={onClearFilters}
              startIcon={<Clear />}
              color="error"
              size="small"
            >
              Clear All
            </Button>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', md: 'repeat(auto-fit, minmax(250px, 1fr))' }}
            gap={3}
          >
            {/* Sport Type Filter */}
            {sportOptions.length > 0 && (
              <FormControl fullWidth>
                <InputLabel>Sport Type</InputLabel>
                <Select
                  value={filters.sport || ''}
                  onChange={(e) => handleFilterChange('sport', e.target.value)}
                  label="Sport Type"
                >
                  <MenuItem value="">All Sports</MenuItem>
                  {sportOptions.map((sport) => (
                    <MenuItem key={sport} value={sport}>
                      {sport.charAt(0).toUpperCase() + sport.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Price Range */}
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Price Range (₹/hour)
              </Typography>
              <Slider
                value={filters.priceRange || priceRange}
                onChange={(e, value) => handleFilterChange('priceRange', value)}
                valueLabelDisplay="auto"
                min={priceRange[0]}
                max={priceRange[1]}
                step={50}
                valueLabelFormat={(value) => `₹${value}`}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="caption">₹{priceRange[0]}</Typography>
                <Typography variant="caption">₹{priceRange[1]}</Typography>
              </Box>
            </Box>

            {/* Rating Filter */}
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Minimum Rating
              </Typography>
              <Rating
                value={filters.rating || 0}
                onChange={(e, value) => handleFilterChange('rating', value)}
                precision={0.5}
              />
            </Box>

            {/* Location Filter */}
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                label="Location"
              >
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="downtown">Downtown</MenuItem>
                <MenuItem value="westside">Westside</MenuItem>
                <MenuItem value="eastside">Eastside</MenuItem>
                <MenuItem value="northside">Northside</MenuItem>
                <MenuItem value="southside">Southside</MenuItem>
              </Select>
            </FormControl>

            {/* Amenities Filter */}
            {showAdvanced && (
              <FormControl fullWidth>
                <InputLabel>Amenities</InputLabel>
                <Select
                  multiple
                  value={filters.amenities || []}
                  onChange={(e) => handleFilterChange('amenities', e.target.value)}
                  label="Amenities"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="parking">Parking</MenuItem>
                  <MenuItem value="cafeteria">Cafeteria</MenuItem>
                  <MenuItem value="changing-rooms">Changing Rooms</MenuItem>
                  <MenuItem value="ac">Air Conditioning</MenuItem>
                  <MenuItem value="equipment-rental">Equipment Rental</MenuItem>
                  <MenuItem value="coaching">Coaching Available</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default SearchFilter;
