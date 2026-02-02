import { Routes, Route, useNavigate } from 'react-router';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import FoundItemList from './components/FoundItemList/FoundItemList';
import FoundItemDetails from './components/FoundItemDetails/FoundItemDetails';
import FoundItemForm from './components/FoundItemForm/FoundItemForm';
import ClaimList from './components/ClaimList/ClaimList';
import * as foundItemService from './services/foundItemService';
import * as claimService from './services/claimService';
import StaffDashboard from './components/StaffDashboard/StaffDashboard';
import StaffItemDetails from './components/StaffDashboard/StaffItemDetails';
import FoundItemEditForm from './components/FoundItemForm/FoundItemEditForm';
import { useContext, useState, useEffect } from 'react';

import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [foundItems, setFoundItems] = useState([]);
  const [claims, setClaims] = useState([]);

  const handleAddFoundItem = async (foundItemFormData) => {
    const newFoundItem = await foundItemService.create(foundItemFormData);
    setFoundItems([newFoundItem, ...foundItems]);
    navigate('/staff/dashboard');
  };

  const handleDeleteFoundItem = async (foundItemId) => {
    const deletedFoundItem = await foundItemService.deleteFoundItem(foundItemId);
    setFoundItems(foundItems.filter((item) => item._id !== deletedFoundItem._id));
    navigate('/founditems');
  };

  const handleUpdateFoundItem = async (foundItemId, foundItemFormData) => {
    const updatedFoundItem = await foundItemService.update(foundItemId, foundItemFormData);
    setFoundItems(foundItems.map((item) => (foundItemId === item._id ? updatedFoundItem : item)));
    navigate(`/founditems/${foundItemId}`);
  };

  useEffect(() => {
    const fetchAllFoundItems = async () => {
      const foundItemsData = await foundItemService.index();
      setFoundItems(foundItemsData);
    };
    fetchAllFoundItems();
  }, []);

  useEffect(() => {
    const fetchClaims = async () => {
      const claimsData = await claimService.index();
      setClaims(claimsData);
    };
    if (user) fetchClaims();
  }, [user]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing />} />

        {/* Public routes - anyone can view found items */}
        <Route path='/founditems' element={<FoundItemList foundItems={foundItems} />} />
        <Route path='/founditems/:foundItemId' element={<FoundItemDetails />} />

        {user ? (
          <>
            {/* STAFF only routes */}
            {user.role === 'STAFF' && (
              <>
                <Route path='/staff/dashboard' element={<StaffDashboard />} />
                <Route path='/staff/founditems/:foundItemId' element={<StaffItemDetails />} />
                <Route path='/staff/founditems/:foundItemId/edit' element={<FoundItemEditForm />} />
                <Route path='/founditems/new' element={<FoundItemForm handleAddFoundItem={handleAddFoundItem} />} />
              </>
            )}

            {/* Claims routes - all authenticated users */}
            <Route
              path='/claims'
              element={<ClaimList claims={claims} userRole={user.role} />}
            />
          </>
        ) : (
          <>
            {/* Non-user routes (available only to guests) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;