import { IonCard, IonSkeletonText } from "@ionic/react";

//? Misma estructura que PlanCard para que no salte el layout al cargar
export const PlanCardSkeleton = () => {
  return (
    <IonCard className="rounded-card border-line m-0 border shadow-sm">
      <div className="flex gap-3 p-4">
        <IonSkeletonText
          animated
          className="m-0 size-11 shrink-0 rounded-full"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <IonSkeletonText animated className="m-0 h-5 w-3/5" />
            <IonSkeletonText animated className="m-0 h-5 w-16 rounded-full" />
          </div>
          <IonSkeletonText animated className="m-0 h-4 w-2/5" />
          <IonSkeletonText animated className="m-0 h-4 w-4/5" />
          <div className="mt-1 flex items-center gap-3">
            <IonSkeletonText animated className="m-0 h-4 w-8" />
            <IonSkeletonText animated className="m-0 h-1.5 flex-1" />
            <IonSkeletonText
              animated
              className="m-0 size-6 shrink-0 rounded-full"
            />
          </div>
        </div>
      </div>
    </IonCard>
  );
};
