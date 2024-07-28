import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  CssBaseline,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
} from "@mui/material";
import { fetchUsersAdmin } from "./Services/userAPIService";
import { Link } from "react-router-dom";

const AdminMembership = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortOrder, setSortOrder] = useState(0); // Default to Ascending
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(null);

  const searchInputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const loginAndFetchUsers = async () => {
      setLoading(true);
      try {
        // Perform login to get the token
        const loginResponse = await fetch(
          'http://ec2-3-249-123-204.eu-west-1.compute.amazonaws.com/api/auth/v1/login',
          {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: "ultimate@xsisec.com",
              password: "Test1234#!"
            }),
          }
        );

        if (!loginResponse.ok) {
          throw new Error('Failed to log in');
        }

        const loginData = await loginResponse.text();
        const fetchedToken = loginData; // Assuming the token is plain text

        setToken(fetchedToken);

        // Fetch users with the obtained token
        const { users, totalItems } = await fetchUsersAdmin({
          page: currentPage - 1, // Ensure correct page calculation
          size: usersPerPage,
          sortBy: "email",
          order: sortOrder,
          role: selectedRole,
          name: searchName,
          token: fetchedToken,
        });

        const idToRemove = "123"; // Replace with actual user ID if needed
        const updatedUsers = users.filter((user) => user.id !== idToRemove);

        setLoadedUsers(updatedUsers);
        setTotalItems(totalItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };
    loginAndFetchUsers();
  }, [
    currentPage,
    selectedRole,
    usersPerPage,
    sortOrder,
    searchName,
  ]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setCurrentPage(1); // Reset to first page
  };

  const handlePageSizeChange = (event) => {
    setUsersPerPage(event.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchNameChange = (event) => {
    const { value } = event.target;
    setSearchName(value);
    setCurrentPage(1); // Reset to first page

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setSearchName(value);
    }, 500);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page
  };

  const handleNameClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleClearFilters = () => {
    setSelectedRole("all");
    setUsersPerPage(5);
    setSortOrder(0);
    setSearchName("");
    setCurrentPage(1); // Reset to first page
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ padding: 4 }}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 4,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 4,
          }}
        >
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            displayEmpty
            inputProps={{ "aria-label": "Select Role" }}
            sx={{ marginRight: 2 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="standard">Standard</MenuItem>
            <MenuItem value="pro">Pro</MenuItem>
            <MenuItem value="ultimate">Ultimate</MenuItem>
          </Select>
          <Select
            value={usersPerPage}
            onChange={handlePageSizeChange}
            displayEmpty
            inputProps={{ "aria-label": "Select Page Size" }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <Select
            value={sortOrder}
            onChange={handleSortOrderChange}
            displayEmpty
            inputProps={{ "aria-label": "Select Sort Order" }}
          >
            <MenuItem value={0}>Ascending</MenuItem>
            <MenuItem value={1}>Descending</MenuItem>
          </Select>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', marginLeft: 2 }}>
            <TextField
              placeholder="Search by name"
              value={searchName}
              onChange={handleSearchNameChange}
              inputRef={searchInputRef}
              sx={{ marginRight: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </form>
          <Button
            onClick={handleClearFilters}
            variant="contained"
            color="primary"
            sx={{ marginLeft: 2 }}
          >
            Clear All Filters
          </Button>
        </Box>
        {!loading && loadedUsers.length === 0 && (
          <Typography variant="body2">No users found.</Typography>
        )}
        {!loading && loadedUsers.length > 0 && (
          <>
            <Paper sx={{ width: "100%", overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                    <TableCell>Membership</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Billing Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Invoice</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleNameClick(user)}>
                          {user.name}
                        </Button>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
        
                      </TableCell>
                      <TableCell>XX</TableCell>
                      <TableCell>XX</TableCell>
                      <TableCell>XX</TableCell>
                      <TableCell>XX</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          <Link
                            href=""
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Invoice
                          </Link>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
            >
              <Pagination
                count={Math.ceil(totalItems / usersPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>

    </Container>
  );
};

export default AdminMembership;
