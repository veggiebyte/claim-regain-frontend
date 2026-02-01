const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/founditems`;

// Public routes (no auth needed)
const index = async () => {
  try {
    const res = await fetch(BASE_URL);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const show = async (foundItemId) => {
  try {
    const res = await fetch(`${BASE_URL}/${foundItemId}`);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// Protected routes (auth required)
const create = async (foundItemFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foundItemFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const update = async (foundItemId, foundItemFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${foundItemId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(foundItemFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteFoundItem = async (foundItemId) => {
  try {
    const res = await fetch(`${BASE_URL}/${foundItemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// Staff-only routes - get full details including images and private notes
const staffIndex = async () => {
  try {
    const res = await fetch(`${BASE_URL}/staff/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const staffShow = async (foundItemId) => {
  try {
    const res = await fetch(`${BASE_URL}/staff/${foundItemId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export { index, show, create, update, deleteFoundItem, staffIndex, staffShow };