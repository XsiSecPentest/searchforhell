// userAPIService.js

const BASE_URL = "http://ec2-3-249-123-204.eu-west-1.compute.amazonaws.com/";



export const fetchUsers = async (sendRequest, page = 0, size = 20, sortBy = 'email', order = 1, role = 'standard', name = '', token) => {
  try {
    let filterOr = '';
    if (role !== 'all') {
      filterOr = `userProfiles.role%7Ceq%7C${role}`;
    }
    if (name) {
      filterOr = `name%7Clike%7C${name}${filterOr ? `%7C${filterOr}` : ''}`;
    }
    const url = `${BASE_URL}api/user/v1/query?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}${filterOr ? `&filterOr=${filterOr}` : ''}`;
    
    const responseData = await sendRequest(
      url,
      "POST",
      null,
      {
        accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    );

    return {
      users: responseData.data, // Ensure this is an array of user data
      totalItems: responseData.totalItems // Total number of items for pagination
    };
  } catch (err) {
    throw err;
  }
};




export const fetchUsersAdmin = async ({ page = 0, size = 20, sortBy = 'email', order = 0, role = 'all', name = '', token }) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', sortBy);
    params.append('order', order);

    const filterOr = [];
    if (role !== 'all' && role !== '') {
      filterOr.push(`userProfiles.role|eq|${role}`);
    }

    if (name !== '') {
      filterOr.push(`name|like|${name}`);
    }

    if (filterOr.length > 0) {
      params.append('filterOr', filterOr.join(','));
    }

    const url = `${BASE_URL}api/user/v1/query?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const responseData = await response.json();
    return {
      users: responseData.data,
      totalItems: responseData.totalItems,
    };
  } catch (err) {
    throw err;
  }
};



const customEncode = (str) => {
  return str.replace(/ /g, ' ');
};


export const fetchConsumables = async (sendRequest, page = 1, size = 20, token, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      size,
    });

    // Always include sortBy createdAt and the custom order encoding
    if (filters.order) {
      queryParams.append("sortBy", `createdAt&order${customEncode(filters.order)}`);
    }

    // Manually append individual filters with custom encoding
    if (filters.region) {
      queryParams.append("filterOr", `region|eq|${customEncode(filters.region)}`);
    }
    if (filters.listingType) {
      queryParams.append("filterAnd", `listingType|eq|${customEncode(filters.listingType)}`);
    }
    if (filters.consumableType) {
      queryParams.append("filterOr", `consumableType|eq|${customEncode(filters.consumableType)}`);
    }
    if (filters.consumable) {
      queryParams.append("filterAnd", `consumableType|eq|${customEncode(filters.consumableType)}&consumable|eq|${customEncode(filters.consumable)}`);
    }
    if (filters.orderType) {
      queryParams.append("filterAnd", `orderType|eq|${customEncode(filters.orderType)}`);
    }
    if (filters.mode) {
      queryParams.append("filterAnd", `mode|eq|${customEncode(filters.mode)}`);
    }

    const url = `${BASE_URL}api/items/v1/consumables/query?${queryParams.toString()}`;

    const responseData = await sendRequest(
      url,
      "POST",
      null,
      {
        accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    );

    return responseData.data;
  } catch (err) {
    throw err;
  }
};
