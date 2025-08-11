import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  action,
  actionLabel,
  onActionClick 
}) => {
  return (
    <Box mb={4}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((crumb, index) => (
            crumb.href ? (
              <Link
                key={index}
                color="inherit"
                href={crumb.href}
                underline="hover"
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={index} color="text.primary">
                {crumb.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}
      
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {(action || actionLabel) && (
          <Button
            variant="contained"
            onClick={onActionClick}
            sx={{ flexShrink: 0 }}
          >
            {actionLabel || action}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
