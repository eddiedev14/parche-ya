import { NewPlanFab } from "../../features/plans";
import { DashboardLayout } from "../../shared/components/DashboardLayout";

const ExplorePage = () => {
  return (
    <DashboardLayout title="Explorar">
      <div className="p-4">
        <p className="text-body-lg text-ink">Hola</p>
      </div>
      <NewPlanFab />
    </DashboardLayout>
  );
};

export default ExplorePage;
