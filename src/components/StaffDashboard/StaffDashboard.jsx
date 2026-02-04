import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as foundItemService from '../../services/foundItemService';

const StaffDashboard = () => {
    const [foundItems, setFoundItems] = useState([]);
    const [sortBy, setSortBy] = useState('dateFound');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchStaffItems = async () => {
            const data = await foundItemService.staffIndex();
            setFoundItems(data);
        };
        fetchStaffItems();
    }, []);

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await foundItemService.deleteFoundItem(itemId);
            setFoundItems(foundItems.filter(item => item._id !== itemId));
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const filteredItems = foundItems.filter(item => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query)
        );
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        let aVal, bVal;

        switch (sortBy) {
            case 'dateFound':
                aVal = new Date(a.dateFound);
                bVal = new Date(b.dateFound);
                break;
            case 'category':
                aVal = a.category.toLowerCase();
                bVal = b.category.toLowerCase();
                break;
            case 'item':
                aVal = a.title.toLowerCase();
                bVal = b.title.toLowerCase();
                break;
            case 'claims':
                aVal = a.claims ? a.claims.length : 0;
                bVal = b.claims ? b.claims.length : 0;
                break;
            default:
                return 0;
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div className="page-content">
            <div className="browse-header">
<div className="browse-title-container small-image">
                    <div className="browse-image">
                        <img src="/images/lose_my_head.png" alt="Losing my head" />
                    </div>
                    <div className="browse-title-text">
                        <div className="browse-title">
                            <div className="browse-icon">📋</div>
                            <h1>Staff Dashboard</h1>
                        </div>
                        <p>Manage all found items, review claims, update item status, and add new items. Use the search to quickly find specific items.</p>

                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="🔍 Search items, category, or status..."
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="text-center mt-20">
                            <Link to="/founditems/new" className="btn-primary">
                                Add New Item
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {sortedItems.length === 0 ? (
                <div className="card text-center">
                    <p>No items found.</p>
                </div>
            ) : (
                <div className="table-container actions-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th onClick={() => handleSort('item')} className="sortable">
                                    Item {sortBy === 'item' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('dateFound')} className="sortable">
                                    Date<br />Found {sortBy === 'dateFound' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('category')} className="sortable">
                                    Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Status</th>
                                <th onClick={() => handleSort('claims')} className="sortable">
                                    Claims {sortBy === 'claims' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedItems.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        {item.imageUrls && item.imageUrls[0] ? (
                                            <img
                                                src={item.imageUrls[0]}
                                                alt={item.title}
                                                className="thumbnail"
                                            />
                                        ) : (
                                            <div className="thumbnail no-photo">No photo</div>
                                        )}
                                    </td>
                                    <td>
                                        <Link to={`/staff/founditems/${item._id}`}>
                                            <strong>{item.title}</strong>
                                        </Link>
                                    </td>                                    <td>{new Date(item.dateFound).toLocaleDateString()}</td>
                                    <td>{item.category}</td>
                                    <td>{item.status}</td>
                                    <td>{item.claims ? item.claims.length : 0}</td>
                                    <td>
                                        <Link to={`/staff/founditems/${item._id}`}>View</Link>
                                        <br />
                                        <Link to={`/staff/founditems/${item._id}/edit`}>Edit</Link>
                                        <br />
                                        <Link to="#" onClick={(e) => { e.preventDefault(); handleDelete(item._id); }}>Delete</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;