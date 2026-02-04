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
import VisitorClaimView from './components/ClaimList/VisitorClaimView';


const App = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAddFoundItem = async (foundItemFormData) => {
    const newFoundItem = await foundItemService.create(foundItemFormData);
    navigate('/staff/dashboard');
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/founditems' element={<FoundItemList />} />
        <Route path='/founditems/:foundItemId' element={<FoundItemDetails />} />

        {user ? (
          <>
            {user.role === 'STAFF' && (
              <>
                <Route path='/staff/dashboard' element={<StaffDashboard />} />
                <Route path='/staff/founditems/:foundItemId' element={<StaffItemDetails />} />
                <Route path='/staff/founditems/:foundItemId/edit' element={<FoundItemEditForm />} />
                <Route path='/founditems/new' element={<FoundItemForm handleAddFoundItem={handleAddFoundItem} />} />
                <Route path='/claims/:claimId' element={<ClaimReview />} />
              </>
            )}
            
            {user.role === 'VISITOR' && (
              <>
                <Route path='/claims/:claimId' element={<VisitorClaimView />} />
              </>
            )}

            <Route path='/founditems/:foundItemId/claim' element={<ClaimForm />} />
            <Route path='/claims' element={<ClaimList />} />
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