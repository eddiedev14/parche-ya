import { useAuth } from "../../features/auth";
import { DashboardLayout } from "../../shared/components/DashboardLayout";

//? Placeholder: se reemplaza en HU-01 (tabs) y HU-06 (feed de planes)
const ExplorePage = () => {
  const { user, logout } = useAuth();

  return (
    <DashboardLayout title="Explorar">
      <div className="p-4">
        <p className="text-body-lg text-ink">Hola</p>
      </div>
    </DashboardLayout>
  );
};

export default ExplorePage;
