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

import { useAuth } from "@/features/auth";
import { SIDEBAR_ITEMS } from "@/shared/helpers/constants";
import { Sidebar } from "./Sidebar";

interface Props {
  title: string;
  children: ReactNode;
  //? false en pantallas que arrastran su propio contenido (el mapa), para que el scroll de Ionic no pelee con el gesto
  scrollY?: boolean;
}

//? Mismo id para todas las pages: solo hay una montada a la vez dentro del outlet
const CONTENT_ID = "dashboard-content";

export const DashboardLayout = ({ title, children, scrollY = true }: Props) => {
  const { user, logout } = useAuth();

  return (
    <>
      <Sidebar
        contentId={CONTENT_ID}
        items={SIDEBAR_ITEMS}
        userName={user?.displayName ?? ""}
        userPhotoUrl={user?.photoUrl}
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
        <IonContent fullscreen scrollY={scrollY}>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
};
