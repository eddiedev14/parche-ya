import type { ReactNode } from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useAuth } from "../../features/auth";
import { ROUTES } from "../../router/routes";
import { SIDEBAR_ITEMS } from "../helpers/constants";
import { Sidebar } from "./Sidebar";

interface Props {
  title: string;
  children: ReactNode;
}

//? Mismo id para todas las pages: solo hay una montada a la vez dentro del outlet
const CONTENT_ID = "dashboard-content";

export const DashboardLayout = ({ title, children }: Props) => {
  const { user, logout } = useAuth();

  return (
    <>
      <Sidebar
        contentId={CONTENT_ID}
        items={SIDEBAR_ITEMS}
        userName={user?.displayName ?? ""}
        userPhotoUrl={user?.photoUrl}
        profileRoute={ROUTES.profile}
        onLogout={logout}
      />

      <IonPage id={CONTENT_ID}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>{children}</IonContent>
      </IonPage>
    </>
  );
};
