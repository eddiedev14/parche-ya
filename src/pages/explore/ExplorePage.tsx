import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useAuth } from "../../features/auth";

//? Placeholder: se reemplaza en HU-01 (tabs) y HU-06 (feed de planes)
const ExplorePage = () => {
  const { user, logout } = useAuth();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Explorar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="flex flex-col items-start gap-4 p-4">
          <p className="text-body-lg text-ink">Hola, {user?.displayName}</p>
          <IonButton fill="outline" color="danger" onClick={logout}>
            Cerrar sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ExplorePage;
