import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Rating,
  Pagination,
} from '@mui/material';
import {
  LocationOn,
  Sports,
  Star,
} from '@mui/icons-material';
import { useApp } from '../../context/AppContext';
import { PageHeader, SearchFilter } from '../../components/Common';

const VenuesPage = () => {
  const navigate = useNavigate();
  const { venues } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const sportOptions = ['badminton', 'tennis', 'basketball', 'cricket', 'volleyball', 'squash', 'table tennis'];

  const filteredVenues = useMemo(() => {
    let filtered = venues.filter(venue => 
      venue.status === 'approved' &&
      (searchQuery === '' || 
       venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
       venue.sports.some(sport => sport.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );

    if (filters.sport) {
      filtered = filtered.filter(venue => 
        venue.sports.includes(filters.sport)
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(venue => 
        venue.rating >= filters.rating
      );
    }

    if (filters.location) {
      filtered = filtered.filter(venue => 
        venue.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.priceRange) {
      // Simple price range filter - in real app would parse actual prices
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(venue => {
        const priceText = venue.priceRange;
        const prices = priceText.match(/\d+/g);
        if (prices) {
          const venueMin = parseInt(prices[0]);
          const venueMax = prices.length > 1 ? parseInt(prices[1]) : venueMin;
          return venueMax >= min && venueMin <= max;
        }
        return true;
      });
    }

    return filtered;
  }, [venues, searchQuery, filters]);

  const paginatedVenues = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVenues.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVenues, currentPage]);

  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getSportChips = (sports) => {
    return sports.slice(0, 3).map((sport, index) => (
      <Chip
        key={index}
        label={sport}
        size="small"
        variant="outlined"
        sx={{ mr: 0.5 }}
      />
    ));
  };

  return (
    <Box>
      <PageHeader
        title="Sports Venues"
        subtitle={`Discover ${filteredVenues.length} amazing sports facilities near you`}
      />

      <SearchFilter
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        sportOptions={sportOptions}
        priceRange={[100, 1000]}
        showAdvanced={true}
      />

      {filteredVenues.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Sports sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No venues found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Try adjusting your search criteria or clearing filters
            </Typography>
            <Button variant="contained" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3} mb={4}>
            {paginatedVenues.map((venue) => (
              <Grid item xs={12} sm={6} lg={4} key={venue.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: 4 
                    }
                  }}
                  onClick={() => navigate(`/app/user/venue/${venue.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={venue.images[0]}
                    alt={venue.name}
                  />
                  
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                      {venue.name}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {venue.location}
                      </Typography>
                    </Box>

                    <Box mb={2}>
                      {getSportChips(venue.sports)}
                      {venue.sports.length > 3 && (
                        <Chip
                          label={`+${venue.sports.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 0.5 }}
                        />
                      )}
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Rating
                        value={venue.rating}
                        readOnly
                        precision={0.5}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({venue.totalReviews})
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {venue.priceRange}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/user/venue/${venue.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default VenuesPage;
