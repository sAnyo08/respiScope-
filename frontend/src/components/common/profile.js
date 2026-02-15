import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No profile data</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Phone:</strong> {user.phone}</p>

      {user.specialization && (
        <p><strong>Specialization:</strong> {user.specialization}</p>
      )}

      {user.experience && (
        <p><strong>Experience:</strong> {user.experience} years</p>
      )}

      {user.address && (
        <p><strong>Address:</strong> {user.address}</p>
      )}
    </div>
  );
};

export default Profile;
