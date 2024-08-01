// QueryConsumables.js

import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  CssBaseline,
  Drawer,
  FormControl,
  Grid,
  List,
  ListItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useHttpClient } from "./Hooks/http-hook";
import { useLoginService } from "./Services/useLoginService";
import { fetchConsumables } from "./Services/userAPIService";
import DiabloButton from "./UI/Button";

const QueryConsumables = () => {
  const { data, fetchData } = useLoginService(
    "http://ec2-3-249-123-204.eu-west-1.compute.amazonaws.com/master/api/v1/consumables"
  );

  const [formData, setFormData] = useState({
    mode: "",
    orderType: "",
    region: "",
    consumableType: "",
    consumable: "",
    listingType: "",
    price: "",
  });

  const [errors, setErrors] = useState({});
  const [consumableTypeData, setConsumableTypeData] = useState([]);
  const [modeData, setModeData] = useState([]);
  const [orderTypeData, setOrderTypeData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [listingTypeData, setListingTypeData] = useState([]);
  const [submittedData, setSubmittedData] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const [exactPrice, setExactPrice] = useState(false);

  const { isLoading, sendRequest } = useHttpClient();
  const [loadedConsumables, setLoadedConsumables] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [consumablesPerPage, setConsumablesPerPage] = useState(20);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(null);


  const [size, setSize] = useState(20);
  const [order, setOrder] = useState(0); // 0 for ascending order

 

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




        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };
    loginAndFetchUsers();
  }, [

  ]);



  useEffect(() => {
    const getConsumables = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }
  
        const consumables = await fetchConsumables(
          sendRequest,
          currentPage,
          size,
          token,
          { order } // Pass order as part of filters object
        );
  
        setLoadedConsumables(consumables);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    getConsumables();
  }, [sendRequest, token, currentPage, size, order]);

  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      const responseData = data[0];
      if (responseData) {
        setConsumableTypeData(responseData.consumable_type || []);
        setModeData(responseData.mode || []);
        setOrderTypeData(responseData.orderType || []);
        setRegionData(responseData.region || []);
        setListingTypeData(responseData.listingType || []);
        setExactPrice(responseData.exactPrice || []);

        if (responseData.mode && responseData.mode.length > 0) {
          setFormData((prev) => ({
            ...prev,
            mode: responseData.mode[0].name,
          }));
        }
        if (responseData.orderType && responseData.orderType.length > 0) {
          setFormData((prev) => ({
            ...prev,
            orderType: responseData.orderType[0].name,
          }));
        }
        if (responseData.region && responseData.region.length > 0) {
          setFormData((prev) => ({
            ...prev,
            region: responseData.region[0].name,
          }));
        }
        if (responseData.listingType && responseData.listingType.length > 0) {
          setFormData((prev) => ({
            ...prev,
            listingType: responseData.listingType[0].name,
          }));
        }
      }
    }
  }, [data]);

  const handleInputChange = (name) => (event, newValue) => {
    const newFormData = {
      ...formData,
      [name]: newValue ?? "",
    };
  
    if (name === "consumableType") {
      const options = getOptionsForConsumableType(newValue);
      const firstItem = options.length > 0 ? options[0].name : "";
      newFormData.consumable = firstItem;
  
      // Fetch consumables based on the selected consumableType
      fetchWithFilter(name, newValue);
    }
  
    setFormData(newFormData);
  
    console.log(`${name}: ${newFormData[name]}`);
  };

  const handlePriceChange = (values) => {
    const { value } = values;
    setFormData({
      ...formData,
      price: value,
    });

    console.log(`price: ${value}`);
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.mode) formErrors.mode = "Mode is required";
    if (!formData.orderType) formErrors.orderType = "Order Type is required";
    if (!formData.region) formErrors.region = "Region is required";
    if (!formData.consumableType) formErrors.consumableType = "Consumable Type is required";
    if (!formData.consumable) formErrors.consumable = `${formData.consumableType} is required`;
    if (!formData.listingType) formErrors.listingType = "Listing Type is required";
    if (!formData.price) formErrors.price = "Price is required";
    return formErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      const transformedData = {
        mode: formData.mode,
        orderType: formData.orderType,
        region: formData.region,
        consumableType: formData.consumableType,
        consumable: formData.consumable,
        listingType: formData.listingType,
        price: formData.price,
        sold: false,
        itemType: "consumable",
        exactPrice: exactPrice,
      };

      Object.keys(transformedData).forEach((key) => {
        if (transformedData[key] === "") {
          delete transformedData[key];
        }
      });

      const formDataToSend = new FormData();
      console.log(JSON.stringify(transformedData)); // Log the data being sent
      formDataToSend.append(
        "itemConsumable",
        new Blob([JSON.stringify(transformedData)], {
          type: "application/json",
        })
      );
      console.log(formData);
    }
  };

  useEffect(() => {
    if (formData.listingType === "Exact Price") {
      setExactPrice(true);
      console.log(true);
    } else if (formData.listingType === "Taking Offers") {
      setExactPrice(false);
      console.log(false);
    }
  }, [formData.listingType]);

  const getOptionsForConsumableType = (consumableType) => {
    const key = consumableType.replace(/ /g, "_").toLowerCase();
    return data[0][key] || [];
  };

  const fetchWithFilter = async (newFilter) => {
    setLoading(true);
    try {
      const filters = { ...formData, ...newFilter, order };
  
      const consumables = await fetchConsumables(
        sendRequest,
        currentPage,
        size,
        token,
        filters
      );
      setLoadedConsumables(consumables);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  
  
  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            marginLeft: 2,
            marginTop: 2,
          }}
        >
          {loading ? (
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
          ) : (
            <Grid container spacing={2}>
              {loadedConsumables.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={2}>
                  <Card sx={{ width: "100%" }}>
                    <CardHeader
                      title={
                        <Typography variant="h6">{item.consumable}</Typography>
                      }
                    />
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Type: {item.consumableType}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Mode: {item.mode}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Order Type: {item.orderType}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Region: {item.region}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Listing Type: {item.listingType}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Sold: {item.sold ? "Yes" : "No"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Exact Price: {item.exactPrice ? "Yes" : "No"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Price: {item.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Updated At: {item.updatedAt}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Created At: {item.createdAt}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Box sx={{ marginTop: 4, display: 'flex', justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(loadedConsumables.length / consumablesPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Box>
        </Box>

        <Box sx={{ paddingLeft: "120px" }}></Box>

        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: 0,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: 240,
              boxSizing: "border-box",
              paddingRight: "20px",
              paddingTop: "120px", // Assuming navbar height is 64px
              backgroundColor: "inherit", // Inherit the background color from the parent
              border: "none", // Remove border if any
            },
          }}
        >
          <List>
            <ListItem sx={{ justifyContent: "center" }}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={modeData.map((mode) => mode.name)}
                  value={formData.mode}
                  onChange={(event, newValue) => {
                    handleInputChange("mode")(event, newValue);
                    fetchWithFilter("mode", newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option === value || value === ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Mode"
                      variant="outlined"
                      sx={{ backgroundColor: "transparent" }}
                      error={!!errors.mode}
                      helperText={errors.mode}
                    />
                  )}
                />
              </FormControl>
            </ListItem>
            <ListItem sx={{ justifyContent: "center" }}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={orderTypeData.map((orderType) => orderType.name)}
                  value={formData.orderType}
                  onChange={(event, newValue) => {
                    handleInputChange("orderType")(event, newValue);
                    fetchWithFilter("orderType", newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option === value || value === ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Order Type"
                      variant="outlined"
                      sx={{ backgroundColor: "transparent" }}
                      error={!!errors.orderType}
                      helperText={errors.orderType}
                    />
                  )}
                />
              </FormControl>
            </ListItem>
            <ListItem sx={{ justifyContent: "center" }}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={regionData.map((region) => region.name)}
                  value={formData.region}
                  onChange={(event, newValue) => {
                    handleInputChange("region")(event, newValue);
                    fetchWithFilter("region", newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option === value || value === ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Region"
                      variant="outlined"
                      sx={{ backgroundColor: "transparent" }}
                      error={!!errors.region}
                      helperText={errors.region}
                    />
                  )}
                />
              </FormControl>
            </ListItem>
            <ListItem sx={{ justifyContent: "center" }}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={consumableTypeData.map((type) => type.name)}
                  value={formData.consumableType}
                  onChange={(event, newValue) => {
                    handleInputChange("consumableType")(event, newValue);
                    fetchWithFilter("consumableType", newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option === value || value === ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Consumable Type"
                      variant="outlined"
                      sx={{ backgroundColor: "transparent" }}
                      error={!!errors.consumableType}
                      helperText={errors.consumableType}
                    />
                  )}
                />
              </FormControl>
            </ListItem>
            {formData.consumableType && (
              <ListItem sx={{ justifyContent: "center" }}>
                <FormControl fullWidth margin="normal">
                  <Autocomplete
                    options={getOptionsForConsumableType(
                      formData.consumableType
                    ).map((item) => item.name)}
                    value={formData.consumable}
                    onChange={(event, newValue) => {
                      handleInputChange("consumable")(event, newValue);
                      fetchWithFilter("consumable", newValue);
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option === value || value === ""
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={`Select ${formData.consumableType}`}
                        variant="outlined"
                        sx={{ backgroundColor: "transparent" }}
                        error={!!errors.consumable}
                        helperText={errors.consumable}
                      />
                    )}
                  />
                </FormControl>
              </ListItem>
            )}
            <ListItem sx={{ justifyContent: "center" }}>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  options={listingTypeData.map(
                    (listingType) => listingType.name
                  )}
                  value={formData.listingType}
                  onChange={(event, newValue) => {
                    handleInputChange("listingType")(event, newValue);
                    fetchWithFilter("listingType", newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option === value || value === ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Listing Type"
                      variant="outlined"
                      sx={{ backgroundColor: "transparent" }}
                      error={!!errors.listingType}
                      helperText={errors.listingType}
                    />
                  )}
                />
              </FormControl>
            </ListItem>
            <ListItem sx={{ justifyContent: "center" }}>
              <FormControl fullWidth margin="normal">
                <NumericFormat
                  customInput={TextField}
                  thousandSeparator={true}
                  label="Price"
                  variant="outlined"
                  sx={{ backgroundColor: "transparent" }}
                  value={formData.price}
                  onValueChange={handlePriceChange}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </FormControl>
            </ListItem>
            <ListItem sx={{ justifyContent: "center" }}>
              <DiabloButton
                size="md"
                variant="primary"
                filigree={true}
                onClick={handleSubmit}
              >
                Create Consumable
              </DiabloButton>
            </ListItem>
            <ListItem sx={{ justifyContent: "center" }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  select
                  label="Select Size"
                  value={size}
                  onChange={(e) => {
                    setSize(e.target.value);
                    fetchWithFilter("size", e.target.value);
                  }}
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value={1}>1</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </TextField>
              </FormControl>
            </ListItem>
            <ListItem sx={{ justifyContent: "center" }}>
              <FormControl fullWidth margin="normal">
                <TextField
                  select
                  label="Select Order"
                  value={order}
                  onChange={(e) => {
                    setOrder(e.target.value);
                    fetchWithFilter("order", e.target.value);
                  }}
                  variant="outlined"
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value={0}>Ascending</option>
                  <option value={1}>Descending</option>
                </TextField>
              </FormControl>
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </Container>
  );
};

export default QueryConsumables;
