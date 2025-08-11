import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Block, Person, Business, SupervisorAccount, Visibility } from '@mui/icons-material';
import { PageHeader } from '../../components/Common';
import { useApp } from '../../context/AppContext';

const UserManagement = () => {
  const { users, updateUser } = useApp();
  const [filter, setFilter] = useState('all');

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <SupervisorAccount />;
      case 'owner': return <Business />;
      default: return <Person />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'owner': return 'success';
      default: return 'primary';
    }
  };

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <Box>
      <PageHeader title="User Management" subtitle="Manage all platform users" />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2}>
            <Button 
              variant={filter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilter('all')}
            >
              All Users ({users.length})
            </Button>
            <Button 
              variant={filter === 'user' ? 'contained' : 'outlined'}
              onClick={() => setFilter('user')}
            >
              Sports Users ({users.filter(u => u.role === 'user').length})
            </Button>
            <Button 
              variant={filter === 'owner' ? 'contained' : 'outlined'}
              onClick={() => setFilter('owner')}
            >
              Facility Owners ({users.filter(u => u.role === 'owner').length})
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar>{user.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="subtitle2">{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={getRoleIcon(user.role)}
                      label={user.role.toUpperCase()} 
                      color={getRoleColor(user.role)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status || 'active'} 
                      color="success" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{user.joinedDate}</TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Block />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default UserManagement;
