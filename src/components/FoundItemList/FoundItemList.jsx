import { Link } from 'react-router';

const FoundItemList = ({ foundItems }) => {
  if (!foundItems || foundItems.length === 0) {
    return <p>No items found yet.</p>;
  }

  return (
    <div>
      <h2>Found Items</h2>
      <ul>
        {foundItems.map((item) => (
          <li key={item._id}>
            <Link to={`/founditems/${item._id}`}>
              <h3>{item.publicDescription}</h3>
              <p>Category: {item.category}</p>
              <p>Color: {item.color}</p>
              <p>Location: {item.locationFound}</p>
              <p>Date Found: {new Date(item.dateFound).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoundItemList;