import { NewPlanFab } from "../../features/plans";
import { DashboardLayout } from "../../shared/components/DashboardLayout";

//? Placeholder: se reemplaza en HU-09 (mis planes)
const MyPlansPage = () => (
  <DashboardLayout title="Mis planes">
    <div className="p-4">
      <p className="text-body-lg text-ink">Mis planes</p>
    </div>
    <NewPlanFab />
  </DashboardLayout>
);

export default MyPlansPage;
