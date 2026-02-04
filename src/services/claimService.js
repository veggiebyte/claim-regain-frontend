const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/claims`;

// All claim routes require auth
const create = async (claimFormData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(claimFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const index = async () => {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const show = async (claimId) => {
  try {
    const res = await fetch(`${BASE_URL}/${claimId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const update = async (claimId, claimFormData) => {
  try {
    const res = await fetch(`${BASE_URL}/${claimId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(claimFormData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const reviewClaim = async (claimId, reviewData) => {
  try {
    const res = await fetch(`${BASE_URL}/${claimId}/review`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const markPickupComplete = async (claimId, pickupData) => {
  try {
    const res = await fetch(`${BASE_URL}/${claimId}/pickup`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pickupData),
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const deleteClaim = async (claimId) => {
  try {
    const res = await fetch(`${BASE_URL}/${claimId}`, {
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

export { create, index, show, update, reviewClaim, markPickupComplete, deleteClaim };