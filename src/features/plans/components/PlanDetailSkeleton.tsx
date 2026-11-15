import { IonSkeletonText } from "@ionic/react";

//? Misma forma que el detalle (cabecera, título, organizador y filas) para que no salte al cargar
export const PlanDetailSkeleton = () => (
  <div className="flex flex-col gap-4">
    <IonSkeletonText animated className="rounded-card m-0 h-36" />
    <IonSkeletonText animated className="m-0 h-8 w-3/4" />
    <div className="flex items-center gap-3">
      <IonSkeletonText animated className="m-0 size-10 rounded-full" />
      <IonSkeletonText animated className="m-0 h-4 w-1/2" />
    </div>
    <IonSkeletonText animated className="m-0 h-5 w-4/5" />
    <IonSkeletonText animated className="m-0 h-5 w-3/5" />
    <IonSkeletonText animated className="rounded-card m-0 h-40" />
  </div>
);
