import { Routes, Route, useNavigate } from 'react-router';
import { useContext, useState, useEffect } from 'react';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import FoundItemList from './components/FoundItemList/FoundItemList';
import FoundItemDetails from './components/FoundItemDetails/FoundItemDetails';
import FoundItemForm from './components/FoundItemForm/FoundItemForm';
import FoundItemEditForm from './components/FoundItemForm/FoundItemEditForm';
import ClaimList from './components/ClaimList/ClaimList';
import ClaimForm from './components/ClaimForm/ClaimForm';
import StaffDashboard from './components/StaffDashboard/StaffDashboard';
import StaffItemDetails from './components/StaffDashboard/StaffItemDetails';
import * as foundItemService from './services/foundItemService';
import * as claimService from './services/claimService';
import { UserContext } from './contexts/UserContext';
import ClaimReview from './components/ClaimList/ClaimReview';


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
        <Route path='/' element={<Landing />} />
        <Route path='/founditems' element={<FoundItemList foundItems={foundItems} />} />
        <Route path='/founditems/:foundItemId' element={<FoundItemDetails />} />

        {user ? (
          <>
            {user.role === 'STAFF' && (
              <>
                <Route path='/staff/dashboard' element={<StaffDashboard />} />
                <Route path='/staff/founditems/:foundItemId' element={<StaffItemDetails />} />
                <Route path='/staff/founditems/:foundItemId/edit' element={<FoundItemEditForm />} />
                <Route path='/founditems/new' element={<FoundItemForm handleAddFoundItem={handleAddFoundItem} />} />
              </>
            )}
            <Route path='/founditems/:foundItemId/claim' element={<ClaimForm />} />
            <Route path='/claims' element={<ClaimList claims={claims} userRole={user.role} />} />
            <Route path='/claims/:claimId' element={<ClaimReview />} />
          </>
        ) : (
          <>
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;