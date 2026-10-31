import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonToolbar,
} from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import { useLocation, useNavigate } from "react-router-dom";

import { Avatar } from "./Avatar";
import { Logo } from "./Logo";

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}

interface Props {
  //? Id del contenido de la página; IonMenu lo necesita para saber qué empujar/tapar
  contentId: string;
  items: SidebarItem[];
  userName: string;
  userPhotoUrl?: string | null;
  onLogout: () => void;
}

export const Sidebar = ({
  contentId,
  items,
  userName,
  userPhotoUrl,
  onLogout,
}: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <IonMenu contentId={contentId} side="start" type="overlay">
      <IonHeader>
        <IonToolbar>
          <div className="flex items-center gap-2 px-4">
            <Logo size={32} />
            <span className="font-heading text-h4 text-ink">ParcheYa</span>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList lines="none" className="bg-transparent px-2 py-3">
          {items.map((item) => {
            const active = pathname === item.route;

            return (
              <IonMenuToggle key={item.route} autoHide={false}>
                <IonItem
                  button
                  detail={false}
                  onClick={() => navigate(item.route)}
                  className={`rounded-control mb-1 ${active ? "text-primary" : "text-ink"}`}
                  style={{
                    "--background": active ? "#E8481F1F" : "transparent",
                  }}
                >
                  <IonIcon
                    icon={item.icon}
                    slot="start"
                    style={{ marginInlineEnd: "12px" }}
                  />
                  <IonLabel className="text-body">{item.label}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>

      {/* Pie fijo: perfil y cerrar sesión */}
      <div className="border-line flex items-center gap-3 border-t px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <IonMenuToggle autoHide={false} className="min-w-0 flex-1">
          <button
            type="button"
            className="flex w-full min-h-11 items-center gap-3 text-left"
          >
            <Avatar url={userPhotoUrl} name={userName} size={40} />
            <span className="text-body text-ink truncate font-semibold">
              {userName}
            </span>
          </button>
        </IonMenuToggle>

        <button
          type="button"
          aria-label="Cerrar sesión"
          onClick={onLogout}
          className="bg-danger/10 text-danger flex size-11 shrink-0 items-center justify-center rounded-full"
        >
          <IonIcon icon={logOutOutline} className="size-5" />
        </button>
      </div>
    </IonMenu>
  );
};
