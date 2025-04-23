import React, { useEffect, useState } from "react";

const AllMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/medicine");
        const data = await response.json();

        if (data.success) {
          setMedicines(data.data || []);
        } else {
          setError("Failed to fetch medicines.");
        }
      } catch (err) {
        setError("Error fetching medicines: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  return (
    <div style={styles.container}>
      <h2>All Medicines</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.cardContainer}>
        {medicines.map((medicine, index) => {
          const imageUrl = `./images/${medicine.name}.jpg`;

          const expiryDate = new Date(medicine.expiry_date);
          const currentDate = new Date();
          const monthsTillExpiry =
            (expiryDate.getFullYear() - currentDate.getFullYear()) * 12 +
            (expiryDate.getMonth() - currentDate.getMonth());

          return (
            <div key={index} style={styles.card}>
              <img
                src={imageUrl}
                alt={medicine.name}
                style={styles.image}
                onError={(e) => (e.target.src = "./images/fallback.jpg")}
              />
              <h3>{medicine.name}</h3>
              <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
              <p><strong>Batch No:</strong> {medicine.batch_number}</p>
              <p><strong>Quantity:</strong> {medicine.quantity}</p>
              <p><strong>Price:</strong> ₹{medicine.price}</p>
              <p><strong>Expiry:</strong> {expiryDate.toLocaleDateString()}</p>
              <p style={{ color: monthsTillExpiry <= 1 ? "red" : "green" }}>
                <strong>Months till expiry:</strong> {monthsTillExpiry <= 0 ? "Expired" : monthsTillExpiry}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial",
    textAlign: "center",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1.5rem",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "1rem",
    width: "250px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fafafa",
    textAlign: "left",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "0.5rem",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default AllMedicines;
