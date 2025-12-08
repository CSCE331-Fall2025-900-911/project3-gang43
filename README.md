# Project 3: Gang 43
i love bubble tea

## File structure

pages: react pages
components: react components
assets: media
services: scripts for external services


## npm command workflow
npm i to install dependencies via node package manager
npm run dev to start application locally


import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, AlertTriangle } from 'lucide-react';

// ... (other imports and component setup)

const ManagerDashboard = () => {
  // ... (other state and useEffect)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reorderItem, setReorderItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  const getLowStockItems = () => {
    return inventoryData.filter((item) => {
      const quantity = parseFloat(item.quantity);
      const reorderLevel = parseFloat(item.reorder_level);
      return !isNaN(quantity) && !isNaN(reorderLevel) && quantity <= reorderLevel;
    });
  };

  const openReorderModal = (item) => {
    setReorderItem(item);
    setIsModalOpen(true);
  };

  const closeReorderModal = () => {
    setIsModalOpen(false);
    setReorderItem(null);
    setNewQuantity('');
  };

  const handleReorder = async () => {
    try {
      const response = await axios.post('/api/inventory/reorder', {
        inventoryId: reorderItem.inventory_id,
        newQuantity: parseFloat(newQuantity)
      });
      if (response.data.success) {
        setInventoryData(inventoryData.map(item => 
          item.inventory_id === reorderItem.inventory_id 
            ? { ...item, quantity: newQuantity } 
            : item
        ));
        closeReorderModal();
        alert('Reorder successful!');
      }
    } catch (error) {
      console.error('Error reordering inventory:', error);
      alert('Failed to reorder. Please try again.');
    }
  };

  // ... (other component logic)

  return (
    <div>
      {/* ... (other dashboard content) */}

      {/* Inventory Alerts */}
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: "bold",
            color: "#0f172a",
            marginBottom: "1.25rem",
          }}
        >
          Inventory Alerts
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {getLowStockItems().length > 0 ? (
            getLowStockItems().map((item) => (
              <div
                key={item.inventory_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderRadius: "12px",
                  background: parseFloat(item.quantity) <= 0 ? "#fee2e2" : "#fef3c7",
                  border:
                    parseFloat(item.quantity) <= 0
                      ? "1px solid #fecaca"
                      : "1px solid #fde68a",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  {parseFloat(item.quantity) <= 0 ? (
                    <AlertCircle color="#dc2626" />
                  ) : (
                    <AlertTriangle color="#d97706" />
                  )}
                  <div>
                    <div style={{ fontWeight: "600", color: "#0f172a" }}>
                      {item.item_name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: parseFloat(item.quantity) <= 0 ? "#dc2626" : "#d97706",
                      }}
                    >
                      {parseFloat(item.quantity) <= 0
                        ? `Out of stock: ${Math.abs(parseFloat(item.quantity))} ${
                            item.unit
                          } needed`
                        : `Only ${item.quantity} ${item.unit} remaining`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openReorderModal(item)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    border: "none",
                    background: parseFloat(item.quantity) <= 0 ? "#dc2626" : "#d97706",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Reorder
                </button>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#64748b",
                padding: "2rem",
              }}
            >
              No low stock items at the moment.
            </div>
          )}
        </div>
      </div>

      {/* Reorder Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            width: '300px'
          }}>
            <h4>Reorder {reorderItem?.item_name}</h4>
            <p>Current quantity: {reorderItem?.quantity} {reorderItem?.unit}</p>
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder="Enter new quantity"
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <button onClick={closeReorderModal} style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: '#e2e8f0',
                cursor: 'pointer'
              }}>
                Cancel
              </button>
              <button onClick={handleReorder} style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: 'none',
                background: '#3b82f6',
                color: 'white',
                cursor: 'pointer'
              }}>
                Confirm Reorder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ... (rest of the dashboard) */}
    </div>
  );
};

export default ManagerDashboard;